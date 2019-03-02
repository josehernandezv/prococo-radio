import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withTheme } from '@material-ui/core/styles';

import classes from './Player.module.css';


const progressbar = props => {
    const { primary } = props.theme.palette;

    let expandedStyles = null;
    if (props.isExpanded) {
        expandedStyles = {
            padding: props.theme.spacing.unit * 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }
    }
    return (
        <div style={ expandedStyles }>
            { props.isExpanded && (
                <Typography variant="caption">
                    { convertMs(props.startTime )}
                </Typography>
            )}
            <div 
                className={ classes.progressContainer }
                style={{ 
                    backgroundColor: primary['100'],
                    margin: props.isExpanded ? '0 16px': '0'
                }}
            >
                <div 
                    className={ classes.progress } 
                    style={{
                        width: `${props.progress}%`,
                        backgroundColor: primary['500'],
                    }}
                />
            </div>
            { props.isExpanded && (
                <Typography variant="caption">
                    { convertMs(props.endTime )}
                </Typography>
            )}
        </div>
    );
};

const convertMs = time=> {
    return new Date(time).toTimeString().replace(/.*(\d{2}:\d{2}).*/, "$1");
}

progressbar.propTypes = {
    progress: PropTypes.number,
    startTime: PropTypes.number,
    endTime: PropTypes.number,
    isExpanded: PropTypes.bool
};

export default withTheme()(progressbar);