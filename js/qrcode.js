document.getElementById("generateButton").addEventListener("click", function () {
    const qrCodeContainer = document.getElementById("qrCodeContainer");
    const userInput = document.getElementById("userInput").value;

    // Clear previous QR Code if any
    qrCodeContainer.innerHTML = "";

    if (userInput.trim() === "") {
        alert("Please enter some text or URL!");
        return;
    }

    try {
        // Generate QR Code
        QRCode.toCanvas(qrCodeContainer, userInput, {
            errorCorrectionLevel: "H", // High error correction
            width: 200,               // Size in pixels
        }, function (error) {
            if (error) {
                console.error("Error generating QR Code:", error);
                alert("Failed to generate QR Code. Please try again.");
            }
        });
    } catch (error) {
        console.error("Exception during QR Code generation:", error);
        alert("An unexpected error occurred. Check the console for details.");
    }
});
