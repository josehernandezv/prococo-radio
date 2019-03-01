import React from 'react';
import PropTypes from 'prop-types';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Icon from '@material-ui/core/Icon';
import classes from './Playlist.module.css';

const searchbar = props => {
    return (
        <TextField
            id="search-bar"
            // label="Buscar"
            placeholder="Buscar..."
            value={ props.text }
            onChange={ props.onTextChanged }
            className={ classes.search }
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <Icon>search</Icon>
                    </InputAdornment>
                ),
            }}
        />
    );
};

searchbar.propTypes = {
    text: PropTypes.string.isRequired,
    onTextChanged: PropTypes.func.isRequired
};

export default searchbar;