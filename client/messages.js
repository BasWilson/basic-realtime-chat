// Conncts to the socket.io server
var socket = io('http://localhost:7575');
var messageIdCounter = 0;

$(document).ready(function () {

    $('#chat-box').css("maxHeight", $(document).innerHeight() - 60);

    $(window).resize(function () {
        $('#chat-box').css("maxHeight", $(document).innerHeight() - 60);
        scrollDown();
    });

    $(document).keypress(function (e) {
        if (e.which == 13) {
            sendMessage();
        }
    });

    // When disconnected, reconnect
    setInterval(() => {
        if (socket.disconnected) {
            socket.connect();
        }
    }, 1000);

    // Appends the current time on the top of the chat box
    var d = new Date();
    var min = d.getMinutes(); var hour = d.getHours();
    if (min < 10) {
        min = "0" + d.getMinutes();
    }
    if (hour < 10) {
        hour = "0" + d.getHours();
    }
    $('#chat-box').append(`<div><p>Today ${hour}:${min}</p></div>`);

});

// When a message is received from the server
socket.on("message", function (message, id) {
    messageIdCounter++;

    // Check if its our message or someone elses to append the message left or right
    if (id == socket.id) {
        $('#chat-box').append(`<p id="${messageIdCounter}" class="chat-message to">${message}</p>`);
    } else {
        $('#chat-box').append(`<p id="${messageIdCounter}" class="chat-message from">${message}</p>`);
    }
    // Show the display: noned message with a jquery animation
    $('#' + messageIdCounter).show('show');
    scrollDown();
});

// Send a message to the server
function sendMessage() {
    const message = $('#message-field').val();

    //If message is not empty emit it 
    if (message) {
        socket.emit("message", message);
        $('#message-field').val("");
    }
}

// Makes sure the user gets to see the latest messages without having to scroll
function scrollDown() {
    $('#chat-box').animate({
        scrollTop: $('#chat-box').get(0).scrollHeight
    }, 200);
}

// Gets all previous sent messages
socket.on('messageHistory', (messages) => {
    messageIdCounter = messages.length + 1;
    for (let i = 0; i < messages.length; i++) {
        $('#chat-box').append(`<p id="${i + 1}" class="chat-message from">${messages[i].message}</p>`);
    }
    $('.chat-message').show('show');
    scrollDown();
});