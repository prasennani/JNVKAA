$(document).ready(function () {
    $('#preloader').css('display', 'flex');
    
    getuser();
    getProfilePic();
    
    getuserAccessLevel();
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
                    getPresident();
                    getBoardMembers();
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
            } else {
                $('#profileicon').attr('src', "../assets/imgs/profile pic.png");
                $('#profileicon').attr('src', "../assets/imgs/profile pic.png");
            }

        } // success close
    }).done(function () {
    }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
        alert("Status: " + textStatus + ", Error: " + errorThrown);
        //alert("Something went wrong. Please contact Admin.");
    }).always(function () {
    }); // ajax call ends
}

function getPresident() {
    $('#president-cards').empty();
    $.ajax({
        url: "../WebService.asmx/getPresident",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            user = JSON.parse(JSON.parse(response.d));
            if (user[0].ustatus.localeCompare("521") === 0) {
                alert("President Records Not Found");
            }
            else if (user[0].ustatus.localeCompare("522") === 0)
                alert("Something went wrong. Please try again.");
            else {

                for (i = 0; i < user.length; i++) {


                    var txt = '   <div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">';
                    txt += '  <div class="team-item border-top border-5 border-primary rounded shadow overflow-hidden">';
                    txt += '  <div class="text-center p-4">';
                    if (user[i].photo == "") {
                        txt += '  <img class="img-fluid  mb-4 " style="max-height: 160px;" src="../assets/imgs/profile pic.png" alt="">';

                    }
                    else {
                        txt += '  <img class="img-fluid  mb-4 " style="max-height: 200px;" src="' + user[i].photo + '" alt="">';
                    }
                    txt += '  <h5 class="fw-bold mb-1 text-primary">' + user[i].fname + ' ' + user[i].sname + '</h5>';
                    txt += '  <small>PRESIDENT</small>';
                    txt += '  </div>';
                    txt += '  <p class="mb-4 ms-3 me-4 text-primary text-center bio1 " >"' + user[i].bio + '"</p>';
                    txt += '  <div class="d-flex justify-content-center bg-primary p-3">';
                    txt += '  <a class="btn btn-square text-primary bg-white m-1" href="' + user[i].fbookurl + '"><i class="fab fa-facebook-f"></i></a>';
                    txt += '  <a class="btn btn-square text-primary bg-white m-1" href="' + user[i].linkdnurl + '"><i class="fab fa-twitter"></i></a>';
                    txt += '  <a class="btn btn-square text-primary bg-white m-1" href="' + user[i].instaurl + '"><i class="fab fa-instagram"></i></a>';
                    txt += '  <a class="btn btn-square text-primary bg-white m-1" href="viewuser.html?user=' + user[i].uid + '"><i class="fas fa-eye"></i></a>';


                    txt += '  </div> </div> </div>';

                    $('#president-cards').append(txt);
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

function getBoardMembers() {
    $('#boardmembers-card').empty();
    $.ajax({
        url: "../WebService.asmx/boardMembers",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            user = JSON.parse(JSON.parse(response.d));
            
            if (user[0].ustatus.localeCompare("521") === 0) {
                //alert("Boardmembers records Not found");
            }
            else if (user[0].ustatus.localeCompare("522") === 0)
                alert("Something went wrong. Please try again.");
            else {

                for (i = 0; i < user.length; i++) {


                    var txt = '   <div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">';
                    txt += '  <div class="team-item border-top border-5 border-primary rounded shadow overflow-hidden">';
                    txt += '  <div class="text-center p-4">';
                    if (user[i].photo == "") {
                        txt += '  <img class="img-fluid  mb-4 " style="max-height: 160px;" src="../assets/imgs/profile pic.png" alt="">';

                    }
                    else {
                        txt += '  <img class="img-fluid  mb-4 " style="max-height: 200px;" src="' + user[i].photo + '" alt="">';
                    }
                    txt += '  <h5 class="fw-bold mb-1 text-primary">' + user[i].fname + ' ' + user[i].sname + '</h5>';
                    switch (parseInt(user[i].workingas)) {
                        case 3:
                            txt += '  <small>Vice-president</small>';
                            break;
                        case 4:
                            txt += '  <small>Treasurer</small>';
                            break;
                        case 5:
                            txt += '  <small>Secretary</small>';
                            break;
                        case 6:
                            txt += '  <small>Joint-Secretary</small>';
                            break;
                        case 7:
                            txt += '  <small>Executive</small>';
                            break;
                        case 8:
                            txt += '  <small>Volunteer</small>';
                            break;

                    }
                    txt += '  </div>';
                    txt += '  <p class="mb-4 ms-3 me-4 text-primary text-center bio1 " >"' + user[i].bio + '"</p>';
                    txt += '  <div class="d-flex justify-content-center bg-primary p-3">';
                    txt += '  <a class="btn btn-square text-primary bg-white m-1" href="' + user[i].fbookurl + '"><i class="fab fa-facebook-f"></i></a>';
                    txt += '  <a class="btn btn-square text-primary bg-white m-1" href="' + user[i].linkdnurl + '"><i class="fab fa-twitter"></i></a>';
                    txt += '  <a class="btn btn-square text-primary bg-white m-1" href="' + user[i].instaurl + '"><i class="fab fa-instagram"></i></a>';
                    txt += '  <a class="btn btn-square text-primary bg-white m-1" href="viewuser.html?user=' + user[i].uid + '"><i class="fas fa-eye"></i></a>';


                    txt += '  </div> </div> </div>';

                    $('#boardmembers-card').append(txt);
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
