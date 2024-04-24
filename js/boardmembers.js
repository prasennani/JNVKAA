$(document).ready(function () {

    getpresident();
    getboardMembers();
});



function getpresident() {
    $.ajax({
        url: "../WebService.asmx/getPresident",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            user = JSON.parse(JSON.parse(response.d));
            if (user[0].ustatus.localeCompare("521") === 0) {
                alert("President records not found");
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
                //j = i;
            }

        }

    }).done(function () {


    }).fail(function (XMLHttpRequest, status, error) {
        console.log("Status " + status + "Error" + error);
    });


    //Edit user data and getting data using button 




}

function getboardMembers() {
    $('#boardmembers-card').empty();
    $.ajax({
        url: "../WebService.asmx/boardMembers",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            user = JSON.parse(JSON.parse(response.d));

            if (user[0].ustatus.localeCompare("521") === 0) {
               // alert("BoardMembers records not added");
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
                //j = i;
            }

        }

    }).done(function () {


    }).fail(function (XMLHttpRequest, status, error) {
        console.log("Status " + status + "Error" + error);
    });


    //Edit user data and getting data using button 




}