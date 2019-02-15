import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Card from '../../components/ui/Card';
import classes from './Home.module.css';
import Container from '../../components/ui/Container';

const PROCOCO_ID = '62tndRYihkE8fGyVDu3VhY';
const PROCOCO_FOREVER_ID = '1zXO27kKYMS0drNPc3R6eD';

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
                <div className={ classes.cardsContainer }>
                    <Link to={`/station?playlist=${ PROCOCO_ID }`}>
                        <Card 
                            title="Prococo"
                            variant="primary"
                        />
                    </Link>
                    <Link to={`/station?playlist=${ PROCOCO_FOREVER_ID }`}>
                        <Card 
                            title="Prococo forever"
                            variant="secondary"
                        />
                    </Link>
                    {/* <Card 
                        title="Youtube"
                        variant="ternary"
                    /> */}
                </div>
            </Container>
        );
    }
}

export default Home;