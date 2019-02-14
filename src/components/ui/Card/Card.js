import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import classes from './Card.module.css';

const card = props => {
    return (
        <Paper className={ [classes.container, classes[props.variant]].join(' ') }>
            <Typography variant="h5">
                { props.title }
            </Typography>
        </Paper>
    );
};

card.propTypes = {
    title: PropTypes.string.isRequired,
    variant: PropTypes.string,
};

card.defaultProps = {
    variant: 'primary'
}

export default card;