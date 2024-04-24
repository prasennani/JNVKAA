var eventid = "";
var searchParams = new URLSearchParams(window.location.search);
var param = searchParams.get('eid');

$(document).ready(function () {
    eventid = param;
    $('#preloader').css('display', 'flex');
    
    showUserEvents();
});


function showUserEvents() {

    $.ajax({
        url: "../WebService.asmx/GetEvent",
        type: "POST",
        contentType: "application/json",
        data: "{ 'eventid': '" + eventid + "'}",
        dataType: "json",
        success: function (response) {
            event = JSON.parse(JSON.parse(response.d));

            if (event[0].title.localeCompare("521") === 0) {
                $('#preloader').css('display', 'none');
                alert("No records found");
            }
            else if (event[0].title.localeCompare("522") === 0)
                alert("Something went wrong. Please try again.");
            else {
                if (event[0].photo < 10) {
                    $('#photo').attr("src", "../assets/imgs/stories.png");
                } else {
                    $('#photo').attr("src", event[0].photo);
                }

                $('#title').text(event[0].title);
				$('#title2').text(event[0].title);
                $('#location').text(event[0].location);
                $('#date').text(event[0].date);
                $('#locationLink').attr('href', event[0].locationurl);
                $('#time').text(event[0].time);
                $('#description1').text(event[0].description);
                $('#description2').text(event[0].descdetails);
                $('#preloader').css('display', 'none');

            }

        }

    }).done(function () {


    }).fail(function (XMLHttpRequest, status, error) {
        console.log("Status " + status + "Error" + error);
    });
}