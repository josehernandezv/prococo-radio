import React, { Component } from 'react';
// import './App.css';
import Button from '@material-ui/core/Button';
import Player from '../components/music/Player';
import Playlist from '../components/music/Playlist';

class Station extends Component {

  state = {
    token: "",
    deviceId: "",
    loggedIn: false,
    error: "",
    trackName: "Track Name",
    artistName: "Artist Name",
    albumName: "Album Name",
    albumArt: "",
    playing: false,
    position: 0,
    duration: 0,
    songs: [],
    playlist: null,
    refresh: 1000,
    progress: 0,
    playlistId: 0,
    mute: false,
    shuffle: false,
    currentTrack: null
  }
  
  componentDidMount() {
    this.playerCheckInterval = null;
    this.statePollingInterval = null;

    let params = new URLSearchParams(window.location.search);
    let accessToken = params.get('token');
    let playlist = params.get('playlist');

    if(accessToken) {
      this.setState({ token: accessToken }, () => { this.handleLogin(); });
    } else {
      this.handleLogin();
    }

    if(playlist) {
      this.setState({ playlistId: playlist });
    }
  }

  handleLogin = () => {
    if (this.state.token !== "") {
      this.setState({ loggedIn: true });
      
      // check every second for the player.
      this.playerCheckInterval = setInterval(this.checkForPlayer, 1000);
      this.startStatePolling();
      this.props.history.replace("/station#");
    } else {
      this.props.history.replace("/#");
    }
  } 

  componentWillUnmount() {
    clearInterval(this.playerCheckInterval);
    clearInterval(this.statePollingInterval);
  }

  checkForPlayer = () => {
    const { token } = this.state;
  
    if (window.Spotify !== null) {
      clearInterval(this.playerCheckInterval);

      this.player = new window.Spotify.Player({
        name: "Prococo Radio",
        getOAuthToken: cb => { cb(token); },
      });
      // Create Event Handlers();
      this.createEventHandlers();
  
      // finally, connect!
      this.player.connect();
    }
  }

  startStatePolling = () => {
    this.statePollingInterval = setInterval(async () => {
      let state = null;
      if(this.player) {
        state = await this.player.getCurrentState();
      }
      if(state !== null) {
        await this.setState({ 
          position: state.position, 
          duration: state.duration,
          progress: this.calcPercentage(state)
        });
      }
    }, this.state.refresh || 1000);
  }

  createEventHandlers = () => {
    this.player.on('initialization_error', e => { console.error(e); });
    this.player.on('authentication_error', e => {
      console.error(e);
      this.setState({ loggedIn: false });
    });
    this.player.on('account_error', e => { console.error(e); });
    this.player.on('playback_error', e => { console.error(e); });
  
    // Playback status updates
    this.player.on('player_state_changed', state => this.onStateChanged(state));
  
    // Ready
    this.player.on('ready', data => {
      let { device_id } = data;
      console.log("Let the music play on!");
      this.setState({ deviceId: device_id });
    });

    this.player.on('ready', async data => {
      let { device_id } = data;
      console.log("Let the music play on!");
      await this.setState({ deviceId: device_id });
      this.transferPlaybackHere();
      this.fetchPlayList();
    });
  }

  onStateChanged = (state) => {
    // if we're no longer listening to music, we'll get a null state.
    if (state !== null) {
      const {
        current_track: currentTrack
      } = state.track_window;
      console.log(currentTrack);
      const trackName = currentTrack.name;
      const albumName = currentTrack.album.name;
      let albumArt = currentTrack.album.images[0].url;
      if(currentTrack.album.images[2]) {
        albumArt = currentTrack.album.images[2].url;
      }
      const artistName = currentTrack.artists
        .map(artist => artist.name)
        .join(", ");
      const playing = !state.paused;
      this.setState({
        trackName,
        albumName,
        albumArt,
        artistName,
        playing,
        currentTrack
      });
    }
  }

  onPrevClick = () => {
    this.player.previousTrack();
  }
  
  onPlayClick = () => {
    this.player.togglePlay();
  }
  
