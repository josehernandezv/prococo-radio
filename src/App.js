import React, { Component } from 'react';
// import Script from 'react-load-script';
import './App.css';
import queryString from 'query-string'
import SpotifyWebApi from 'spotify-web-api-node';
const spotifyApi = new SpotifyWebApi();

class App extends Component {
  constructor(){
    super();
    const params = this.getHashParams();
    const token = params.access_token;
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
      scope: 'user-read-private user-read-email user-read-playback-state streaming app-remote-control playlist-read-collaborative',
      percentage: 0,
      progress: 0,
      duration: 0
    };
    this.getNowPlaying = this.getNowPlaying.bind(this);
    this.getDevices = this.getDevices.bind(this);
    this.calcPercentage = this.calcPercentage.bind(this);
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

    this.intervalID = setInterval(
      () => this.progressBar(),
      1000
    );

    this.getNowPlaying();
    this.getDevices();
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
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
    spotifyApi.getMyCurrentPlaybackState()
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
    spotifyApi.getMyCurrentPlaybackState()
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

  calcPercentage(data) {
    return (data.body.progress_ms * 100 / data.body.item.duration_ms);
  }

  convertMs(time){
    return new Date(time).toTimeString().replace(/.*(\d{2}:\d{2}).*/, "$1");
  }

  progressBar() {
    spotifyApi.getMyCurrentPlaybackState()
      .then((response) => {
        console.log(response);
        this.setState({
          percentage: this.calcPercentage(response),
          nowPlaying: {
            name: response.body.item.name,
            albumArt: response.body.item.album.images[0].url
          },
          progress: this.convertMs(response.body.progress_ms),
          duration: this.convertMs(response.body.item.duration_ms)
        });
      })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Prococo radio
          </p>
          {/* <Script
            url="https://sdk.scdn.co/spotify-player.js"
          /> */}
        </header>
        <div className="Prococo">
          <a href='http://localhost:3000/login' className="App-link"> Login to Spotify </a>
          <div>
            Now Playing: { this.state.nowPlaying.name }
          </div>
          <div>
            <img alt={ this.state.nowPlaying.name } src={ this.state.nowPlaying.albumArt }/>
          </div>
          <div>
            Device: { this.state.devices.name }
          </div>
          <div className="flex">
            <div className="time">{ this.state.progress }</div>
            <div className="progress">
              <div className="progress-bar" style={{ width: `${this.state.percentage}%` }}></div>
            </div>
            <div className="time">{ this.state.duration }</div>
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
        </div>
      </div>
    );
  }
}

export default App;
