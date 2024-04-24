$(document).ready(function () {
    $('#preloader').css('display', 'flex');
    getuserAccessLevel1();
});

function getuser() {
    $.ajax({
        url: "../WebService.asmx/getUsername",
        type: "POST",
        contentType: "application/json",
        // data: "{ 'uid': '" + userid + "'}",
        dataType: "json",
        success: function (response) {
            user = response.d;
            //alert(user);
            var vals = user.split("-");
            //alert("Name: "+vals[0]+", Desig: "+vals[1]);
            if (user.length > 2) {
                if (vals.length == 2) {
                    switch (parseInt(vals[1])) {
                        case 0:
                            alert("Unauthorized access. Please Login");
                            window.location = "../login.html";
                            break;
                        case 1:
                            $('#puname').text(vals[0]);
                            $('#puname2').text(vals[0]);
                            break;
                        default:
                            alert("Can't verify user. Please Login.");
                            window.location = "../login.html";
                            break;
                    }

                }
            } else {
                alert("Can't verify user. Please Login.");
                window.location = "../login.html";
            }
        }


    }).done(function () {


    }).fail(function (XMLHttpRequest, status, error) {
        console.log("Status " + status + "Error" + error);
    });

}

function getProfilePic() {
    $.ajax({
        url: '../WebService.asmx/getProfilePic',
        type: "POST", // type of the data we send (POST/GET)
        contentType: "application/json",
        data: "{ 'uid': '0'}",
        datatype: "json",
        success: function (response) { // when successfully sent data and returned
            //alert("Res: " + JSON.stringify(response.d));
            if (response.d.length > 10) {
                //$('#imgprofile').attr('src', String(response.d).replaceAll('"', ''));
                $('#profileicon').attr('src', String(response.d).replaceAll('"', ''));
                $('#preloader').css('display', 'none');
                
                //$("#tarea").val(String(response.d).replaceAll('"', ''));
            } else {
                
                $('#profileicon').attr('src', "../assets/imgs/profile pic.png");
                $('#preloader').css('display', 'none');
            }
        } // success close
    }).done(function () {
    }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
        alert("Status: " + textStatus + ", Error: " + errorThrown);
        //alert("Something went wrong. Please contact Admin.");
    }).always(function () {
    }); // ajax call ends
}

function getuserAccessLevel1() {
    $('#preloader').css('display', 'flex');
    $.ajax({
        url: "../WebService.asmx/getUserAcessLevel",
        type: "POST",
        contentType: "application/json",
        // data: "{ 'uid': '" + userid + "'}",
        dataType: "json",
        success: function (response) {
          //  alert("Res: "+response.d);
            user = response.d;
            switch (parseInt(user)) {
                case 0:
                    window.location = "login.html";
                    alert("Unauthorized Access. Please Login");
                    break;
                case 1:
                    $('#preloader').css('display', 'none');
                    getuser();
                    getProfilePic();
                    break;
                default:
                    alert("User profile not identified. Please Login.");
                    window.location = "login.html";
                                        break;
            }
        }


    }).done(function () {


    }).fail(function (XMLHttpRequest, status, error) {
        console.log("Status " + status + "Error" + error);
    });

}