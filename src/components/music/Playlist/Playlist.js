import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Hidden from '@material-ui/core/Hidden';
import Searchbar from './Searchbar';
import Track from './Track';
import { useInfiniteScroll } from 'react-infinite-scroll-hook';

const Playlist = (props) => {
    const [searchText, setSearchText] = useState('');

    const searchTextChangedHandler = (event) => {
        setSearchText(event.target.value);
    };

    const tracks = filterTracks(props.tracks, searchText);

    const infiniteRef = useInfiniteScroll({
        loading: props.loading,
        hasNextPage: !!props.next,
        onLoadMore: props.onLoadMore,
        scrollContainer: 'window',
    });

    return (
        <>
            <Searchbar
                text={searchText}
                onTextChanged={searchTextChangedHandler}
            />
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Título</TableCell>
                        <Hidden xsDown>
                            <TableCell align="right">Artista</TableCell>
                            <TableCell align="right">Album</TableCell>
                            <TableCell align="right">Duración</TableCell>
                        </Hidden>
                    </TableRow>
                </TableHead>
                <TableBody ref={infiniteRef}>
                    {tracks.map((item) => (
                        <Track
                            key={item.track.id}
                            data={item}
                            selected={props.currentTrackId === item.track.id}
                            onPlay={() => props.onPlay(item.track.uri)}
                        />
                    ))}
                </TableBody>
            </Table>
        </>
    );
};

const filterTracks = (tracks, searchText) => {
    return tracks.filter((item) => {
        return (
            item.track.name.toLowerCase().search(searchText.toLowerCase()) !==
                -1 ||
            item.track.artists[0].name
                .toLowerCase()
                .search(searchText.toLowerCase()) !== -1
        );
    });
};

Playlist.propTypes = {
    tracks: PropTypes.array.isRequired,
    onPlay: PropTypes.func,
    onLoadMore: PropTypes.func,
    loading: PropTypes.bool,
    currentTrackId: PropTypes.string,
};

export default React.memo(Playlist);
