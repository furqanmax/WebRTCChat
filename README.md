# WebRTC Peer-to-Peer Chat Application
A simple WebRTC-based chat application that allows two users to connect and exchange messages in real-time using Firebase for signaling. The application generates a unique connection code for Peer A, which can be shared with Peer B for establishing a WebRTC data channel. The connection status and a QR code for easy sharing are also displayed.

## Features
- **Peer-to-Peer Messaging**: Direct messaging using WebRTC's DataChannel for real-time text-based communication.
- **Unique Connection Code**: Peer A generates a unique code, which Peer B uses to connect, enabling secure and easy one-to-one communication.
- **Connection Status Display**: Real-time feedback on connection status (connected/disconnected).
- **QR Code Sharing**: Peer A can generate a QR code containing the connection URL and code for easy sharing with Peer B.

## Prerequisites
 1. **Firebase**: Set up a Firebase project for signaling and obtain your Firebase configuration details.
 2. **Web Server**: Serve the files through a web server (e.g., VS Code Live Server, Node.js server) to allow WebRTC connections.
## Installation
1. **Clone this repository**:
2. Configure Firebase:
- Go to your Firebase console.
- In the Firebase settings, copy your Firebase configuration.
- Paste it into the script.js file in the Firebase configuration section.
3. Install Dependencies:

- Import the Firebase and QR code libraries through the CDN links in your HTML file (these are already included).
## Usage
1. **Start Peer A**:

- Open index.html in a web browser.
- Peer A will see a generated Connection Code and QR code. Share the code or QR with Peer B.
2. **Start Peer B**:

- Open index.html in a different browser or device.
- Enter the Connection Code provided by Peer A to connect.
3. Chat:

- Once connected, start sending messages between peers.
- Connection status is displayed at the top of the page.
## Project Structure
```
├── index.html             # Main HTML file containing UI elements
├── script.js              # Shared functions, including Firebase setup and signaling logic
├── peer.js                # Core WebRTC logic for Peer A and Peer B roles
├── qrcode.js              # QR code generation logic
└── README.md              # Project description and instructions
```
## Technologies Used
- **WebRTC**: For establishing peer-to-peer data channels.
- **Firebase Realtime Database**: For signaling (exchange of offers, answers, and ICE candidates).
- **JavaScript**: Frontend logic for handling WebRTC and Firebase.
- **QR Code Library**: For generating sharable QR codes with the connection link.
## License
This project is open-source and available under the MIT License.

## Troubleshooting
If you encounter any issues:

1. **Firebase Errors**: Ensure your Firebase configuration in script.js is correct and that you have read/write permissions in your Firebase Realtime Database.
2. **WebRTC Connection Issues**: Check for network restrictions (e.g., firewall or NAT issues) that may prevent WebRTC connections.
3. **Console Errors**: Open your browser's developer console to review errors and debug messages.
Feel free to contribute or raise issues on GitHub for any suggestions or bugs!
