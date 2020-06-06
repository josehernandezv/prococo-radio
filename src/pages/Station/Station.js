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
            {({ data, loadMoreData, loading }) =>
                data && (
                    <>
                        <Playlist
                            tracks={data.items}
                            onPlay={playSong}
                            currentTrackId={currentTrack ? currentTrack.id : ''}
                            onLoadMore={loadMoreData}
                            total={data.total}
                            next={data.next}
                            loading={loading}
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
