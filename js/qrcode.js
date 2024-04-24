<script>
    // Function to generate QR code with provided details
    function generateQRCode(details) {
        // Create a new QRCode instance with the container element
        var qrCode = new QRCode(document.getElementById("qrcode"), {
            width: 200, // Adjust the width and height as needed
            height: 200
        });

        // Generate the QR code with the provided details
        qrCode.makeCode(details);
    }

    // Example usage: Generate QR code with provided details
    var userDetails = "Pay 500 in phonepe"; // Replace this with the actual details
    generateQRCode(userDetails);
</script>