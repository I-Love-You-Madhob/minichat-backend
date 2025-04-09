import express from "express"
import { Server } from "socket.io"
import cors from 'cors'
import {createServer} from "http"
import env from "dotenv"

env.config();
const PORT =process.env.PORT||3005;
const app = express();
app.use(cors())
let count = 0;
const server = createServer(app)

const io = new Server(server, {
    cors:{
        origin:"*",
        methods:["GET","POST"],
        credentials:true
    }
});

io.on('connection',(socket)=>{
    console.log(++count+" : "+socket.id)
    socket.on("send-message",(data)=>{
        console.log(data)
        socket.to(data.room).emit("receive-message",data.message)
    })
    socket.on("join-room",(roomID)=>{
        console.log(socket.id+" joined The Room "+roomID)
        socket.join(roomID)
    })
})

app.get('/',(req,res)=>{
    return res.send("Working")
})

server.listen(PORT,()=>{
    console.log(`Running on port [${PORT}]`);
    // console.log(process.env.PORT)
})
