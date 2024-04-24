$(document).ready(function () {
    $('#preloader').css('display', 'flex');
    
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
                    getProfilePic();
                    getAllBatchmates();
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

function getAllBatchmates() {
    $('#batchmates-profiles').empty();
    $.ajax({
        url: "../WebService.asmx/batchmates",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            user = JSON.parse(JSON.parse(response.d));
            if (user[0].ustatus.localeCompare("521") === 0)
                alert("No records found");
            else if (user[0].ustatus.localeCompare("522") === 0)
                alert("Something went wrong. Please try again.");
            else {

                for (i = 0; i < user.length; i++) {


                    var txt='<div class="col-lg-3 col-md-4 wow fadeInUp" data-wow-delay="0.1s">';
                    txt +=' <div class="team-item border-top border-5 border-primary rounded shadow overflow-hidden">';
                    txt += ' <div class="text-center p-3" style="height:250px !important;">';
                    if (user[i].photo == "") {
                        txt += '  <img class="img-fluid  mb-4 " style="max-height: 160px;" src="../assets/imgs/profile pic.png" alt="">';

                    }
                    else {
                        txt += '  <img class="img-fluid  mb-4 " style="max-height: 160px;" src="' + user[i].photo + '" alt="">';
                    }
                    txt += '  <h5 class="fw-bold mb-1 text-primary bio2">' + user[i].fname +' '+ user[i].sname + '</h5>';
                    txt +='  </div>';
                    txt +=' <div class="d-flex justify-content-center bg-primary p-3">';
					txt += ' <a class="btn btn-square text-primary bg-white m-1" href="' + user[i].fbookurl + '" target="_blank"><i class="fab fa-facebook-f"></i></a>';

                    txt += ' <a class="btn btn-square text-primary bg-white m-1" href="' + user[i].linkdnurl + '" target="_blank"><i class="fab fa-twitter"></i></a>';
                    txt += ' <a class="btn btn-square text-primary bg-white m-1" href="' + user[i].instaurl + '" target="_blank"><i class="fab fa-instagram"></i></a>';
                    txt += '  <a class="btn btn-square text-primary bg-white m-1" href="viewuser.html?user=' + user[i].uid + '"><i class="fas fa-eye"></i></a>';
                    txt +='    </div> </div> </div>';


                    $('#batchmates-profiles').append(txt);
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