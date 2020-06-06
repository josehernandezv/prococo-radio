import { useState, useEffect } from 'react';
import * as SpotifyFunctions from '../lib/spotify';
import { useHistory } from 'react-router-dom';

const useSpotifyAuthorization = () => {
    const [token, setToken] = useState(null);
    const history = useHistory();

    useEffect(() => {
        let accessToken = SpotifyFunctions.checkUrlForSpotifyAccessToken();
        if (accessToken) {
            setToken(accessToken);
        } else {
            SpotifyFunctions.logInWithSpotify();
        }
    }, []);

    useEffect(() => {
        if (token) history.replace('/#');
    }, [history, token]);

    return {
        token,
    };
};

export default useSpotifyAuthorization;
