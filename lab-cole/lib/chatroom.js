'use strict';

//Constructor function
function User (socket) {
    this.username = `User ${Math.random()}`;
    this.socket = socket;
    User.socketPool.push(this);
}

User.socketPool = [];

//Welcome message to user
User.prototype.welcome = function (user){
    //Public message for chatroom, informing who has just joined the room.
    User.socketPool.forEach(users => {
        users.socket.write(user.username + ' has entered the chatroom.\r');
    });
    //Private messgae for the user, welcoming and giving information for more command options.
    user.socket.write('Welcome ' + user.username + '!\r');
    user.socket.write('To change your username, type /n.\r');    
    user.socket.write('Type /c for a list of commands.\r');
    
};

//Command options to pop up when user types /c
User.prototype.commandOptions = function (user, text) {
    if (text.startsWith('/c')) {
        user.socket.write('Type /n to set your username');
        user.socket.write('Tyoe /l to see what users are in the chatroom');
        user.socket.write('Type /p to message a user privately');
        user.socket.write('Type /q to leave the chatroom');
    }
};

//Type /n to use
User.prototype.setNickname = function (user, text) {
    //Storing old username to use in public messaage to group, informaing username change
    let previousUsername = user.username;

    //Code to actually change the username
    if (text.startsWith('/n')) {
        //Code to turn text written and turn into username, sans /n text
        user.socket.username = text.split(' ')[1].trim();

        //Public message to chatroom letting users know that the user has changed their username
        User.socketPool.forEach(users => {
            users.socket.write(previousUsername + ' has changed their username to ' + user.username + '\r');
        });
    }
};

//Type /l to write list of users
User.prototype.userList = function (user, text) {
    //writes each users usernames when /l is entered
    if (text.startsWith('/l')) {
        user.socket.write('Current Users in the Chatroom: \r');        
        //Writes all the current users
        User.socketPool.forEach(users => {
            user.socket.write(users.username + '\r');
        });
    }
};

//Type to send a message to chatroom
User.prototype.message = function (user, text) {
    User.socketPool.forEach(users => {
        users.socket.write(user.username + ': ' + text + '\r');
    });
};

//Type /p to private message a user
User.prototype.privateMessage = function (user, text) {
    if (text.startsWith('/p')) {
        let messagedUser = text.split(' ')[1].trim();
        let privateMessage = text.split(' ').slice(2).join(' ');
        User.socketPool.forEach(users => {
            if (users.username === messagedUser) {
                users.socket.write(user.username + ' messaged: ' + privateMessage + '\r');
            }
        });
    }
};

//Type /q to exit chatroom
User.prototype.quit = function (user, text) {
    if ( text.startsWith('/q')) {
        User.socketPool.forEach(users => {
            users.socket.write(user.username + ' has left the chatroom.\r');
        });
    }
    user.socket.destroy();
};

User.prototype.commands = function(user) {
    user.welcome(user);

    user.socket.on('data', (buffer) => {
        let text = buffer.toString();
        user.commandOptions(user, text);
        user.setNickname(user, text);
        user.userList(user, text);
        user.message(user, text);
        user.privateMessage(user, text);
        user.quit(user, text);
    });
};

module.exports = User;