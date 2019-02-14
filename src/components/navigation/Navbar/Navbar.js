import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import RadioIcon from '@material-ui/icons/Radio';
import classes from './Navbar.module.css';

const navbar = props => (
    <AppBar position="static" color="default" >
        <Toolbar>
            <Button size="large">
                <RadioIcon className={ classes.logoIcon }/>
                Prococo Radio
            </Button>
            <div className={ classes.grow }>
                <Button color="inherit" onClick={ props.onLogout }>Salir</Button>
            </div>
            
        </Toolbar>
    </AppBar>
);


navbar.propTypes = {
    onLogout: PropTypes.func
};

export default navbar;