import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { create } from 'jss';
import { createGenerateClassName, jssPreset } from '@material-ui/core/styles';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { StylesProvider } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import theme from './theme';
import Navbar from '../navigation/Navbar';

const generateClassName = createGenerateClassName({
    dangerouslyUseGlobalCSS: true,
    productionPrefix: 'c',
});

const jss = create({
    ...jssPreset(),
    // We define a custom insertion point that JSS will look for injecting the styles in the DOM.
    insertionPoint: document.getElementById('jss-insertion-point'),
});

const styles = (theme) => ({
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
});

const Layout = (props) => {
    const { classes } = props;
    return (
        <StylesProvider jss={jss} generateClassName={generateClassName}>
            <MuiThemeProvider theme={theme}>
                <div>
                    <CssBaseline />
                    <Navbar />
                    <main className={classes.content}>
                        {/* <div className={classes.toolbar} /> */}
                        {props.children}
                    </main>
                </div>
            </MuiThemeProvider>
        </StylesProvider>
    );
};

export default withStyles(styles)(Layout);
