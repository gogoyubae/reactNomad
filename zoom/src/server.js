import http from "http";
import socketIO from "socket.io"
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);
const httpServer = http.createServer(app);
const wsServer  = socketIO(httpServer);
// const sockets =[];

//represents the browser that just connected
// wss.on("connection", (backSocket)=>{
//     sockets.push(backSocket);
//     backSocket["nickname"] = "Anon";
//     console.log("Connected to Browser ✅");
//     backSocket.on("close", () => console.log("Disonnected from Browser ❌"));
//     backSocket.on("message", (msg)=>{
//         const message = JSON.parse(msg);
//         switch(message.type){
//             case "new_message":
//                 sockets.forEach((aBackSocket) =>
//                 aBackSocket.send(`${backSocket.nickname}: ${message.payload}`));
//                 break;
//                 //aBackSocket.send(message.payload.toString('utf8')));
//             case "nickname":
//                 backSocket["nickname"] = message.payload;
//         }
//     })
// });

httpServer.listen(3000, handleListen);
