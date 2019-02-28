import React from 'react';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Avatar from '@material-ui/core/Avatar';
import Hidden from '@material-ui/core/Hidden';
import moment from 'moment';
import classes from './Playlist.module.css';

const playlist = props => {
    console.log(props.tracks)
    return (
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
            <TableBody>
                { props.tracks.map(item => (
                    <TableRow 
                        key={ item.id }
                        onClick={() => props.onPlay(item.track.uri)}
                        selected={props.currentTrackId === item.track.id}
                        hover
                    >
                        <TableCell >
                            <div className={ classes.titleCell }>
                                <img src={ item.track.album.images[0].url } alt="album" />
                                { item.track.name }
                            </div>
                        </TableCell>
                        <Hidden xsDown>
                            <TableCell align="right">{ item.track.artists[0].name }</TableCell>
                            <TableCell align="right">{ item.track.album.name }</TableCell>
                            <TableCell align="right">{moment.utc(moment.duration(item.track.duration_ms).as('milliseconds')).format('mm:ss')}</TableCell>
                        </Hidden>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

playlist.propTypes = {
    tracks: PropTypes.array.isRequired,
    onPlay: PropTypes.func,
    currentTrackId: PropTypes.string
};

export default playlist;