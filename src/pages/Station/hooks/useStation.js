import { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { playTrackFromPlaylist } from '../../../lib/spotify';
import { useHistory } from 'react-router-dom';
import { SpotifyApiContext } from 'react-spotify-api';
import { useSelector } from 'react-redux';
import { useFirestore, useFirestoreConnect } from 'react-redux-firebase';
import useUserOnline from './useUserOnline';

const useStation = () => {
    const firestore = useFirestore();
    const history = useHistory();
    const [playlistId, setPlaylistId] = useState(null);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [deviceId, setDeviceId] = useState(null);

    const user = useUserOnline(playlistId);

    useFirestoreConnect([
        {
            collection: 'playlists',
            doc: playlistId,
        },
    ]);

    const playlistDoc = useSelector(
        ({ firestore: { data } }) =>
            data.playlists && data.playlists[playlistId]
    );

    const token = useContext(SpotifyApiContext);

    const playlistRef = useMemo(() => {
        if (playlistId) {
            return firestore.collection('playlists').doc(playlistId);
        }
        return null;
    }, [firestore, playlistId]);

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
        if (status.track !== currentTrack) {
            setCurrentTrack(status.track);
            if (playlistRef && status.track.id) {
                playlistRef.update({
                    currentTrack: status.track,
                    dj: user.data.id,
                });
            }
        }
        if (status.deviceId !== deviceId) {
            setDeviceId(status.deviceId);
        }
    };

    const playSong = useCallback(
        (uri) => {
            playTrackFromPlaylist(token, deviceId, playlistId, uri);
        },
        [deviceId, playlistId, token]
    );

    useEffect(() => {
        if (playlistDoc && playlistDoc.currentTrack && user.data && deviceId) {
            if (
                !currentTrack ||
                (currentTrack.id !== playlistDoc.currentTrack.id &&
                    user.data.id !== playlistDoc.dj)
            ) {
                playSong(playlistDoc.currentTrack.uri);
            }
        }
    }, [currentTrack, deviceId, playSong, playlistDoc, user.data]);

    return {
        playlistId,
        currentTrack,
        token,
        updateStatus,
        playSong,
    };
};

export default useStation;
