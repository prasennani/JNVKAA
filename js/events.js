$(document).ready(function () {
    var j = 0;
    $('#preloader').css('display', 'flex');
    getAllEvents();
    //getuser();
    //getProfilePic();



});

function getuser() {
    $.ajax({
        url: "../WebService.asmx/getUsername",
        type: "POST",
        contentType: "application/json",
        // data: "{ 'uid': '" + userid + "'}",
        dataType: "json",
        success: function (response) {

            // user = JSON.parse(JSON.parse(response.d));
            user = response.d;
            if (user == "-1") {
                window.location.href = "../login.html";

            }
            else {
                $('#puname').text(user);
                $('#puname2').text(user);
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
            if (response.d.length > 20) {
                //$('#imgprofile').attr('src', String(response.d).replaceAll('"', ''));
                $('#profileicon').attr('src', String(response.d).replaceAll('"', ''));
                $('#profileicon2').attr('src', String(response.d).replaceAll('"', ''));

                //$("#tarea").val(String(response.d).replaceAll('"', ''));
            } else
                $('#profileicon').attr('src', "../assets/imgs/profile pic.png");
            $('#profileicon2').attr('src', "../assets/imgs/profile pic.png");
        } // success close
    }).done(function () {
    }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
        alert("Status: " + textStatus + ", Error: " + errorThrown);
        //alert("Something went wrong. Please contact Admin.");
    }).always(function () {
    }); // ajax call ends
}
function getAllEvents() {
    $.ajax({
        url: "../WebService.asmx/getAllEvents",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            event = JSON.parse(JSON.parse(response.d));
            if (event[0].title.localeCompare("521") === 0) {
                alert("Events Not Added");
                $('#preloader').css('display', 'none');
            }
            else if (event[0].title.localeCompare("522") === 0)
                alert("Something went wrong. Please try again.");
            else {

                for (i = 0; i < event.length; i++) {

                    var txt = '  <div class="col-lg-5 col-md-8 wow fadeInUp mt-5 m-3" data-wow-delay="0.2s"><div class=" row g-4  text-center  p-2" style="background-color: #1291981a;"><div class="col-md-4 col-lg-4">';
                    if (event[i].photo.length > 10) {
                        txt += '   <img class="img-fluid m-2" src="' + event[i].photo + '" alt="" > </div>  <div class="col-lg-8 col-md-6" ><div class="card-body text-start">';

                    }
                    else {
                        txt += '   <img class="img-fluid m-2" src="assets/imgs/events.png" alt="" > </div>  <div class="col-lg-8 col-md-6" ><div class="card-body text-start">';

                    }
                    txt += '   <b class="card-title mt-2">' + event[i].title + '</b><br>';
                    txt += '   <div><small ><a href="' + event[i].LocationLink + '" target="_blank"> <p class="fa fa-map-marker-alt ">&nbsp;' + event[i].location + '</p></a></small><br>';
					txt += '<div class="d-flex align-items-start" >';
                    txt += '<small> <p class="fa fa-calendar" aria-hidden="true">&nbsp;' + event[i].date + '&nbsp&nbsp&nbsp&nbsp</p></small><br> ';
					txt += '<small> <p class="fa fa-clock ">&nbsp;' + event[i].time + ' </p></small><br>';
					txt += '</div>';
                    txt += ' <span>' + event[i].organizedby + '</span>';


                    txt += '<div class="d-flex justify-content-around align-items-center"><a class="btn btn-primary mt-3" href="viewevent.html?eid=' + event[i].eventid + '" role="button" style="color: var(--primary);">more details</a> ';
                    if (event[i].EventStatus == '2') {

                        txt += '<span class="text-danger pt-3"> &nbsp;Cancelled</span>';
                    }
                    txt += '</div>  </div></div></div></div></div>';



                    $('#event-data').append(txt);
                }
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
