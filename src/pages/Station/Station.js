import React from 'react';
import { PlaylistTracks } from 'react-spotify-api';
import Playlist from '../../components/music/Playlist';
import useStation from './hooks/useStation';
import SpotifyPlayer from '../../components/music/SpotifyPlayer';

const Station = () => {
    const {
        playlistId,
        currentTrack,
        token,
        updateStatus,
        playSong,
    } = useStation();

    if (!playlistId) return null;

    return (
        <PlaylistTracks id={playlistId}>
            {(tracks, loading, error) =>
                tracks &&
                tracks.data && (
                    <>
                        <Playlist
                            tracks={tracks.data.items}
                            onPlay={playSong}
                            currentTrackId={currentTrack ? currentTrack.id : ''}
                        />
                        <SpotifyPlayer
                            token={token}
                            uris={['spotify:playlist:' + playlistId]}
                            autoPlay
                            callback={updateStatus}
                        />
                    </>
                )
            }
        </PlaylistTracks>
    );
};

export default Station;
