const messageList = document.querySelector("ul")
const messageForm = document.querySelector("#message")
const nickForm = document.querySelector("#nick")
const frontSocket = new WebSocket(`ws://${window.location.host}`);
//represents a connection to the server

function makeMessage(type, payload){
    const msg = {type, payload};
    return JSON.stringify(msg);

}

frontSocket.addEventListener("open", ()=>{
    console.log("Connected to Server ✅");
});

frontSocket.addEventListener("message", (message) => {
    const li = document.createElement("li");
    li.innerText = message.data,;
    messageList.append(li); 
});

frontSocket.addEventListener("close", () => {
    console.log("Disonnected from Server ❌");
});

function handleSubmit(event){
    event.preventDefault();
    const input = messageForm.querySelector("input");
    frontSocket.send(makeMessage("new_message", input.value));  
    const li = document.createElement("li");
    li.innerText = `You: ${input.value}`;
    messageList.append(li);
    input.value = "";
}

function handleNickSubmit(event){
    event.preventDefault();
    const input = nickForm.querySelector("input");
    frontSocket.send(makeMessage("nickname", input.value));
    input.value = "";
}

messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);