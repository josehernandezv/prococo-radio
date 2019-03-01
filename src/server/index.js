const path = require('path')
const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const port = process.env.PORT || 8080

/******************************************************
                   SOCKET.IO
******************************************************/
var clients = new Map();
class Client {
    constructor(socket) {
        this.socket = socket,
            this.current_room = ""
    }
}

// Would prefer to use a map for rooms, but socket.io does not allow
// transmitting map types. Using array of objects instead.
var rooms = [];
class Room {
    constructor(room_name) {
        this.name = room_name;
        this.users = [];
        this.playlist = room_name;
    }
}

// will improve instead of iterating through linearly, this is just quick and dirty
function get_room(room_name) {
    for (let i = 0; i < rooms.length; i++) {
        if (rooms[i].name == room_name) {
            return rooms[i];
        }
    }
}

function room_exists(room_name) {
    return (get_room(room_name) != undefined);
}

function remove_from_current_room(client) {
    // remove user from users list of their current room, if they are in one
    if (clients.get(client)) {
        let current_room = get_room(clients.get(client).current_room);
        if (current_room != null) {
            let index = current_room.users.indexOf(client);
            if (index !== -1) {
                current_room.users.splice(client, 1);
            }
        }
    }
}

// This is what the socket.io syntax is like, we will work this later
io.on('connection', socket => {
    console.log('User connected')

    socket.on('new_room', (room) => {
        if (!room_exists(room)) {
            if (room != null) {
                console.log("room created: " + room);
                rooms.push(new Room(room));
            }
        } else {
            console.log("room already exists");
        }
        socket.emit('current_room', room);
        socket.emit('updated_room_list', rooms);
    });

    socket.on('join_room', (client, room_name) => {
        console.log("client:" + client);
        console.log("room:" + room_name);
        if (room_exists(room_name)) {
            remove_from_current_room(client);

            let room = get_room(room_name);

            // then add user to new room's user list
            room.users.push(client);
            // clients.get(client).current_room = room_name;
            //console.log(clients.get(client));

            // and update the client's playlist with the existing party playlist
            //   io.sockets.emit('playlist_add', room, room.playlist);
            console.log(rooms);
            console.log(clients);
        }
    });

    socket.on('send_track', (data) => {
        io.emit('receive_track', data);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
})

server.listen(port, () => console.log(`Listening on port ${port}`))