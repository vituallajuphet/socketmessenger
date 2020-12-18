const express    = require('express')
const socket     = require('socket.io')
const http       = require('http')
const moment     = require("moment");
const path       = require('path');
const bodyParser = require('body-parser');
let {users}      = require("./server/users")
let {messages}   = require("./server/messages")
var NodeSession  = require('node-session');

const app        = express()
const server     = http.createServer(app);
const port       = process.env.PORT || 4000;
const io         = socket(server)
let session      = new NodeSession({secret: 'Q3UBzdH9GEfiRCTKbi5MTPyChpzXLsTD', lifetime: 9999999});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))
app.set('view engine', 'ejs');

app.post("/process-auth" ,(req, res, next) => {
    const {nickname} = req.body;
    session.startSession(req, res, ()=>{
        if(nickname  !=  undefined){
            const maxUserId = Math.max(...users.map(usr  => usr.id), 0) + 1;
            users.push({user_id:maxUserId, nickname: nickname})
            req.session.put('userdata', {user_id:maxUserId, nickname: nickname});
            res.redirect("/")
        }
        else{ res.redirect("/login") }
    })
})

app.get('/login', (req,res) => {
    session.startSession(req, res, ()=>{
        const usrdata = req.session.get('userdata');
        if(usrdata != undefined){
            res.redirect("/");
        }else{
            res.render('pages/login', {title: "Login"});
        }
    })
});

app.get('/logout', (req,res) => {
    session.startSession(req, res, ()=>{
        req.session.forget('userdata');
        res.redirect("/login");
    })
});

app.get('/',(req, res, next) => {
    session.startSession(req, res, ()=>{
        const usrdata = req.session.get('userdata');
        if(usrdata != undefined){
            res.render('pages/index', {title:"Petsenger", usrdata});
        }else{
            res.redirect("/login")
        }
    })
});

io.on('connection', (socket) => {
    socket.emit("message", "welcome you are connected!")
    socket.broadcast.emit('message', "someone connected!");

    socket.emit("allMessage", messages)
    socket.broadcast.emit("allMessage", messages)
    socket.on('disconnect', () => {
        io.emit("message", "someone leave")
    })

    socket.on("sendMessage", msg => {
        const maxId = Math.max(...messages.map(msg  => msg.id), 0);
        
        msg.id = maxId + 1;
        msg.date = moment().fromNow();
        messages.push(msg)
        socket.emit("allMessage", messages)
        socket.broadcast.emit("allMessage", messages)

    })
})

server.listen(port, () => {
  console.log(`running at port ${port}`)
})

