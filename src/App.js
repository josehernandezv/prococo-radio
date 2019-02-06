import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Prococo radio
          </p>
          <a
            className="App-link"
            href="https://open.spotify.com/user/12134256895/playlist/62tndRYihkE8fGyVDu3VhY?si=KCM8ei8OTLych230raywLw"
            target="_blank"
            rel="noopener noreferrer"
          >
            Abrir playlist
          </a>
        </header>
      </div>
    );
  }
}

export default App;
