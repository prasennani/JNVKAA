var base64String = "";
$(document).ready(function () {
    $("#conditionalSubmit").click(function (event) {
        const name = $("#name").val();
        const mobileno = $("#mobileno").val();
        const email = $("#email").val();
        const batchNo = $("#batchNo").val();
        const donationAmount = $("#donationAmount").val();
        const recurring = $("#recurring").val();
        const paymentMode = $("#paymentMode").val();

        // Basic validations
        if (!name || !mobileno || !email || !batchNo || !donationAmount) {
            alert("All fields are mandatory!");
            return;
        }

        // Condition 1: One-time + UPI
        if (recurring === "1" && paymentMode === "1") {
            submitFormToDatabase();
            generateQRCode();
            $("#qrCodeModal").modal("show");
        }
        // Condition 2: One-time + Others
        else if (recurring === "1" && paymentMode === "2") {
            submitFormToDatabase();
            window.location.href = "https://pages.razorpay.com/pl_PGBArUtHEHaICK/view";
        }
        // Condition 3: Recurring payment
        else if (recurring === "2") {
            submitFormToDatabase();
            $("#thankYouMessage").text(`Thank you ${name}, Please check your email within the next 2-3 hours for the subscription link. We appreciate your support!`);
            $("#thankYouModal").modal("show");
        } else {
            alert("Please select valid options!");
        }
    });

    function submitFormToDatabase() {
        // Send data to the server
        $.ajax({
            url: '../WebService.asmx/Donate',
            type: "POST", // type of the data we send (POST/GET)
            contentType: "application/json",
            data: "{ 'name': '" + $('#name').val() + "', 'mobileNo': '" + $('#mobileno').val() + "', 'email': '" + $('#email').val() + "', 'batchNo': '" + $('#batchNo').val() + "', 'recurring': '" + $('#recurring').val() + "', 'frequency': '" + $('#frequency').val() + "', 'tenure': '" + $('#tenure').val() + "', 'PaymentMode': '" + $('#paymentMode').val() + "', 'DonateAmount': '" + $('#donationAmount').val() + "'}",
            datatype: "json",
            success: function (response) { // when successfully sent data and returned
                // alert("Res: " + response.d);
                switch (parseInt(JSON.parse(response.d))) {
                    case 1:


                        break;
                    case 0:

                        alert("Unable to Donate Now. Try after sometime.");
                        break;

                }

            } // success close
        }).done(function () {
        }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
            //alert("Status: " + textStatus + ", Error: " + errorThrown);
            //alert("Something went wrong. Please contact Admin.");
        }).always(function () {
        }); // ajax call ends

    }

    function generateQRCode() {
        const name = $("#name").val();
        const mobileno = $("#mobileno").val();
        const batchNo = $("#batchNo").val();
        const donationAmount = $("#donationAmount").val();

        const data = `upi://pay?pa=7075341606@ybl&pn=JNVKAA&am=${donationAmount}&tn=${mobileno} ${name} ${batchNo}&cu=INR`;
        const apiURL = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(data)}`;

        document.getElementById('qrCode').src = apiURL;
    }
});


function showLoadingSpinner() {
    $("#loadingSpinner").show();
}

function hideLoadingSpinner() {
    $("#loadingSpinner").hide();
}






$(document).ready(function () {
    $('#preloader').css('display', 'flex');
    getDonationData();

});


function getDonationData() {
    $.ajax({
        url: "../WebService.asmx/getDonations",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            story = JSON.parse(JSON.parse(response.d));
            if (story[0].title.localeCompare("521") === 0) {
            }
            else if (story[0].title.localeCompare("522") === 0)
                alert("Something went wrong. Please try again.");
            else {

                for (i = 0; i < story.length; i++) {


                    var txt = '  <div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">';
                    txt += '<div class="causes-item d-flex flex-column bg-white border-top border-5 border-primary rounded-top overflow-hidden h-100">';
                    txt += '    <div class="text-center p-4 pt-0">';
                    txt += '      <div class="d-inline-block bg-primary text-white rounded-bottom fs-5 pb-1 px-3 mb-4">';
                    txt += '          <small id="category1">' + story[i].category + '</small>';
                    txt += '       </div>';
                    txt += '      <h5 class="mb-3" id="title1">' + story[i].title + '</h5>';
                    txt += '      <p id="description">' + story[i].description + '</p>';
                    txt += '<a class="btn btn-outline-primary my-2" target="_blank" href="' + story[i].expendLink + '">View Expenditure</a>';
                    txt += '    <div class="causes-progress bg-light p-3 pt-2">';
                    txt += '       <div class="d-flex justify-content-between">';
                    var percentage = (story[i].donateamount / story[i].targetamount) * 100;
                    txt += '            <p class="text-dark" id="targetamount1">₹' + story[i].targetamount + ' <small class="text-body">Goal</small></p>';
                    txt += '        <p class="text-dark">' + story[i].donateamount + ' <small class="text-body">Raised</small></p>';
                    txt += '      </div>';
                    txt += '           <div class="progress">';
                    txt += '                <div class="progress-bar" role="progressbar" aria-valuenow="' + Math.floor(percentage) + '" aria-valuemin="0" aria-valuemax="100">';
                    txt += '            <span>' + Math.floor(percentage) + '%</span>';
                    txt += '                </div> </div> </div> </div>';
                    txt += '    <div class="position-relative mt-auto">';
                    txt += '      <img class="img-fluid" id="photo1" src="' + story[i].photo + '" alt="">';
                    txt += '      <div class="causes-overlay">';
                    txt += '   <a class="btn btn-outline-primary" href="donate.html"> Donate Now <div class="d-inline-flex btn-sm-square bg-primary text-white rounded-circle ms-2"> ';
                    txt += ' <i class="fa fa-arrow-right"></i>';
                    txt += ' </div> </a> </div> </div> </div> </div>';


                    $('#donate-cards-d').append(txt);
                }
                $('#preloader').css('display', 'none');
                //j = i;
            }

        }

    }).done(function () {


    }).fail(function (XMLHttpRequest, status, error) {
        console.log("Status " + status + "Error" + error);
    });

}


    //Edit user data and getting data using button 