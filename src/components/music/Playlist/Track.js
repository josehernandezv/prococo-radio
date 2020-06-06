import React from 'react';
import PropTypes from 'prop-types';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Hidden from '@material-ui/core/Hidden';
import moment from 'moment';
import classes from './Playlist.module.css';

const Track = ({ data, onPlay, selected }) => (
    <TableRow onClick={onPlay} selected={selected} hover>
        <TableCell>
            <div className={classes.titleCell}>
                {data.track.album.images && data.track.album.images.length && (
                    <img src={data.track.album.images[0].url} alt="album" />
                )}
                {data.track.name}
            </div>
        </TableCell>
        <Hidden xsDown>
            <TableCell align="right">{data.track.artists[0].name}</TableCell>
            <TableCell align="right">{data.track.album.name}</TableCell>
            <TableCell align="right">
                {moment
                    .utc(
                        moment
                            .duration(data.track.duration_ms)
                            .as('milliseconds')
                    )
                    .format('mm:ss')}
            </TableCell>
        </Hidden>
    </TableRow>
);

Track.propTypes = {
    data: PropTypes.shape({}).isRequired,
    selected: PropTypes.bool.isRequired,
    onPlay: PropTypes.func.isRequired,
};

export default Track;
