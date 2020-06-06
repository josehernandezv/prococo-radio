import { useState, useEffect, useContext } from 'react';
import { playTrackFromPlaylist } from '../../../lib/spotify';
import { useHistory } from 'react-router-dom';
import { SpotifyApiContext } from 'react-spotify-api';

const useStation = () => {
    const [playlistId, setPlaylistId] = useState(null);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [deviceId, setDeviceId] = useState(null);
    const history = useHistory();

    const token = useContext(SpotifyApiContext);

    useEffect(() => {
        let params = new URLSearchParams(window.location.search);
        let playlist = params.get('playlist');
        if (playlist) {
            setPlaylistId(playlist);
        } else {
            history.replace('/');
        }
    }, [history]);

    const updateStatus = (status) => {
        console.log(status);

        if (status.track !== currentTrack) {
            setCurrentTrack(status.track);
        }
        if (status.deviceId !== deviceId) {
            setDeviceId(status.deviceId);
        }
    };

    const playSong = (uri) => {
        playTrackFromPlaylist(token, deviceId, playlistId, uri);
    };

    return {
        playlistId,
        currentTrack,
        token,
        updateStatus,
        playSong,
    };
};

export default useStation;
