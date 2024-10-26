// qrcode.js

// Function to generate QR code
export function generateQRCode(connectionId) {
    const url = `${window.location.href.split('?')[0]}?code=${connectionId}`;
    const qrcodeContainer = document.getElementById("qrcode");
    
    // Clear any existing QR code
    qrcodeContainer.innerHTML = ''; // Clear previous QR code

    // Create a canvas element for the QR code
    const canvas = document.createElement('canvas');
    qrcodeContainer.appendChild(canvas);
    
    QRCode.toCanvas(canvas, url, { width: 128 }, function (error) {
        if (error) console.error(error);
        console.log('QR code generated!');
    });
}
