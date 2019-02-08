import React, { Component } from 'react';
import './App.css';

import queryString from 'query-string'

import SpotifyWebApi from 'spotify-web-api-node';
const spotifyApi = new SpotifyWebApi();

class App extends Component {
  constructor(){
    super();
    const params = this.getHashParams();
    const token = params.access_token;
    console.log(params);
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    this.state = {
      loggedIn: token ? true : false,
      nowPlaying: { name: 'Not Checked', albumArt: '' },
      devices: { name: 'Not Checked' },
      token: token,
      client_id: '9638f8f3c3574c82b9b92e1003f7f8b9',
      client_secret: '78eaa2127b4b4a55bb313e202443d0cf',
      redirect_uri: 'http://localhost:3000/callback',
      scope: 'user-read-private user-read-email user-read-playback-state streaming app-remote-control playlist-read-collaborative'
    };
    this.getNowPlaying = this.getNowPlaying.bind(this);
    this.getDevices = this.getDevices.bind(this);
  }

  componentDidMount() {

	  if(!this.state.token) {
      let query = 'https://accounts.spotify.com/authorize?' +
      queryString.stringify({
        response_type: 'token',
        client_id: this.state.client_id,
        scope: this.state.scope,
        redirect_uri: this.state.redirect_uri,
        state: this.generateRandomString(16)
      });
      console.log(query);
      window.location.href = query;
    }

    this.getNowPlaying();
    this.getDevices();
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
    let hashParams = {};
    let e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q);
    }
    return hashParams;
  }

  getNowPlaying() {
    spotifyApi.getMyCurrentPlayingTrack()
      .then((response) => {
        console.log(response);

        if(response.body.item !== null) {
          this.setState({
            nowPlaying: {
              name: response.body.item.name,
              albumArt: response.body.item.album.images[0].url
            }
          });
        } else {
          this.setState({
            nowPlaying: {
              name: 'Private Session',
              albumArt: ''
            }
          });
        }
      })
  }

  getDevices() {
    spotifyApi.getMyDevices()
      .then((response) => {
        console.log(response);
        this.setState({
          devices: {
            name: response.body.devices[0].name
          }
        });
      })
  }

  seek(position) {
    spotifyApi.seek(position)
      .then(function(data) {
        console.log(data);
      }, function(err) {
        console.log(err);
      });
  }

  playPause() {
    spotifyApi.getMyCurrentPlayingTrack()
      .then((response) => {
        console.log(response);
        if(!response.body.is_playing) {
          spotifyApi.play();
        } else {
          spotifyApi.pause();
        }
      })
  }

  prevSong() {
    spotifyApi.skipToPrevious();

    setTimeout(() => {
      this.getNowPlaying()
    }, 500);
  }

  nextSong() {
    spotifyApi.skipToNext();

    setTimeout(() => {
      this.getNowPlaying()
    }, 500);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Prococo radio
          </p>
        </header>
        <body className="App-body">
          <a href='http://localhost:3000/login' className="App-link"> Login to Spotify </a>
          <div>
            Now Playing: { this.state.nowPlaying.name }
          </div>
          <div>
            <img src={ this.state.nowPlaying.albumArt }/>
          </div>
          <div>
            Device: { this.state.devices.name }
          </div>
          { this.state.loggedIn &&
            <button onClick={() => this.seek(0)}>
              Restart
            </button>
          }
          { this.state.loggedIn &&
            <button onClick={() => this.prevSong()}>
              Previous
            </button>
          }
          { this.state.loggedIn &&
            <button onClick={() => this.playPause()}>
              Play/Pause
            </button>
          }
          { this.state.loggedIn &&
            <button onClick={() => this.nextSong()}>
              Next
            </button>
          }
        </body>
      </div>
    );
  }
}

export default App;