  onNextClick = () => {
    this.player.nextTrack();
  }

  onSoundClick = () => {
    if(this.state.mute) {
      this.player.setVolume(1);
      this.setState({ mute: false });
    } else {
      this.player.setVolume(0);
      this.setState({ mute: true });
    }
  }

  onShuffleClick = () => {
    const { token, shuffle } = this.state;
    fetch("https://api.spotify.com/v1/me/player/shuffle?state=" + !shuffle, {
      method: "PUT",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    });
    if(shuffle) {
      this.setState({ shuffle: false });
    } else {
      this.setState({ shuffle: true });
    }
  }

  transferPlaybackHere = () => {
    const { deviceId, token } = this.state;
    fetch("https://api.spotify.com/v1/me/player", {
      method: "PUT",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "device_ids": [ deviceId ],
        "play": true,
      }),
    });
  }

  fetchPlayList = () => {
    const { token, playlistId } = this.state;

    fetch("https://api.spotify.com/v1/playlists/" + playlistId, {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
    .then(res => res.json())
    .then(data => {
      this.setState(
        { playlist: data },
        () => {
          this.fetchAllTracks();
        })
    });
  }

  fetchAllTracks = () => {
    const { token, playlistId, playlist } = this.state;
    let totalPlaylist = playlist;
    let totalTracks = totalPlaylist.tracks.total;
    let limit = totalPlaylist.tracks.limit;
    
    for(let i = 100; i < totalTracks; i += limit){
      let request = "https://api.spotify.com/v1/playlists/" + playlistId + "/tracks?offset=" + i + "&limit=100";
      fetch(request, {
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then(response => response.json())
      .then(data => {
        if(data.items) {
          let newSongs = [...totalPlaylist.tracks.items, ...data.items];
          newSongs.sort(function(a, b){
            if(a.added_at < b.added_at) { return -1; }
            if(a.added_at > b.added_at) { return 1; }
            return 0;
          });
          totalPlaylist.tracks.items = newSongs;
        }
        this.setState({ playlist: totalPlaylist });
      });
    }
  }

  playSong = uri => {
    const { deviceId, token, playlistId } = this.state;
    fetch("https://api.spotify.com/v1/me/player/play?device_id=" + deviceId, {
      method: "PUT",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "context_uri": "spotify:playlist:" + playlistId,
        "offset": {
          "uri": uri
        }
      }),
    });
  }

  convertMs = (time) => {
    if(time) {
      return new Date(time).toTimeString().replace(/.*(\d{2}:\d{2}).*/, "$1");
    }
  }

  calcPercentage = (state) => {
    return (state.position * 100 / state.duration);
  }

  render() {
    const {
      loggedIn,
      artistName,
      trackName,
      albumName,
      albumArt,
      error,
      position,
      duration,
      progress,
      playing,
      playlist,
      mute,
      shuffle
    } = this.state;

    return (
      <div className="App">
        <Playlist 
          tracks={playlist ? playlist.tracks.items : []}
          onPlay={ this.playSong }
          currentTrackId={this.state.currentTrack ? this.state.currentTrack.id : '' }
        />
        <div className="App-header">
        <Player 
          artist={ artistName}
          trackName={ trackName }
          albumArt={ albumArt }
          onPrevious={ this.onPrevClick }
          onNext={ this.onNextClick }
          onTogglePlay={ this.onPlayClick }
          isPlaying={ playing }
          onSoundClick={ this.onSoundClick }
          onShuffleClick={ this.onShuffleClick }
          isMute={ mute }
          isShuffle={ shuffle }
        />
        {error && <p>Error: {error}</p>}
        {loggedIn ?
        (<div>
          <div className="progress-bar">
            <progress className="progress" value={progress} max="100"></progress>
            <span className="start-time">{this.convertMs(position)}</span>
            <span className="end-time">{this.convertMs(duration)}</span>
          </div>
        </div>)
        :
        (<div>
          <p>
            Loading...
          </p>
        </div>)
        }
        </div>
      </div>
    );
  }
}

export default Station;
