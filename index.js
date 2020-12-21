const express    = require('express')
const socket     = require('socket.io')
const http       = require('http')
const moment     = require("moment");
const path       = require('path');
const bodyParser = require('body-parser');
let {users}      = require("./server/users")
let {messages}   = require("./server/messages")

let app          = express()
const server     = http.createServer(app);
const port       = process.env.PORT || 4000;
const io         = socket(server)
let session      = require("./server/session")
app.io           = io;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))
app.set('view engine', 'ejs');

// socket connection
io.on('connection', (socket) => {
    require('./server/socket/userSocket')(socket, io);
    require('./server/socket/messageSocket')(socket, io);
    return io;
})

app.post("/process-auth" ,(req, res, next) => {
    const {nickname} = req.body;
    session.startSession(req, res, ()=>{
        if(nickname  !=  undefined){
            const maxUserId = Math.max(...users.map(usr  => usr.user_id), 0) + 1;
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
            res.render('pages/login', {title: "Petsenger - Login"});
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
            const allUsers = users.filter(usr => usr.user_id != usrdata.user_id);
            res.render('pages/index', {title:"Petsenger", usrdata, user:allUsers});
        }else{
            res.redirect("/login")
        }
    })
});


server.listen(port, () => {
  console.log(`running at port ${port}`)
})

