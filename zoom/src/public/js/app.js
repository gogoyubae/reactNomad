//import { Socket } from "socket.io";

const frontSocket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;
let roomName;

function addMessage(message){
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
}

function handleMessageSubmit(submit){
    event.preventDefault();
    const input = room.querySelector("#msg input");
    const value = input.value;
    frontSocket.emit("new_message", input.value, roomName, ()=>{
        addMessage(`You: ${value}`);
    });
    input.value ="";
}

function showRoom(msg){
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName}`;
    const msgForm = room.querySelector("#msg");
    const nameForm = room.querySelector("#name");
    msgForm.addEventListener("submit", handleMessageSubmit);
    nameForm.addEventListener("submit", handleNicknameSubmit);
}

function handleNicknameSubmit(){
    event.preventDefault();
    const input = room.querySelector("#name input");
    const value = input.value;
    frontSocket.emit("nickname", input.value);
}

function handleRoomSubmit(event){
    event.preventDefault();
    const input = form.querySelector("input");
    frontSocket.emit("enter_room", input.value, showRoom);
    roomName = input.value;
    input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);


frontSocket.on("welcome", (user, newCount)=>{
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName} (${newCount})`;
    addMessage(`${user} joined`);
})
frontSocket.on("bye", (left, newCount)=>{
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName} (${newCount})`;
    addMessage( `${left} left T.T`);
})
frontSocket.on("new_message", addMessage);

frontSocket.on("room_change", (rooms) => {
    const roomList = welcome.querySelector("ul");
    roomList.innerHTML="";
    if(rooms.length === 0){
        return ;
    }
    rooms.forEach( (room) => {
        const li = document.createElement("li");
        li.innerText = room;
        roomList.append(li);
    })
});
