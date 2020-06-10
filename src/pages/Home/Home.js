import React from 'react';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '../../components/ui/Card';
import classes from './Home.module.css';
// import Container from '../../components/ui/Container';
import Container from '@material-ui/core/Container';

const PROCOCO_ID = '62tndRYihkE8fGyVDu3VhY';
const PROCOCO_FOREVER_ID = '1zXO27kKYMS0drNPc3R6eD';

const Home = () => (
    <Container>
        <div className={classes.header}>
            <Typography variant="h3" gutterBottom>
                Estaciones
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                Escoge la playlist que quieras escuchar. Puedes escuchar música
                sincronizada con tus amigos y familia.
            </Typography>
        </div>
        <Grid container spacing={10} className={classes.cardsContainer}>
            <Grid item xs={12} sm={6}>
                <Link to={`/station?playlist=${PROCOCO_ID}`}>
                    <Card title="Prococo" variant="primary" />
                </Link>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Link to={`/station?playlist=${PROCOCO_FOREVER_ID}`}>
                    <Card title="Prococo forever" variant="secondary" />
                </Link>
            </Grid>
        </Grid>
    </Container>
);

export default Home;
