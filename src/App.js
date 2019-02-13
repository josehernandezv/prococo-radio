import React, { Component } from 'react';
import './App.css';
import Button from '@material-ui/core/Button';
import queryString from 'query-string';

const PROCOCO_ID = '62tndRYihkE8fGyVDu3VhY';

class App extends Component {

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
    clientId: "9638f8f3c3574c82b9b92e1003f7f8b9",
    redirectUri: "",
    refresh: 1000,
    progress: 0
  }
  
  componentDidMount() {
    this.playerCheckInterval = null;
    this.statePollingInterval = null;

    setTimeout(() => {
      this.handleLogin();
    }, 500);

    const params = this.getHashParams();

    if(params.access_token) {
      this.setState({ token: params.access_token });
    }
  }

  componentWillUnmount() {
    clearInterval(this.playerCheckInterval);
    clearInterval(this.statePollingInterval);
  }

  handleLogin = () => {
    console.log(this.state);
    if (this.state.token !== "") {
      this.setState({ loggedIn: true });
      // check every second for the player.
      this.playerCheckInterval = setInterval(this.checkForPlayer, 1000);
      this.startStatePolling();
    } else {
      let uri = window.location.origin;
      this.setState({ redirectUri: uri.concat("/callback") });

      const scopes = [
        'streaming',
        'user-read-birthdate',
        'user-read-private',
        'user-modify-playback-state',
        'user-read-email'
      ];

      let query = 'https://accounts.spotify.com/authorize?' +
      queryString.stringify({
        response_type: 'token',
        client_id: this.state.clientId,
        scope: scopes.join(' '),
        redirect_uri: uri.concat("/callback"),
        state: this.generateRandomString(16)
      });
      
      window.location.href = query;
    }
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
      // console.log(currentTrack);
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
        playing
      });
    }
  }

  onPrevClick() {
    this.player.previousTrack();
  }
  
  onPlayClick() {
    this.player.togglePlay();
  }
  
  onNextClick() {
    this.player.nextTrack();
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
    const { token } = this.state;
    let totalPlaylist = null;
    let totalTracks = 0;

    fetch("https://api.spotify.com/v1/playlists/" + PROCOCO_ID, {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
    .then(res => res.json())
    .then(data => {
      totalPlaylist = data;
      totalTracks = data.tracks.total;
      let limit = data.tracks.limit;
      for(let i = limit; i < totalTracks; i += limit){
        fetch("https://api.spotify.com/v1/playlists/" + PROCOCO_ID + "/tracks?offset=" + i + "&limit=100", {
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then(res => res.json())
        .then(data => {
          if(data.items) {
            let newSongs = [...totalPlaylist.tracks.items, ...data.items]
            totalPlaylist.tracks.items = newSongs;
          }
        });
      }
      
      console.log(totalPlaylist);
      this.setState({ playlist: totalPlaylist });
    });
  }

  playSong = uri => {
    console.log(uri)
    const { deviceId, token } = this.state;
    fetch("https://api.spotify.com/v1/me/player/play?device_id=" + deviceId, {
      method: "PUT",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "context_uri": "spotify:playlist:" + PROCOCO_ID,
        "offset": {
          "uri": uri
        }
      }),
    });
  }

  generateRandomString = (length) => {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  getHashParams() {
    let hashParams = window.location.hash
      .substring(1)
      .split('&')
      .reduce(function (initial, item) {
        if (item) {
          var parts = item.split('=');
          initial[parts[0]] = decodeURIComponent(parts[1]);
        }
        return initial;
      }, {});
    return hashParams;
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
      playlist
    } = this.state;

    let songs = null;
    if (playlist) {
      songs = (
        <ul className="playlist">
          { playlist.tracks.items.map(({track}) => {
            return (
              <li key={ track.id } onClick={() => this.playSong(track.uri) }>{ track.name }</li>
            )
          })}
        </ul>
      )
    }
  
    return (
      <div className="App">
        <div className="App-header">
        {error && <p>Error: {error}</p>}
        {loggedIn ?
        (<div>
          <img alt={trackName} src={albumArt}/>
          <p>Artist: {artistName}</p>
          <p>Track: {trackName}</p>
          <p>Album: {albumName}</p>
          <div className="progress-bar">
            <progress className="progress" value={progress} max="100"></progress>
            <span className="start-time">{this.convertMs(position)}</span>
            <span className="end-time">{this.convertMs(duration)}</span>
          </div>
          <p>
            <Button variant="contained" color="primary" className="test-button" onClick={() => this.onPrevClick()}><i className="material-icons">skip_previous</i></Button>
            <Button variant="contained" color="secondary" className="test-button" onClick={() => this.onPlayClick()}><i className="material-icons">{playing ? "pause" : "play_arrow"}</i></Button>
            <Button variant="contained" color="primary" className="test-button" onClick={() => this.onNextClick()}><i className="material-icons">skip_next</i></Button>
          </p>
          { songs }
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

export default App;
