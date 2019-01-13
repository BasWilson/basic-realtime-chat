const io = require('socket.io');
const server = io.listen(7575);
const striptags = require('striptags');

// Stores the previously sent messages
var previousMessages = [];

// Whenever a client connects
server.on('connection', (socket) => {

    console.log(`Someone has connected: ${socket.id}`);

    // Emit the previous messages to this client
    socket.emit('messageHistory', previousMessages);

    // Whenever a client sends a message
    socket.on('message', (message) => {

        console.log(`Message has been sent: ${message}`);
        if (striptags(message)) {
            console.log(message)
            // Save the message and send the message back to all clients
            previousMessages.push({ time: Date.now(), message: striptags(message), id: socket.id })
            server.emit('message', striptags(message), socket.id);
        }
    });

})