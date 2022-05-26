require("dotenv").config()
const express = require("express")
const app = express()
app.use(express.json())
const port = process.env.PORT || 7000
const connectDB = require("./database/db")
connectDB()
const userRoutes = require("./routes/userRouter")
const cors = require("cors")
app.use(cors())
const chatRoutes = require("./routes/chatRoute")
const messageRoute = require("./routes/messageRoute")
const morgon = require("morgan")
app.use(morgon("dev"))
const color = require("colors")




app.use("/api/user",userRoutes)
app.use("/api/chat",chatRoutes)
app.use("/api/message",messageRoute)



const server = app.listen(port,()=>{
    console.log("port statrted at ".bgBlue.red)
})

const io = require("socket.io")(server,{
    pingTimeout:60000,
    cors:{
        origin:"http://localhost:3000"
    }
})


io.on("connection",(socket) => {
    console.log("connected to socket")
    socket.on("setup",(userData) => {
        socket.join(userData._id)
        socket.emit("connected")
    })    

    socket.on("join-chat",(room)=>{
        socket.join(room)
        console.log("room ",room)
    })


    socket.on("new message",(newMessageReceived) => {
        var chat = newMessageReceived.chat

        if(!chat.users){
            return console.log("chat user not defined")
        }

        chat .users.forEach(user => {
            if(user._id == newMessageReceived.sender._id) {
                return 
            }

            socket.in(user._id).emit("message received", newMessageReceived)

        });

    })


    socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

})