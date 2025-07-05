
var batchno = "";
$(document).ready(function () {
    $('#preloader').css('display', 'flex');
    
    getuserAccessLevel();
    loadServicesList();

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

            // user = JSON.parse(JSON.parse(response.d));
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
                    getAllBatchNo();
                    getuserDonations();
                    getuser();
                    getProfilePic();
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
                $('#preloader').css('display', 'none');
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

// Updated JavaScript file: businesses.js

function getAllBusinesses() {
    $('#alumnibusinesses').empty();
    var serviceQuery = $('#ServicesOrProducts').val().trim();
    if (serviceQuery === '') {
        alert("Please enter a service or product to search.");
        return;
    }

    $('#preloader').show();

    $.ajax({
        url: '../WebService.asmx/getBusinesses',
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ ServicesOrProducts: serviceQuery }),
        dataType: "json",
        success: function (response) {
            const business = JSON.parse(JSON.parse(response.d));

            if (business[0].ustatus === "521") {
                alert("No records found");
            } else if (business[0].ustatus === "522") {
                alert("Something went wrong. Please try again.");
            } else {
                business.forEach(function (b) {
                    if (b.ustatus === "1") {
                        var txt = '<div class="col-lg-3 col-md-4 wow fadeInUp" data-wow-delay="0.1s">';
                        txt += ' <div class="team-item border-top border-5 border-primary rounded shadow overflow-hidden">';
                        txt += ' <div class="text-center p-4" >';
                        txt += ' <h2 class="fw-bold mb-1 text-primary bio2">' + b.bname + '</h2>';
                        
                        txt += ' <h5 class="fw-bold mb-1 text-primary bio2">' + 'Location: ' + b.bcity + '</h5>';
                        txt += ' <p class="mt-2">' + b.highlight + '</p>';
                        if (!b.bimage || b.bimage === '') {
                            txt += '  <img class="img-fluid mb-4" style="max-height: 160px;" src="../assets/imgs/profile pic.png" alt="">';
                        } else {
                            txt += '  <img class="img-fluid mb-4" style="max-height: 160px;" src="' + b.bimage + '" alt="">';
                        }
                        
                        txt += '  <h5 class="fw-bold mb-1 text-primary bio2">' + b.sname + ' ' + b.fname + '</h5>';
                        txt += '  <h5 class="fw-bold mb-1 text-primary bio2">' + 'Batch No.: ' + b.batchno + '</h5>';
                        
                        txt += '  </div>';
                        txt += ' <div class="d-flex justify-content-center bg-primary p-3">';
                        txt += ' <a class="btn btn-square text-primary bg-white m-1" href="' + b.bfbookurl + '" target="_blank"><i class="fab fa-facebook-f"></i></a>';
                        txt += ' <a class="btn btn-square text-primary bg-white m-1" href="' + b.bwebsite + '" target="_blank"><i class="fas fa-globe"></i></a>';
                        txt += ' <a class="btn btn-square text-primary bg-white m-1" href="' + b.binstaurl + '" target="_blank"><i class="fab fa-instagram"></i></a>';
                        txt += ' <a class="btn btn-square text-primary bg-white m-1" href="viewbusinedd.html?user=' + b.bid + '"><i class="fas fa-eye"></i></a>';
                        txt += '    </div> </div> </div>';
                        $('#alumnibusinesses').append(txt);
                    }
                });
            }

            $('#preloader').hide();
        },
        error: function (xhr, status, error) {
            console.error("Status " + status + ", Error: " + error);
            $('#preloader').hide();
        }
    });
}


function loadServicesList() {
    $.ajax({
        url: "../WebService.asmx/getAllServices",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            var services = JSON.parse(JSON.parse(response.d));
            var dataList = $('#servicesList');
            dataList.empty();
            services.forEach(function (item) {
                dataList.append('<option value="' + item + '">');
            });
        },
        error: function () {
            console.log("Failed to fetch service list.");
        }
    });
}




function getAllBatchNo() {
    $.ajax({
        url: '../WebService.asmx/batchnumber',
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            user = JSON.parse(JSON.parse(response.d));
            if (user[0].batchno.localeCompare("521") === 0)
                alert("No batches found");
            else if (user[0].batchno.localeCompare("522") === 0)
                alert("Something went wrong. Please try again.");
            else {

                for (i = 0; i < user.length; i++) {


                    var txt = '<option value="' + user[i].batchno + '">' + user[i].batchno + '</option>';
                    


                    $('#batchno').append(txt);
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
