const path = require('path')
const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const port = process.env.PORT || 8080

// console.log(path.join(__dirname, '../../public/index.html'))
// app.use(express.static(path.join(__dirname, '../../build')))

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../../public/index.html'))
// })
/******************************************************
                   SOCKET.IO
******************************************************/
var clients = new Map();
class Client {
    constructor(current_room, user, name, socket) {
        this.current_room = current_room;
        this.user = user;
        this.name = name;
        this.socket = socket;
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

function remove_user_socket(socket) {
    for (let i = 0; i < rooms.length; i++) {
        for (let j = 0; j < rooms[i].users.length; j++) {
            if (rooms[i].users[j].socket == socket) {
                rooms[i].users.splice(j, 1);
            }
        }
    }
}

function remove_user(user) {
    for (let i = 0; i < rooms.length; i++) {
        for (let j = 0; j < rooms[i].users.length; j++) {
            if (rooms[i].users[j].user == user) {
                rooms[i].users.splice(j, 1);
            }
        }
    }
}

function room_exists(room_name) {
    return (get_room(room_name) != undefined);
}

// function remove_from_current_room(client) {
//     // remove user from users list of their current room, if they are in one
//     if (clients.get(client)) {
//         let current_room = get_room(clients.get(client).current_room);
//         if (current_room != null) {
//             let index = current_room.users.indexOf(client);
//             if (index !== -1) {
//                 current_room.users.splice(client, 1);
//             }
//         }
//     }
// }

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
        io.emit('set_current_room', rooms);
    });

    socket.on('join_room', (client, client_name, room_name) => {
        console.log("   ");
        console.log("client:" + client);
        console.log("client name:" + client_name);
        console.log("room:" + room_name);

        if (room_exists(room_name)) {
            // remove_from_current_room(client);

            let room = get_room(room_name);

            console.log(" ");
            console.log(room);
            console.log(" ");
            remove_user(client);
            // then add user to new room's user list
            room.users.push(new Client(room_name, client, client_name, socket.id));

            // clients.set(socket.id, new Client(client, client_name));
            // clients.get(client).current_room = room_name;
            //console.log(clients.get(client));

            // and update the client's playlist with the existing party playlist
            //   io.sockets.emit('playlist_add', room, room.playlist);
            console.log(rooms);
            // console.log(clients);
            io.emit('updated_room_list', rooms);
        }
    });

    socket.on('send_track', (data) => {
        io.emit('receive_track', data);
    });

    // socket.on('update_rooms', () => {
    //     io.emit('updated_room_list', rooms);
    // });

    socket.on('disconnect', () => {
        remove_user_socket(socket.id);
        console.log("Removed: " + socket.id);
        console.log(rooms);
        io.emit('updated_room_list', rooms);
        console.log('user disconnected');
    });
})

server.listen(port, () => console.log(`Listening on port ${port}`))