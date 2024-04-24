$(document).ready(function () {
    var j = 0;
    $('.loader').css('display', 'flex');

    getAllEvents();
   
    //getuserAccessLevel();

    $('#selectEvent').on('change', function () {
        $('.loader').css('display', 'flex');
        getChooseEvents();
    });
    

    
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
                    getAllEvents();
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
function getAllEvents() {
    $('.loader').css('display', 'flex');
    $('#eventTable').find("tr:gt(0)").remove();
    $.ajax({
        url: "../WebService.asmx/getAllEvents",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            event = JSON.parse(JSON.parse(response.d));
            if (event[0].title.localeCompare("521") === 0) {
                alert("No records found");
                $('.loader').css('display', 'none');
            }
            else if (event[0].title.localeCompare("522") === 0)
                alert("Something went wrong. Please try again.");
            else {

                for (i = 0; i < event.length; i++) {
                    var txt = '<tr><th scope="row">' + (parseInt(i) + 1) + '</th>';
                    txt += '<td>' + event[i].title + '</td>';
                    txt += '<td>' + event[i].date + '</td>';
                    txt += '<td>' + event[i].time + '</td>';
                    txt += '<td>' + event[i].location + '</td>';
                    txt += '<td>' + event[i].organizedby + '</td>';

                    //alert(user[i].uid
                    txt += '<th><p><a class="link-info link-opacity-50-hover" href="editevents.html?e=' + event[i].eventid + '"> Edit </a></p></th>';
                    $('#eventTable tr:last').after(txt);
                }
                $('.loader').css('display', 'none');
                //j = i;
            }

        }

    }).done(function () {


    }).fail(function (XMLHttpRequest, status, error) {
        console.log("Status " + status + "Error" + error);
    });


    //Edit user data and getting data using button 

}


function getChooseEvents() {
    $('.loader').css('display', 'flex');
    $('#eventTable').empty();   
    $.ajax({
        url: "../WebService.asmx/getEventChoose",
        type: "POST",
        contentType: "application/json",
        data: "{ 'getEvent':'" + $('#selectEvent').val() + "'}",
        dataType: "json",
        success: function (response) {
            event = JSON.parse(JSON.parse(response.d));
            if (event[0].eventid.localeCompare("521") === 0) {
                $('.loader').css('display', 'none');
                alert("No records found");
            }
            else if (event[0].eventid.localeCompare("522") === 0)
                alert("Something went wrong. Please try again.");
            else {

                for (i = 0; i < event.length; i++) {
                    var txt = '<tr><th scope="row">' + (parseInt(i) + 1) + '</th>';
                    txt += '<td>' + event[i].title + '</td>';
                    txt += '<td>' + event[i].date + '</td>';
                    txt += '<td>' + event[i].time + '</td>';
                    txt += '<td>' + event[i].location + '</td>';
                    txt += '<td>' + event[i].organizedby + '</td>';

                    //alert(user[i].uid
                    txt += '<th><p><a class="link-info link-opacity-50-hover" href="editevents.html?e=' + event[i].eventid + '"> Edit </a></p></th>';
                    $('#eventTable').append(txt);
                }
                $('.loader').css('display', 'none');
                //j = i;
            }

        }

    }).done(function () {


    }).fail(function (XMLHttpRequest, status, error) {
        console.log("Status " + status + "Error" + error);
    });


    //Edit user data and getting data using button 

}
