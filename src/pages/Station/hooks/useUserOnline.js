import { useEffect } from 'react';

import { useFirestore } from 'react-redux-firebase';
import useBeforeUnload from '../../../hooks/useBeforeUnload';
import { useUser } from 'react-spotify-api';

const useUserOnline = (playlistId) => {
    const firestore = useFirestore();
    const user = useUser();

    useBeforeUnload(() => {
        if (playlistId && user.data) {
            firestore
                .collection('playlists')
                .doc(playlistId)
                .collection('users')
                .doc(user.data.id)
                .delete();
        }
    });

    useEffect(() => {
        if (user.data && playlistId) {
            const userRef = firestore
                .collection('playlists')
                .doc(playlistId)
                .collection('users')
                .doc(user.data.id);

            userRef.set(user.data);

            return () => {
                userRef.delete();
            };
        }
    }, [user, playlistId, firestore]);
};

export default useUserOnline;
