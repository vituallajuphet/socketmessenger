const {messages} =  require("../messages");
const {users} =  require("../users");
const moment = require('moment')
const session = require("../session")

const messageSocket =  (socket, io) => {
    socket.emit("message", "welcome you are connected!")
    socket.broadcast.emit('message', "someone connected!");

    socket.emit("allMessage", messages)
    socket.broadcast.emit("allMessage", messages)
    socket.on('disconnect', () => {
        io.emit("message", "someone leave")
    })

    socket.on("sendMessage", msg => {
        console.log(users)
        const maxId = Math.max(...messages.map(msg  => msg.id), 0);
        

        msg.id = maxId + 1;
        msg.date = moment().fromNow();
        messages.push(msg)
        socket.emit("allMessage", messages)
        socket.broadcast.emit("allMessage", messages)
    })
}

module.exports = messageSocket;