const connectedSockets = [];
const messages = [];

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

io.on('connection', (socket) => {

    /**** Chat Message Event **********/
    socket.on('user name', (name, fn) => {
        const userInfo = { id: socket.id, name: name };
        connectedSockets.push(userInfo);
        fn(userInfo);
    });

    /**** Chat Message Event **********/
    socket.on('chat message', ({ id, message }, fn) => {
        let userInfo = connectedSockets.find(a => a.id === id);
        userInfo['message'] = message;
        messages.push(userInfo);
        
        /******* Send Message to client ***********/
        io.emit('chat message', userInfo);
    });

    /********* Disconnected Event */
    socket.on('disconnect', () => {
        // connectedSockets.splice()
        console.log('user disconnected');
    });
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/user.html');
});

app.get('/user', (req, res) => {
    let { id, name } = req.query;
    const user = connectedSockets.find(a => a.id === id);
    if (user)
        return res.sendFile(__dirname + '/index.html');
    else
        return res.sendFile(__dirname + '/error.html');
});


server.listen(3000, () => {
    console.log('listening on *:3000');
});