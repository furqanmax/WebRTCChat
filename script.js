// script.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, onValue, set, push } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
import { firebaseConfig } from './config.js'; 


const app = initializeApp(firebaseConfig);
const db = getDatabase(app);



const addMessage = (message) => {
    const messageElement = document.createElement("div");
    messageElement.innerText = message;
    document.getElementById("messages").appendChild(messageElement);
    document.getElementById("messages").scrollTop = document.getElementById("messages").scrollHeight; // Auto scroll
};

const initializePeerConnection = (iceCandidateHandler) => {
    const peerConnection = new RTCPeerConnection({
        iceServers: [
            { urls: 'stun:stun1.l.google.com:19302' },
        ]
    });

    peerConnection.onicecandidate = iceCandidateHandler;

    return peerConnection;
};

// This function should be called when a message is sent
const sendMessage = (channel, message) => {
    if (channel && channel.readyState === 'open') {
        channel.send(message);
        addMessage("You: " + message);
        document.getElementById("messageInput").value = '';
    } else {
        alert("Data channel is not open yet.");
    }
};

// Exporting functions for use in peer scripts
export { db, addMessage, initializePeerConnection, sendMessage };
