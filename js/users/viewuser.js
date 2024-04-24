var userid = "";
var searchParams = new URLSearchParams(window.location.search);
var param = searchParams.get('user');

$(document).ready(function () {
    $('#preloader').css('display', 'flex');
    
    userid = param;
    showUserData();
    getuserDonations();
});


function showUserData() {
    $.ajax({
        url: "../WebService.asmx/getuserdata",
        type: "POST",
        contentType: "application/json",
        data: "{ 'uid': '" + userid + "'}",
        dataType: "json",
        success: function (response) {
            user = JSON.parse(JSON.parse(response.d));
            if (user[0].ustatus.localeCompare("521") === 0)
                alert("No records found");
            else if (user[0].ustatus.localeCompare("522") === 0)
                alert("Something went wrong. Please try again.");
            else {
                if (user[0].photo == "") {
                    $('#photo').attr("src", "../assets/imgs/profile pic.png");
                } else {
                    $('#photo').attr("src", user[0].photo);
                }
                $('#fullname').text(user[0].fname+" "+user[0].sname);
                $('#dob').text(user[0].dob);
                $('#email').text(user[0].uemail);
                $('#city').text(user[0].ucity);
                $('#profession').text(user[0].profession);
                $('#workingin').text(user[0].workingin);
                $('#bio').text(user[0].ubio);
                $('#instaurl').attr("href",user[0].instaurl);
                $('#fburl').attr("href",user[0].fbookurl);
                $('#linkdnurl').attr("href",user[0].linkdnurl);

                $('#preloader').css('display', 'none');





            }
        }

    }).done(function () {


    }).fail(function (XMLHttpRequest, status, error) {
        console.log("Status " + status + "Error" + error);
    });
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
