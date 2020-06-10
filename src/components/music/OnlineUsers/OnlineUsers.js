import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import { useSelector } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';
import Badge from './Badge';

const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(3),
    },
}));

const OnlineUsers = ({ playlistId }) => {
    const classes = useStyles();
    useFirestoreConnect([
        {
            collection: 'playlists',
            doc: playlistId,
            subcollections: [{ collection: 'users' }],
            storeAs: 'users',
        },
    ]);
    const users = useSelector((state) => state.firestore.ordered.users);
    return (
        <div className={classes.container}>
            <Typography variant="h6" gutterBottom>
                Online
            </Typography>
            <List>
                {users &&
                    users.map((user) => (
                        <ListItem key={user.id}>
                            {user.images && user.images.length && (
                                <ListItemAvatar>
                                    <Badge
                                        overlap="circle"
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'right',
                                        }}
                                        variant="dot"
                                    >
                                        <Avatar
                                            src={user.images[0].url}
                                            alt="Facebook profile pic"
                                        />
                                    </Badge>
                                </ListItemAvatar>
                            )}
                            <ListItemText primary={user.display_name} />
                        </ListItem>
                    ))}
            </List>
        </div>
    );
};

export default React.memo(OnlineUsers);
