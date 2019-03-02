import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Fab from '@material-ui/core/Fab';
import FullScreenContent from './FullScreenContent';
import Hidden from '@material-ui/core/Hidden';
import Progressbar from './Progressbar';
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
            <Progressbar 
                progress={ props.songProgress }
                startTime={ props.songPosition }
                endTime={ props.songDuration }
            />
            <div className={ classes.bottomBar }>
                <Hidden xsDown>
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
                </Hidden>
                <div className={ classes.centerControls }>
                    <IconButton aria-label="Previous" onClick={ props.onPrevious }>
                        <Icon>skip_previous</Icon>
                    </IconButton>
                    <Fab color="secondary" aria-label="Play" className={ classes.playButton } onClick={ props.onTogglePlay }>
                        <Icon>{ props.isPlaying ? 'pause' : 'play_arrow' }</Icon>
                        {/* <Icon>pause</Icon> */}
                    </Fab>
                    <IconButton aria-label="Next" onClick={ props.onNext }>
                        <Icon>skip_next</Icon>
                    </IconButton>
                </div>
                <Hidden xsDown>
                    <div className={ classes.rightControls }>
                        <IconButton aria-label="Show" onClick={ toggleExpanded } className={ classes.expandButton }>
                            <Icon>keyboard_arrow_up</Icon>
                        </IconButton>
                        <IconButton aria-label="Mute" onClick={ props.onSoundClick }>
                            <Icon>{ props.isMute ? 'volume_off' : 'volume_up' }</Icon>
                        </IconButton>
                        <IconButton aria-label="Shuffle" color={ props.isShuffle ? 'primary' : 'default' } onClick={ props.onShuffleClick }>
                            <Icon>shuffle</Icon>
                        </IconButton>
                    </div>
                </Hidden>
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
    songProgress: PropTypes.number.isRequired,
    songPosition: PropTypes.number.isRequired,
    songDuration: PropTypes.number.isRequired,
};

export default player;