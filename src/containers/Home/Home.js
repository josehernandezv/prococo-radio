import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Card from '../../components/ui/Card';
import classes from './Home.module.css';
import Container from '../../components/ui/Container';

class Home extends Component {
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
                <Card 
                    title="Prococo"
                    variant="primary"
                />
                <Card 
                    title="Prococo forever"
                    variant="secondary"
                />
                 <Card 
                    title="Youtube"
                    variant="ternary"
                />
            </Container>
        );
    }
}

export default Home;