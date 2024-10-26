// peer.js

import { db, addMessage, initializePeerConnection, sendMessage } from './script.js';
import { ref, onValue, set, push } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
import { generateQRCode } from './qrcode.js'; 

const urlParams = new URLSearchParams(window.location.search);
const connectionId = urlParams.get('code');

if (connectionId) {
    document.getElementById("peerRole").innerText = "Peer B - WebRTC Connection";
    document.getElementById("connectionCode").innerText = `Connection Code: ${connectionId}`;
    generateQRCode(connectionId); 
    startPeerB(connectionId);
} else {
    const newConnectionId = Math.random().toString(36).substring(2, 10);
    document.getElementById("peerRole").innerText = "Peer A - WebRTC Connection";
    document.getElementById("connectionCode").innerText = `Connection Code: ${newConnectionId}`;
    generateQRCode(newConnectionId);
    startPeerA(newConnectionId);
}

function updateConnectionStatus(status) {
    const connectionStatus = document.getElementById("connectionStatus");
    connectionStatus.innerText = status;
}

// Peer A logic
async function startPeerA(connectionId) {
    const localConnection = initializePeerConnection(iceCandidateHandler);
    const sendChannel = localConnection.createDataChannel("sendChannel");

    sendChannel.onmessage = e => addMessage("Peer A: " + e.data);
    sendChannel.onopen = () => {
        console.log("Data channel opened");
        updateConnectionStatus("Connected");
    };
    sendChannel.onclose = () => {
        console.log("Data channel closed");
        updateConnectionStatus("Disconnected");
    };

    function iceCandidateHandler(e) {
        if (e.candidate) {
            const iceCandidateRef = ref(db, `webrtc-signaling/${connectionId}/iceCandidates`);
            push(iceCandidateRef, e.candidate.toJSON());
        }
    }

    const createOffer = async () => {
        const offer = await localConnection.createOffer();
        await localConnection.setLocalDescription(offer);
        const signalingRef = ref(db, `webrtc-signaling/${connectionId}`);
        await set(signalingRef, { offer: offer });
    };

    onValue(ref(db, `webrtc-signaling/${connectionId}`), async (snapshot) => {
        const data = snapshot.val();
        if (data && data.answer && localConnection.remoteDescription === null) {
            await localConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
        }
        if (data && data.iceCandidates) {
            for (const candidate of Object.values(data.iceCandidates)) {
                await localConnection.addIceCandidate(new RTCIceCandidate(candidate));
            }
        }
    });

    document.getElementById("sendMessage").addEventListener("click", () => {
        const message = document.getElementById("messageInput").value;
        sendMessage(sendChannel, message);
    });

    document.getElementById("messageInput").addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            document.getElementById("sendMessage").click();
        }
    });

    createOffer();
}

// Peer B logic
async function startPeerB(connectionId) {
    const remoteConnection = initializePeerConnection(iceCandidateHandler);
    let receiveChannel;

    remoteConnection.ondatachannel = event => {
        receiveChannel = event.channel;
        receiveChannel.onmessage = e => addMessage("Peer B: " + e.data);
        receiveChannel.onopen = () => {
            console.log("Data channel opened");
            updateConnectionStatus("Connected");
        };
        receiveChannel.onclose = () => {
            console.log("Data channel closed");
            updateConnectionStatus("Disconnected");
        };
    };

    function iceCandidateHandler(e) {
        if (e.candidate) {
            const iceCandidateRef = ref(db, `webrtc-signaling/${connectionId}/iceCandidates`);
            push(iceCandidateRef, e.candidate.toJSON());
        }
    }

    onValue(ref(db, `webrtc-signaling/${connectionId}`), async (snapshot) => {
        const data = snapshot.val();
        if (data && data.offer && remoteConnection.remoteDescription === null) {
            await remoteConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
            const answer = await remoteConnection.createAnswer();
            await remoteConnection.setLocalDescription(answer);
            const signalingRef = ref(db, `webrtc-signaling/${connectionId}`);
            await set(signalingRef, { answer: answer });
            console.log("Answer sent to Peer B");
        }

        if (data && data.iceCandidates) {
            for (const candidate of Object.values(data.iceCandidates)) {
                await remoteConnection.addIceCandidate(new RTCIceCandidate(candidate));
            }
        }
    });

    document.getElementById("sendMessage").onclick = () => {
        const message = document.getElementById("messageInput").value;
        sendMessage(receiveChannel, message);
    };
}
