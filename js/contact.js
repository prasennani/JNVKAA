
$(document).ready(function () {
    $('#preloader').css('display', 'flex');
   

    $('#send').click(function () {
		if ($("#fname").val().length > 0) {
                if ($("#phno").val().length > 0) {
                    if ($("#subject").val().length > 0) {
                        if ($("#message").val().length > 0) {
							
        					sendMessage();
							
						} else
                            alert("Please write your Question or Message or Suggession");
                    } else
                        alert("Tell us Your Mobile Number or Email id to contact you");
                } else
                    alert("Enter Your Batch No");
            } else
                alert("Enter Your Name");

    });

});


function sendMessage() {
    $.ajax({
        url: '../WebService.asmx/addMessage',
        type: "POST", // type of the data we send (POST/GET)
        contentType: "application/json",
        data: "{ 'uname': '" + $('#fname').val() + "', 'uphno': '" + $('#phno').val() + "', 'sub': '" + $('#subject').val() + "', 'message': '" + $('#message').val() + "'}",
        datatype: "json",
        success: function (response) { // when successfully sent data and returned
           // alert("Res: " + response.d);
            switch (parseInt(JSON.parse(response.d))) {
                case 1:
                    alert("Message Sent");
                    $('.form-control').val("");
                    break;
                case 0:
                    alert("Unable to send Message. Try after sometime.");
                    break;

            }

        } // success close
    }).done(function () {
    }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
        alert("Status: " + textStatus + ", Error: " + errorThrown);
        //alert("Something went wrong. Please contact Admin.");
    }).always(function () {
    }); // ajax call ends

}





