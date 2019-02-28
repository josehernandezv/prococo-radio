import React from 'react';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow'
import moment from 'moment';

const playlist = props => {
    console.log(props.tracks)
    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Título</TableCell>
                    <TableCell align="right">Artista</TableCell>
                    <TableCell align="right">Album</TableCell>
                    <TableCell align="right">Duración</TableCell>
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
                        <TableCell >{ item.track.name }</TableCell>
                        <TableCell align="right">{ item.track.artists[0].name }</TableCell>
                        <TableCell align="right">{ item.track.album.name }</TableCell>
                        <TableCell align="right">{moment.utc(moment.duration(item.track.duration_ms).as('milliseconds')).format('mm:ss')}</TableCell>
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