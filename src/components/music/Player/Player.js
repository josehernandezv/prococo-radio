import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Fab from '@material-ui/core/Fab';
import FullScreenContent from './FullScreenContent';
import classes from './Player.module.css';

const player = props => {
    const [ isExpanded, setIsExpanded ] = useState(false);

    const toggleExpanded = () => setIsExpanded(!isExpanded);

    return (
        <Paper className={ [classes.container, isExpanded ? classes.expanded : null].join(' ') }>
            <div className={ classes.fullScreenWrapper }>
                { isExpanded && (
                    <FullScreenContent 
                        trackName={ props.trackName }
                        trackImage={ props.albumArt }
                        artist={ props.artist }
                    />
                )}
            </div>
            <div className={ classes.bottomBar }>
                <div className={ classes.leftControls }>
                    <img src={ props.albumArt } alt="album"/>
                    <div>
                        <Typography variant="body1">
                            { props.trackName }
                        </Typography>
                        <Typography variant="caption">
                            { props.artist }
                        </Typography>
                    </div>
                </div>
                <div className={ classes.centerControls }>
                    <IconButton aria-label="Previous" onClick={ props.onPrevious }>
                        <Icon>skip_previous</Icon>
                    </IconButton>
                    <Fab color="secondary" aria-label="Play" className={ classes.playButton } onClick={ props.onTogglePlay }>
                        <Icon>{ props.isPlaying ? 'pause' : 'play_arrow' }</Icon>
                        {/* <Icon>pause</Icon> */}
                    </Fab>
                    <IconButton aria-label="Previous" onClick={ props.onNext }>
                        <Icon>skip_next</Icon>
                    </IconButton>
                </div>
                <div className={ classes.rightControls }>
                    <IconButton aria-label="Previous" onClick={ toggleExpanded } className={ classes.expandButton }>
                        <Icon>keyboard_arrow_up</Icon>
                    </IconButton>
                    <IconButton aria-label="Previous" onClick={ props.onSoundClick }>
                        <Icon>{ props.isMute ? 'volume_off' : 'volume_up' }</Icon>
                    </IconButton>
                </div>
            </div>
            
        </Paper>
    );
};

player.propTypes = {
    trackName: PropTypes.string.isRequired,
    albumArt: PropTypes.string.isRequired,
    artist: PropTypes.string.isRequired,
    onPrevious: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
    onTogglePlay: PropTypes.func.isRequired,
    isPlaying: PropTypes.bool.isRequired,
};

export default player;