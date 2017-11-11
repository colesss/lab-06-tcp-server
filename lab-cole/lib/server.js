'use strict';

const net = require('net');
const port = 3000;
const server = net.createServer();
const User = require('./chatroom.js');

server.on('connection', (socket) => { 
    let user = new User(socket);

    user.commands(user);

    user.socket.on('error', err => console.log(err));
    user.socket.on('disconnect', () => console.log(user.username + ' has left the room.\r'));    
});

server.listen(port, () => {
    console.log('Server on port', port);
});