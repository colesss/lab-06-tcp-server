'use strict';

const net = require("net");
const port = 3000;
const server = net.chatroomServer();

let socketPool = [];

// function Message (buffer){
//     this.buffer = buffer

// }

server.on('connection', (socket) => {
    
    socket.username = `User ${Math.random()}`;

    socketPool = [...socketPool, socket];

    socket.on("data", (buffer) => {
        
        let text = buffer.toString(); 
        
        if (text.startsWith("/nickname")) {
            socket.username = text.trim().split(" ").slice(1).join(" ");
            //code
        }

        if (text.startsWith("/dm")) {
            let message = text.trim().split(" ").slice(1).join(" ");
            //code
        }

        if (text.startsWith("/quit")) {
            socket.destroy();
            console.log( `${socket.username} has left the room`);//if this is ends up being a general message to the chat room
            console.log( `${socket.username}, your chat session has ended`);//if this is ends up being a general message to the user
        }

        console.log(socket.username, ":", text);

        socketPool.forEach(function(connection) {
            connection.write(text);
        });



    })
});

server.listen(port, () => {
    console.log("Alive on port", port);
});