$(document).ready(function () {


    $("#chkshowpwd").click(function () {
        if ($("#chkshowpwd").prop('checked') == true)
            $("#txtpwd").attr('type', 'text');
        else
            $("#txtpwd").attr('type', 'password');
    });

    $(document).keypress(function (e) {
        if (e.which == 13) {
            login();
        }
    });
    $("#btnlogin").click(function () {
        login();
    });//end of btn login




});
function login() {
    //alert("Clicked");
    if ($("#txtmobile").val().length > 0) {
        if ($("#txtpwd").val().length > 0) {

            $.ajax({
                url: '../WebService.asmx/authenticateAdmin',
                type: "POST", // type of the data we send (POST/GET)
                contentType: "application/json",
                data: "{ 'ph': '" + $("#txtmobile").val() + "', 'pwd': '" + $("#txtpwd").val() + "'}",
                datatype: "json",
                success: function (response) { // when successfully sent data and returned
                  //  alert("Res: " + JSON.stringify(response.d));
                    var res = JSON.parse(JSON.parse(response.d));
                    if (res[0].ustatus.localeCompare("1") === 0) {
                        //   window.location = "users/index.html";
                        switch (parseInt(res[0].adminStatus)) {
                            case 1:                               
                                window.location = "dashboard.html";
                                break;
                            default:
                                alert("Invalid Credentials");
                                break;
                        }
                    }
                    else {
                        switch (parseInt(res[0].ustatus)) {
                            case 0:
                                alert("Your account is blocked. Please contact admin");
                                break;
                            case -1:
                                alert("Your account is wating for approval");
                                break;
                            case -2:
                                alert("Your account is wating for approval by Batch admin");
                                break;
                            case 521:
                                alert("Invalid Mobile No/Password");
                                break;
                            case 522:
                                alert("Something went wrong. Please try after sometime.");
                                break;
                        }
                    }
                } // success close
            }).done(function () {
            }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
                alert("Status: " + textStatus + ", Error: " + errorThrown);
            }).always(function () {
            }); // ajax call ends

        } else
            alert("Enter Password");
    } else
        alert("Enter Mobile Number");
}