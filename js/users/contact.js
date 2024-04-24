

$(document).ready(function () {


    showUserProfile();

    $("#send").click(function (event) {
        var name = $("#name").val();
        var email = $("#email").val();
        var sub = $("#subject").val();
        var message = $("#message").val();
        


        if (name === "") {
            alert("Name is mandatory!");
            $("#name").focus();
            return false;
        }

        if (email === "") {
            alert("Email is mandatory!");
            $("#email").focus();
            return false;
        }

        if (sub === "") {
            alert("Subject is mandatory!");
            $("#sub").focus();
            return false;
        }

        if (message === "") {
            alert("Please write your Question or Message or Suggession");
            $("#message").focus();
            return false;
        }

        
        sendContactMessage();

        return true;


    });
});


function sendContactMessage() {
    $.ajax({
        url: '../WebService.asmx/addMessage',
        type: "POST", // type of the data we send (POST/GET)
        contentType: "application/json",
        data: "{ 'uname': '" + $('#name').val() + "', 'uphno': '" + $('#email').val() + "', 'sub': '" + $('#subject').val() + "', 'message': '" + $('#message').val() + "'}",
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


function showUserProfile() {

    $.ajax({
        url: "../WebService.asmx/getuserdata",
        type: "POST",
        contentType: "application/json",
        data: "{ 'uid': '0'}",
        dataType: "json",
        success: function (response) {

            user = JSON.parse(JSON.parse(response.d));
            if (user[0].ustatus.localeCompare("521") === 0)
                alert("No records found");
            else if (user[0].ustatus.localeCompare("520") === 0)
                window.location = "../login.html";
            else {

                $("#name").val(user[0].fname + " " + user[0].sname);
                $("#batchNo").val(user[0].batch);
                $('#mobileno').val(user[0].uphno);
                $('#email').val(user[0].uemail);
                $('#city').val(user[0].ucity);
                $('#batchNo').val(user[0].batchNo);



            }

        }

    }).done(function () {
    }).fail(function (XMLHttpRequest, status, error) {
        console.log("Status " + status + "Error" + error);
    });
}

