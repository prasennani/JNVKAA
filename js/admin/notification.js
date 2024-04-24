$(document).ready(function () {
    $('#preloader').css('display', 'flex');
    //    getuserAccessLevel();
    $('#notifications').text('0');
    $('#messages').text('0');

    showNotification();
    getallNotifications();
});
/*
function getuserAccessLevel() {
    $.ajax({
        url: "../WebService.asmx/getUserAcessLevel",
        type: "POST",
        contentType: "application/json",
        // data: "{ 'uid': '" + userid + "'}",
        dataType: "json",
        success: function (response) {
            user = response.d;
            switch (parseInt(user) !== 0) {
                case 0:
                    alert("Unauthorized Access. Please Login");
                    window.location = "../login.html";
                    break;
                case 1:
                    showNotification();
                    getallNotifications();
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
*/
function showNotification() {
    $.ajax({
        url: "../WebService.asmx/getCountofUser",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            //  alert(response.d);
            user = JSON.parse(JSON.parse(response.d));
            if (user[0].count.localeCompare("521") === 0) {
                $('#notifications').text("0");
                $('#preloader').css('display', 'none');
            }
            else if (user[0].count.localeCompare("522") === 0)
                alert("Something went wrong. Please try again.");
            else {
                $('#notifications').text(user[0].pending);

                $('#preloader').css('display', 'none');




            }
        }

    }).done(function () {


    }).fail(function (XMLHttpRequest, status, error) {
        console.log("Status " + status + "Error" + error);
    });
}

function getallNotifications() {

    $.ajax({
        url: "../WebService.asmx/GetMessages",
        type: "POST",
        contentType: "application/json",
        data: "{'seenstatus':'-1'}",
        dataType: "json",
        success: function (response) {
            event = JSON.parse(JSON.parse(response.d));
            if (event[0].msgid.localeCompare("521") === 0) {
                $('#preloader').css('display', 'none');
                $('#messages').text("0");
            }
            else if (event[0].msgid.localeCompare("522") === 0)
                alert("Something went wrong. Please try again.");
            else {

                $('#messages').text(event.length);
                $('#preloader').css('display', 'none');
                //j = i;
            }

        }

    }).done(function () {


    }).fail(function (XMLHttpRequest, status, error) {
        console.log("Status " + status + "Error" + error);
    });


    //Edit user data and getting data using button 




}