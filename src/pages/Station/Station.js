import React from 'react';
import { PlaylistTracks } from 'react-spotify-api';
import Playlist from '../../components/music/Playlist';
import useStation from './hooks/useStation';
import SpotifyPlayer from '../../components/music/SpotifyPlayer';
import classes from './Station.module.css';
import Hidden from '@material-ui/core/Hidden';
import OnlineUsers from '../../components/music/OnlineUsers';

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
                    <div className={classes.container}>
                        <div>
                            <Playlist
                                tracks={data.items}
                                onPlay={playSong}
                                currentTrackId={
                                    currentTrack ? currentTrack.id : ''
                                }
                                onLoadMore={loadMoreData}
                                total={data.total}
                                next={data.next}
                                loading={loading}
                            />
                            <SpotifyPlayer
                                token={token}
                                uris={['spotify:playlist:' + playlistId]}
                                // autoPlay
                                play
                                callback={updateStatus}
                            />
                        </div>
                        <Hidden xsDown>
                            <div className={classes.sidebar}>
                                <OnlineUsers playlistId={playlistId} />
                            </div>
                        </Hidden>
                    </div>
                )
            }
        </PlaylistTracks>
    );
};

export default Station;
