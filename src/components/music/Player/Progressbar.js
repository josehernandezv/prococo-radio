import React from 'react';
import PropTypes from 'prop-types';
import { withTheme } from '@material-ui/core/styles';
import classes from './Player.module.css';

const progressbar = props => {
    const { primary } = props.theme.palette;
    return (
        <div>
            <div 
                className={ classes.progressContainer }
                style={{ backgroundColor: primary['100'] }}
            >
                <div 
                    className={ classes.progress } 
                    style={{
                        width: `${props.progress}%`,
                        backgroundColor: primary['500']
                    }}
                />
            </div>
        </div>
    );
};

progressbar.propTypes = {
    progress: PropTypes.number,
    startTime: PropTypes.number,
    endTime: PropTypes.number,
};

export default withTheme()(progressbar);