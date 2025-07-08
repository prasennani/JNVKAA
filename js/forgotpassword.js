function sendOtp() {
    const email = $('#email').val();
    if (!email) {
        $('#message').text("Please enter your email.");
        return;
    }

    // Change button text while sending
    $('#sendOtpBtn').prop('disabled', true).text("Sending OTP...");

    $.ajax({
        url: "../WebService.asmx/sendForgotOtp",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ email: email }),
        success: function (res) {
            const result = JSON.parse(res.d);
            if (result === "sent") {
                $('#message').css("color", "green").text("OTP sent to your email.");
                $('#sendOtpBtn').text("OTP Sent ✔️ Enter Below");
            } else {
                $('#message').css("color", "red").text(result);
                $('#sendOtpBtn').prop('disabled', false).text("Send OTP");
            }
        },
        error: function () {
            $('#message').css("color", "red").text("Error sending OTP.");
            $('#sendOtpBtn').prop('disabled', false).text("Send OTP");
        }
    });
}

function verifyOtpAndReset() {
    const email = $('#email').val();
    const otp = $('#otp').val();
    const pwd1 = $('#newPassword').val();
    const pwd2 = $('#confirmPassword').val();

    if (!otp || !pwd1 || !pwd2) {
        $('#message').css("color", "red").text("Please fill all fields.");
        return;
    }

    if (pwd1 !== pwd2) {
        $('#message').css("color", "red").text("Passwords do not match.");
        return;
    }

    // Optional: disable reset button while processing
    $('#resetBtn').prop('disabled', true).text("Resetting...");

    $.ajax({
        url: "../WebService.asmx/verifyOtpAndResetPwd",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ email: email, otp: otp, newPassword: pwd1 }),
        success: function (res) {
            const result = JSON.parse(res.d);

            if (result === "Password reset successfully.") {
                alert("Password changed successfully!");
                window.location.href = "login.html"; // redirect to login
            } else {
                $('#message').css("color", "red").text(result);
                $('#resetBtn').prop('disabled', false).text("Reset Password");
            }
        },
        error: function () {
            $('#message').css("color", "red").text("Error verifying OTP.");
            $('#resetBtn').prop('disabled', false).text("Reset Password");
        }
    });
}
