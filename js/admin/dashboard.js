$(document).ready(function () {
    $('#preloader').css('display', 'flex');
    //getuserAccessLevel();
    showUserCount();
    showStoriesCount();

    showEventsCount();

});





function showUserCount() {
    $.ajax({
        url: "../WebService.asmx/getCountofUser",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            //  alert(response.d);
            user = JSON.parse(JSON.parse(response.d));
            if (user[0].count.localeCompare("521") === 0)
                alert("No records found");
            else if (user[0].count.localeCompare("522") === 0)
                alert("Something went wrong. Please try again.");
            else {
                $('#pending').val(user[0].pending);

                if ((user[0].approved)) {
                    $('#approved').val(user[0].approved);

                }
                else {
                    $('#approved').val("0")
                }

              //  $('#approved').val(user[0].approved);
                $('#blocked').val(user[0].blocked);
                $('#total-users').val(user[0].count);
                
                $('#preloader').css('display', 'none');



            }
        }

    }).done(function () {


    }).fail(function (XMLHttpRequest, status, error) {
        console.log("Status " + status + "Error" + error);
    });
}


function showStoriesCount() {
    $.ajax({
        url: "../WebService.asmx/getCountofStories",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
           //  alert(response.d);
            user = JSON.parse(JSON.parse(response.d));
            if (user[0].count.localeCompare("521") === 0)
                alert("No records found");
            else if (user[0].count.localeCompare("522") === 0)
                alert("Something went wrong. Please try again.");
            else {
                if ((user[0].approved)) {
                    $('#show').val(user[0].approved);
                }
                else {
                    $('#show').val("0")
                }

                
                if ((user[0].blocked)) {
                    $('#hide').val(user[0].blocked);

                }
                else {
                    $('#hide').val("0")
                }

             //   $('#count').val(user[0].count);
                if ((user[0].count)) {
                    $('#count').val(user[0].count);

                }
                else {
                    $('#count').val("0")
                }

              //  $('#spam').val(user[0].spam);
                if ((user[0].spam)) {
                    $('#spam').val(user[0].spam);

                }
                else {
                    $('#spam').val("0")
                }

                $('#preloader').css('display', 'none');




            }
        }

    }).done(function () {


    }).fail(function (XMLHttpRequest, status, error) {
        console.log("Status " + status + "Error" + error);
    });
}

function showEventsCount() {
    $.ajax({
        url: "../WebService.asmx/getCountofEvents",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            //  alert(response.d);
            user = JSON.parse(JSON.parse(response.d));
            if (user[0].count.localeCompare("521") === 0) {
                alert("No records found");
                $('#preloader').css('display', 'none');
            }
            else if (user[0].count.localeCompare("522") === 0)
                alert("Something went wrong. Please try again.");
            else {

                if ((user[0].UpComingEvent)) {
                    $('#upcomingEvent').val(user[0].UpComingEvent);

                }
                else {
                    $('#upcomingEvent').val("0")
                }


                if ((user[0].Completed)) {
                    $('#completedEvent').val(user[0].Completed);

                }
                else {
                    $('#completedEvent').val("0")
                }


                if ((user[0].count)) {
                    $('#totalEvent').val(user[0].count);

                }
                else {
                    $('#totalEvent').val("0")
                }


                if ((user[0].Cancelled)) {
                    $('#cancelledEvent').val(user[0].Cancelled);

                }
                else {
                    $('#cancelledEvent').val("0")
                }


              /*  
                $('#upcomingEvent').val(user[0].UpComingEvent);
                $('#completedEvent').val(user[0].Completed);
                $('#totalEvent').val(user[0].count);
                $('#cancelledEvent').val(user[0].Cancelled);
                $('#preloader').css('display', 'none');*/





            }
        }

    }).done(function () {


    }).fail(function (XMLHttpRequest, status, error) {
        console.log("Status " + status + "Error" + error);
    });
}
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
                    showUserCount();
                    showStoriesCount();

                    showEventsCount();
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

}*/



