import React from 'react';
import RSpotifyPlayer from 'react-spotify-web-playback';
import classes from './SpotifyPlayer.module.css';

const SpotifyPlayer = (props) => (
    <div className={classes.container}>
        <RSpotifyPlayer {...props} magnifySliderOnHover />
    </div>
);

export default SpotifyPlayer;
