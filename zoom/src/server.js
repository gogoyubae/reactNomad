import http from "http";
import {Server} from "socket.io";
import express from "express";
import {instrument} from "@socket.io/admin-ui";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);
const httpServer = http.createServer(app);
const wsServer = new Server(httpServer, {
    cors: {
      origin: ["https://admin.socket.io"],
      credentials: true
    }
  });

  instrument(wsServer, {
    auth: false
  });
  
function publicRooms() {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = wsServer;
  const publicRooms=[];
  rooms.forEach((_, key) =>{
    if (sids.get(key) === undefined){
        publicRooms.push(key)
    }
  })
  return publicRooms;
}

function countRoom(roomName){
    return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

wsServer.on("connection", (backSocket) => {
  backSocket["nickname"] = "Anon";
  backSocket.onAny((event) => {
    console.log(wsServer.sockets.adapter);
    console.log(`Socket Event: ${event}`);
});
backSocket.on("enter_room", (roomName, done) => {
    backSocket.join(roomName);
    done();
    backSocket.to(roomName).emit("welcome", backSocket.nickname, countRoom(roomName));
    wsServer.sockets.emit("room_change", publicRooms());
  });
  backSocket.on("disconnecting", () => {
    backSocket.rooms.forEach((room) =>
      backSocket.to(room).emit("bye", backSocket.nickname, countRoom(room) - 1)
    );
  });

  backSocket.on("disconnect", () => {
    wsServer.sockets.emit("room_change", publicRooms());
  })
  backSocket.on("new_message", (msg, room, done) => {
    backSocket.to(room).emit("new_message", `${backSocket.nickname}: ${msg}`);
    done();
  });
  backSocket.on("nickname", (nickname) => (backSocket["nickname"] = nickname));
});

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
