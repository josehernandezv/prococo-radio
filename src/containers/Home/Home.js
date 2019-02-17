import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '../../components/ui/Card';
import classes from './Home.module.css';
import Container from '../../components/ui/Container';
import * as SpotifyFunctions from '../../containers/Login.js'

const PROCOCO_ID = '62tndRYihkE8fGyVDu3VhY';
const PROCOCO_FOREVER_ID = '1zXO27kKYMS0drNPc3R6eD';

class Home extends Component {

    state = {
        token: ""
    }

    componentDidMount() {
        let accessToken = SpotifyFunctions.checkUrlForSpotifyAccessToken();

        if(accessToken) {
            this.setState({ token: accessToken }, () => { this.handleLogin(); });
        } else {
            this.handleLogin();
        }
    }

    handleLogin = () => {
        if (this.state.token === "") {
            SpotifyFunctions.logInWithSpotify();
        } else {
            this.props.history.replace("/#");
        }
    }

    render() {
        return (
            <Container>
                <div className={ classes.header }>
                    <Typography variant="h3" gutterBottom>
                        Estaciones
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        Escoge la playlist que quieras escuchar. Puedes escuchar música sincronizada con tus amigos y familia.
                    </Typography>
                </div>
                <Grid container spacing={40} className={ classes.cardsContainer }>
                    <Grid item xs={12} sm={6}>
                        <Link to={`/station?playlist=${ PROCOCO_ID }&token=${ this.state.token }`}>
                            <Card 
                                title="Prococo"
                                variant="primary"
                            />
                        </Link>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Link to={`/station?playlist=${ PROCOCO_FOREVER_ID }&token=${ this.state.token }`}>
                            <Card 
                                title="Prococo forever"
                                variant="secondary"
                            />
                        </Link>
                    </Grid>
                </Grid>
                    {/* <Card 
                        title="Youtube"
                        variant="ternary"
                    /> */}
            </Container>
        );
    }
}

export default Home;