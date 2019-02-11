import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

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
  }
  
  componentDidMount() {
    this.playerCheckInterval = null;

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
  }

  handleLogin = () => {
    console.log(this.state);
    if (this.state.token !== "") {
      this.setState({ loggedIn: true });
      // check every second for the player.
      this.playerCheckInterval = setInterval(this.checkForPlayer, 1000);
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
        current_track: currentTrack,
        position,
        duration,
      } = state.track_window;
      console.log(currentTrack);
      const trackName = currentTrack.name;
      const albumName = currentTrack.album.name;
      const albumArt = currentTrack.album.images[2].url;
      const artistName = currentTrack.artists
        .map(artist => artist.name)
        .join(", ");
      const playing = !state.paused;
      this.setState({
        position,
        duration,
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
    fetch("https://api.spotify.com/v1/playlists/" + PROCOCO_ID, {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).then(res => res.json())
    .then(data => {
      this.setState({ playlist: data });
      console.log(data)
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

  generateRandomString(length) {
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

  render() {
    const {
      token,
      loggedIn,
      artistName,
      trackName,
      albumName,
      albumArt,
      error,
      position,
      duration,
      playing,
      playlist
    } = this.state;

    let songs = null;
    if (playlist) {
      songs = (
        <ul className="playlist">
          { playlist.tracks.items.map(({track}) => {
            // console.log(item)
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
          <p>
            <button onClick={() => this.onPrevClick()}>Previous</button>
            <button onClick={() => this.onPlayClick()}>{playing ? "Pause" : "Play"}</button>
            <button onClick={() => this.onNextClick()}>Next</button>
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
