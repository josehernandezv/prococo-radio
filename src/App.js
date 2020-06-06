import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Layout from './components/Layout';
import Station from './pages/Station';
import Home from './pages/Home';
import { SpotifyApiContext } from 'react-spotify-api';
import useSpotifyAuthorization from './hooks/useSpotifyAuthorization';

const App = () => {
    const { token } = useSpotifyAuthorization();

    if (!token) return null;

    return (
        <SpotifyApiContext.Provider value={token}>
            <Layout>
                <Switch>
                    <Route path="/station" exact component={Station} />
                    <Route path="/" exact component={Home} />
                    <Redirect to="/" />
                </Switch>
            </Layout>
        </SpotifyApiContext.Provider>
    );
};

export default App;
