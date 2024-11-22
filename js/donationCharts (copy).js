const userInput = document.getElementById('userInput');
const generateButton = document.getElementById('generateButton');
const qrCodeContainer = document.getElementById('qrCodeContainer');

generateButton.addEventListener('click', () => {
    const text = userInput.value.trim();

    if (text === '') {
        alert('Please enter some text or URL.');
        return;
    }

    QRCode.toCanvas(qrCodeContainer, text, {
        width: 256,
        height: 256,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
    }, (error) => {
        if (error) {
            console.error('Error generating QR code:', error);
            alert('Error generating QR code. Please try again.');
        }
    });
});