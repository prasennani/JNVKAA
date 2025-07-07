var userid = "";
var searchParams = new URLSearchParams(window.location.search);
var param = searchParams.get('user');

$(document).ready(function () {
    $('#preloader').css('display', 'flex');
    
    userid = param;
    showBusinessData();
    getuserDonations();
});


function showBusinessData() {
    $.ajax({
        url: "../WebService.asmx/getBusinessdata",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ uid: userid }),
        dataType: "json",
        success: function (response) {
            const business = JSON.parse(JSON.parse(response.d))[0];

            if (business.ustatus === "521") {
                alert("No records found");
                return;
            } else if (business.ustatus === "522") {
                alert("Something went wrong. Please try again.");
                return;
            }

            // Load values into HTML
            //if (business.bcardphoto == "") {
             //   $('#photo').attr("src", "../assets/imgs/profile pic.png");
            //} else {
            //    $('#photo').attr("src", business.bcardphoto);
            //}
            $('#photo').attr("src", business.bcardphoto && business.bcardphoto !== "" ? business.bcardphoto : "../assets/imgs/profile pic.png");
            $('#photob').attr("src", business.bimage && business.bimage !== "" ? business.bimage : "../assets/imgs/profile pic.png");
            $('#fullname').text(business.fname + " " + business.sname);
            $('#bname').text(business.bname);
            $('#bname1').text(business.bname);
            $('#bbatchno').text(business.batchno);
            $('#offers').text(business.bdescription);
            $('#bnature').text(business.bnature);
            $('#baddress').text(business.baddress);
            $('#bpincode').text(business.bpincode);
            $('#bcity').text(business.bcity);
            $('#bphno').text(business.bphno);
            $('#bemail').text(business.bemail);
            $('#bservices').text(business.bservices);

            $('#bwebsite').attr("href", business.bwebsite);
            $('#bmapurl').attr("href", business.bmapurl);

            $('#fburl').attr("href", business.bfbookurl);
            $('#linkdnurl').attr("href", business.bourl1);
            $('#otherurl2').attr("href", business.bourl2);
            $('#instaurl').attr("href", business.binstaurl);

            $('#preloader').hide();
        },
        error: function (xhr, status, error) {
            console.error("Status " + status + " Error: " + error);
            $('#preloader').hide();
        }
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


function requestBusinessLead(targetUserId) {
    // Immediately update button to show status
    $('#showContactBtn button')
        .prop('disabled', true)
        .text("Requesting... Please wait");

    $.ajax({
        url: '../WebService.asmx/saveBusinessLead',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ targetUserId: targetUserId }),
        success: function (res) {
            const result = JSON.parse(res.d);

            if (result === "success") {
                // Show contact info after server response (dummy data for now)
                $('#showContactBtn').hide();
                $('#businessContact').show();
                $('#phoneSpan').text("Visible after approval");
                $('#emailSpan').text("Visible after approval");


                // ✅ Redirect to WhatsApp
                const msg = `Hello,\nI have Requested for business contact.\nFrom our website user.\nPlease check your email and reply me.`;
                const waURL = "https://wa.me/919059635007?text=" + encodeURIComponent(msg);
                window.open(waURL, "_blank");

                
            } else {
                $('#showContactBtn button')
                    .prop('disabled', false)
                    .text("Get Contact Info");

                alert("Error: " + result);
            }
        },
        error: function () {
            $('#showContactBtn button')
                .prop('disabled', false)
                .text("Get Contact Info");

            alert("Unable to contact server.");
        }
    });
}


$('#leadBtn').html(`<i class='fa fa-spinner fa-spin'></i> Requesting... Please wait`).prop('disabled', true);





