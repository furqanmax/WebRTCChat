const addMessage = (message) => {
    const messageElement = document.createElement("div");
    messageElement.innerText = message;
    document.getElementById("messages").appendChild(messageElement);
    document.getElementById("messages").scrollTop = document.getElementById("messages").scrollHeight;
};
