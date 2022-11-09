const express = require("express");
const { constants } = require("os");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);


let users = [];
const PORT = 3001;

app.get("/", (req, res) => {
    console.log("hello")
    res.send("hello")
})

const addUser = (userName, roomId) => {
    users.push({
        userName,
        roomId
    })
}

const leaveUser = (userName) => {
    return users.filter(user => user.userName !== userName);
}

const getRoomUsers = (roomId) => {
    return users.filter(user => user.roomId === roomId);
}

io.on("connection", socket => {



    socket.on("join-room", ({ userName, roomId }) => {
        console.log("user joined room ")

        if (userName && roomId) {
            socket.join(roomId)
            addUser(userName, roomId)
            socket.to(roomId).emit("user-connected", userName)
            io.to(roomId).emit("all-users", getRoomUsers(roomId))
            socket.on("disconnected", () => {
                console.log("disconnected");
                socket.leave(roomId);
                leaveUser(userName)
                io.to(roomId).emit("all-users", getRoomUsers(roomId))
            })
        }

    })
})

server.listen(PORT, () => {
    console.log(`zoom clone api started at http://localhost:${PORT}`)
})