const {users} = require("../users")


const userSocket =  (socket, io) => {
    
    socket.emit("allUsers", users)
    socket.broadcast.emit("allUsers", users)

}

module.exports = userSocket;