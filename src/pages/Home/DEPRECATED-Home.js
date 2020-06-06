import React, { Component } from "react";
import { Link } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Card from "../../components/ui/Card";
import classes from "./Home.module.css";
import Container from "../../components/ui/Container";
import * as SpotifyFunctions from "../../lib/spotify";
import { observer } from "mobx-react";
import { playlists } from "../../stores/MusicStore";
// import firebase from '../../lib/firebase'

// const PROCOCO_ID = '62tndRYihkE8fGyVDu3VhY';
// const PROCOCO_FOREVER_ID = '1zXO27kKYMS0drNPc3R6eD';

class Home extends Component {
    state = {
        token: "",
    };

    componentDidMount() {
        let accessToken = SpotifyFunctions.checkUrlForSpotifyAccessToken();

        if (accessToken) {
            this.setState({ token: accessToken }, () => {
                this.handleLogin();
            });
        } else {
            this.handleLogin();
        }

        // firebase.firestore().collection("songs").get().then(function(querySnapshot) {
        //     querySnapshot.forEach(function(doc) {
        //         // doc.data() is never undefined for query doc snapshots
        //         console.log(doc.id, " => ", doc.data());
        //     });
        // });
    }

    handleLogin = () => {
        if (this.state.token === "") {
            SpotifyFunctions.logInWithSpotify();
        } else {
            this.props.history.replace("/#");
        }
    };

    render() {
        const { docs } = playlists;

        return (
            <Container>
                <div className={classes.header}>
                    <Typography variant="h3" gutterBottom>
                        Estaciones
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        Escoge la playlist que quieras escuchar. Puedes escuchar
                        música sincronizada con tus amigos y familia.
                    </Typography>
                </div>
                <Grid container spacing={10} className={classes.cardsContainer}>
                    {docs.map((item, index) => (
                        <Grid item xs={12} sm={6} key={item.id}>
                            <Link
                                to={`/station?playlist=${item.data.spotifyId}&token=${this.state.token}`}
                            >
                                <Card
                                    title={item.data.name}
                                    variant={
                                        index === 0 ? "primary" : "secondary"
                                    }
                                />
                            </Link>
                        </Grid>
                    ))}
                </Grid>
                {/* <Card 
                        title="Youtube"
                        variant="ternary"
                    /> */}
            </Container>
        );
    }
}

export default observer(Home);
