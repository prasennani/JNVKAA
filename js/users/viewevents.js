var eventid= "";
var searchParams = new URLSearchParams(window.location.search);
var param = searchParams.get('eid');

$(document).ready(function () {
    $('#preloader').css('display', 'flex');
    eventid = param;
    
    
    
    
    getuserAccessLevel();

});

function getuserAccessLevel() {
    $.ajax({
        url: "../WebService.asmx/getUserAcessLevel",
        type: "POST",
        contentType: "application/json",
        // data: "{ 'uid': '" + userid + "'}",
        dataType: "json",
        success: function (response) {
            user = response.d;
            switch (parseInt(user)) {
                case 1:
                    alert("Unauthorized Access. Please Login");
                    window.location = "../login.html";
                    break;
                case 0:
                    getuser();
                    getuserDonations();
                    getProfilePic();
                    showUserData();
					showUserNameData();
                    break;
                default:
                    alert("User profile not identified. Please Login.");
                    window.location = "../login.html";
                    break;
            }
        }


    }).done(function () {


    }).fail(function (XMLHttpRequest, status, error) {
        console.log("Status " + status + "Error" + error);
    });

}

function showUserNameData(){
    $.ajax({
        url: "../WebService.asmx/getuserdata",
        type: "POST",
        contentType: "application/json",
        //data: "{ 'uid': '0'}",
        dataType: "json",
        success: function (response) {
            //alert("Res: " + response.d);
            user = response.d;
                $('#fname').text(user);
				$('#fname2').text(user);
                
        }

    }).done(function () {
    }).fail(function (XMLHttpRequest, status, error) {
        console.log("Status " + status + "Error" + error);
    });
}
function getuser() {
    $.ajax({
        url: "../WebService.asmx/getUsername",
        type: "POST",
        contentType: "application/json",
        // data: "{ 'uid': '" + userid + "'}",
        dataType: "json",
        success: function (response) {
            user = response.d;
            $('#puname').text(user);
            $('#puname2').text(user);
            /*var vals = user.split("-");

            if (vals.length == 2) {
                switch (parseInt(vals[1])) {
                    case 1:
                        alert("Unauthorized access. Please Login");
                        window.location = "../login.html";
                        break;
                    case 0:
                        $('#puname').text(vals[0]);
                        $('#puname2').text(vals[0]);
                        break;
                    default:
                        alert("Can't verify user. Please Login.");
                        window.location = "../login.html";
                        break;
                }
            }*/
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
                $('#profileicon2').attr('src', String(response.d).replaceAll('"', ''));
                $('#preloader').css('display', 'none');
                //$("#tarea").val(String(response.d).replaceAll('"', ''));
            } else {
                $('#profileicon2').attr('src', "../assets/imgs/profile pic.png");
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


function showUserData() {
    $('#preloader').css('display', 'flex');
    
    $.ajax({
        url: "../WebService.asmx/GetEvent",
        type: "POST",
        contentType: "application/json",
        data: "{ 'eventid': '" + eventid + "'}",
        dataType: "json",
        success: function (response) {
            event = JSON.parse(JSON.parse(response.d));

            if (event[0].title.localeCompare("521") === 0)
                alert("No records found");
            else if (event[0].title.localeCompare("522") === 0)
                alert("Something went wrong. Please try again.");
            else {
                if (event[0].photo <10) {
                    $('#photo').attr("src", "../assets/imgs/stories.png");
                } else {
                    $('#photo').attr("src", event[0].photo);
                }
                
                $('#title').text(event[0].title);
				$('#title2').text(event[0].title);
                $('#location').text(event[0].location);
                $('#locationLink').attr('href', event[0].locationurl);
                $('#date').text(event[0].date);
                $('#time').text(event[0].time);
                $('#description1').text(event[0].description);
                $('#description2').text(event[0].descdetails);


            }
            $('#preloader').css('display', 'none');
        }

    }).done(function () {


    }).fail(function (XMLHttpRequest, status, error) {
        console.log("Status " + status + "Error" + error);
    });
}

function getuserDonations() {

    $.ajax({
        url: "../WebService.asmx/userDonated",
        type: "POST",
        contentType: "application/json",
        // data: "{ 'uid': '" + userid + "'}",
        dataType: "json",
        success: function (response) {

            DataVal = JSON.parse(JSON.parse(response.d));

            if (DataVal[0].DonatedValue.localeCompare("521") === 0) {
                $('#preloader').css('display', 'none');
                alert("Event Not Added");
            }
            else if (DataVal[0].DonatedValue.localeCompare("522") === 0)
                alert("Something went wrong. Please try again.");
            else {

                for (i = 0; i < DataVal.length; i++) {

                    $('#amount').text(DataVal[0].DonatedValue);
                    $('#amount2').text(DataVal[0].DonatedValue);
                    $('#donate1').text(DataVal[0].ProcessValue);
                    $('#donate2').text(DataVal[0].ProcessValue);

                }
            }
        }
    }).done(function () {


    }).fail(function (XMLHttpRequest, status, error) {
        console.log("Status " + status + "Error" + error);
    });

}
