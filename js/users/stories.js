$(document).ready(function () {
    var j = 0;
    $('#preloader').css('display', 'flex');
    
    
    getProfilePic();
    getuserAccessLevel();
    getuser();


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
                    getAllStories();
                    getProfilePic();
                    getuser();
                    getuserDonations();
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
                $('#profileicon').attr('src', "../assets/imgs/profile pic.png");
                $('#profileicon2').attr('src', "../assets/imgs/profile pic.png");
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

function getAllStories() {
    $('#preloader').css('display', 'flex');
    $.ajax({
        url: "../WebService.asmx/getAllStories",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            story = JSON.parse(JSON.parse(response.d));
            if (story[0].title.localeCompare("521") === 0) {
                alert("Stories Not Added");
                $('#preloader').css('display', 'none');
            }
            else if (story[0].title.localeCompare("522") === 0)
                alert("Something went wrong. Please try again.");
            else {

                for (i = 0; i < story.length; i++) {

                    var storiesCard = '<div class="m-5 " style="box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;">';
                    storiesCard += '<div class="container p-4 ">';


                    storiesCard += '<div class="col-md-12 ">';
                    storiesCard += '<h2 class="col-md-12 d-flex justify-content-center text-center" style="color:#129298;">' + story[i].title + '</h2>';
                    storiesCard += ' </div>';
                    storiesCard += '<div class="row">';
                    storiesCard += '<div class="col-lg-4 col-md-4 wow fadeInUp  " data-wow-delay="0.1s">';
                    storiesCard += '<div class="service-item bg-white text-center p-4 col-12">';
                    if (story[i].photo < 10) {
                        storiesCard += '<img class="img-fluid " style="max-height: 200px;" src="../assets/imgs/stories.png" id="Img1" alt="Preview Image">';
                    }
                    else {
                        storiesCard += '<img class="img-fluid " style="max-height: 200px;" src="' + story[i].photo + '" id="Img1" alt="Preview Image">';
                    }
                    storiesCard += ' </div>';
                    storiesCard += '</div>';

                    storiesCard += ' <div class="col-md-8 wow fadeInUp ps-2 mt-3" data-wow-delay="0.1s">';

                    storiesCard += ' <div class=" row col-md-12">';

                    storiesCard += '  <div class="row col-md-6">';
                    storiesCard += '  <h3 class="postedby">Posted On:&nbsp; ' + story[i].postedon + '</h3>';
                    storiesCard += ' </div>';

                    storiesCard += '  <div class="row col-md-6">';
                    storiesCard += '  <h3 class="postedby">Posted By:&nbsp; ' + story[i].postedby + '</h3>';
                    storiesCard += ' </div></div>';
                    storiesCard += ' <div class="row col-md-12 mt-3 ">';
                    storiesCard += ' <p id="P1" class="description">' + story[i].description1 + '</p>';


                    storiesCard += '   <div class=" row mt-3">';
                    storiesCard += '<div class="col-md-9">';
                    storiesCard += '  </div>';
                    storiesCard += ' <div class="col-md-3">';

                    storiesCard += '  <a class="btn btn-outline-primary" href="readstory.html?storyid=' + story[i].storyid + '">Read More</a>'
                    storiesCard += '</div> </div> </div> </div> </div> </div></div>';



                    $('#Stories').append(storiesCard);
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
