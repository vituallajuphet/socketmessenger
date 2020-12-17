const express = require('express')
const socket = require('socket.io')
const http = require('http')
const moment = require("moment");
const path = require('path');

const app = express()
const server = http.createServer(app);
const port = process.env.PORT || 4000;
const io = socket(server)

app.use(express.static('public'))

app.get('/',function(req,res) {
    res.sendFile(path.join(__dirname+'/template/index.html'));
});

app.get('/login',function(req,res) {
    res.sendFile(path.join(__dirname+'/template/login.html'));
});

server.listen(port, () => {
  console.log(`running at port ${port}`)
})


let msgs = []

io.on('connection', (socket) => {
    socket.emit("message", "welcome you are connected!")
    socket.broadcast.emit('message', "someone connected!");

    socket.emit("allMessage", msgs)
    socket.broadcast.emit("allMessage", msgs)

    socket.on('disconnect', () => {
        io.emit("message", "someone leave")
    })

    socket.on("sendMessage", msg => {
        const maxId = Math.max(...msgs.map(msg  => msg.id), 0);
        
        msg.id = maxId + 1;
        msg.date = moment().fromNow();
        msgs.push(msg)
        socket.emit("allMessage", msgs)
        socket.broadcast.emit("allMessage", msgs)

    })
})