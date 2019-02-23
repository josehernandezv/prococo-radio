import React from 'react';
import PropTypes from 'prop-types';
import classes from './Player.module.css';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';

const fullScreenContent = props => (
    <div className={ classes.fullScreen }>
        <div 
            style={{
                position: 'absolute',
                height: '100%',
                width: '100%',
                top: 0,
                left: 0,
                background: `url(${ props.trackImage }) no-repeat center center fixed`, 
                backgroundSize: 'cover', 
                filter: 'grayscale(100%) blur(10px) '
            }}
        />
        <div className={ classes.fullScreenContent }>
            <Avatar
                src={ props.trackImage }
                alt="album"
                className={ classes.avatar }
            />
            <Typography variant="h3" gutterBottom>
                { props.trackName }
            </Typography>
            <Typography variant="h5">
                { props.artist }
            </Typography>
        </div>
    </div>
);

fullScreenContent.propTypes = {
    trackName: PropTypes.string.isRequired,
    trackImage: PropTypes.string.isRequired,
    artist: PropTypes.string.isRequired
};

export default fullScreenContent;