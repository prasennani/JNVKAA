var base64String = "";
$(document).ready(function () {
    getDonationPurpose();
    initProfilePic();

    $("#donate").click(function (event) {
        var donateId = $("#donateId").val();
        var name = $("#name").val();
        var batchNo = $("#batchNo").val();
        var paymentMode = $("#paymentMode").val();
        var donationAmount = $("#donationAmount").val();
        var email = $("#email").val();

        if (donateId === "") {
            alert("Donate ID is mandatory!");
            $("#donateId").focus();
            return false;
        }

        if (name === "") {
            alert("Name is mandatory!");
            $("#name").focus();
            return false;
        }

        if (batchNo === "") {
            alert("Batch No is mandatory!");
            $("#batchNo").focus();
            return false;
        }
        console.log(paymentMode);

        if (paymentMode === "0") {
            alert("Payment Mode is mandatory!");
            $("#paymentMode").focus();
            return false;
        }
        if ($("#donatePurpose").val() === "0") {
            alert("Donation Purpose is mandatory!");
            $("#paymentMode").focus();
            return false;
        }

        if (donationAmount === "") {
            alert("Donation Amount is mandatory!");
            $("#donationAmount").focus();
            return false;
        }

        if (email === "") {
            alert("Email is mandatory!");
            $("#email").focus();
            return false;
        }
		showLoadingSpinner();
        Donate();

        return true;


    });
    function Donate() {

        $.ajax({
            url: '../WebService.asmx/Donate',
            type: "POST", // type of the data we send (POST/GET)
            contentType: "application/json",
            data: "{ 'name': '" + $('#name').val() + "', 'mobileNo': '" + $('#mobileno').val() + "', 'email': '" + $('#email').val() + "', 'batchNo': '" + $('#batchNo').val() + "', 'PaymentMode': '" + $('#paymentMode').val() + "', 'DonateAmount': '" + $('#donationAmount').val() + "', 'RefNo': '" + $('#refNo').val() + "', 'DonatePurpose': '" + $('#donatePurpose').val() + "', 'PaymentSS': '" + base64String + "'}",
            datatype: "json",
            success: function (response) { // when successfully sent data and returned
                // alert("Res: " + response.d);
                switch (parseInt(JSON.parse(response.d))) {
                    case 1:
                        alert("Thank You For Donation");
                        location.reload();
                        break;
                    case 0:

                        alert("Unable to Donate Now. Try after sometime.");
                        break;

                }

            } // success close
        }).done(function () {
        }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
            alert("Status: " + textStatus + ", Error: " + errorThrown);
            //alert("Something went wrong. Please contact Admin.");
        }).always(function () {
        }); // ajax call ends

    }


});


function getDonationPurpose() {
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


                    var txt = '<option value=' + story[i].donationid + '>' + story[i].title + '</option>';


                    $('#donatePurpose').append(txt);
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



function initProfilePic() {

    $('#fileprofile').on('change', function () {
        compressImage();

    });




}

function compressImage() {

    var inputImage = document.getElementById('fileprofile');
    var file = inputImage.files[0];

    if (file) {
        var reader = new FileReader();

        reader.onload = function (e) {
            var img = new Image();
            img.src = e.target.result;

            img.onload = function () {
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');

                // Calculate the new width and height to maintain the aspect ratio
                var maxDimension = 800;
                var newWidth, newHeight;

                if (img.width > img.height) {
                    newWidth = maxDimension;
                    newHeight = (img.height / img.width) * maxDimension;
                } else {
                    newHeight = maxDimension;
                    newWidth = (img.width / img.height) * maxDimension;
                }

                canvas.width = newWidth;
                canvas.height = newHeight;

                // Draw the image on the canvas
                ctx.drawImage(img, 0, 0, newWidth, newHeight);

                // Convert the canvas content to a base64 encoded JPEG image
                var compressedImageData = canvas.toDataURL('image/jpeg', 0.8);

                // Create a blob from the base64 data
                var blob = dataURItoBlob(compressedImageData);

                // Check if the compressed image size is below 900kb
                if (blob.size < 900 * 1024) {
                    // Do something with the compressed image, for example, upload or display it
                    var reader = new FileReader();
                    reader.onloadend = function () {
                        //$("#base64Img").attr("href",reader.result); 
                        base64String = reader.result;



                    }
                    reader.readAsDataURL(blob);
                } else {
                    alert('Please,provide image size below 5mb');
                }
            };
        };

        reader.readAsDataURL(file);
    }
}

function dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);

    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: 'image/jpeg' });
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


	function showLoadingSpinner() {
		$("#loadingSpinner").show();
	}

	function hideLoadingSpinner() {
		$("#loadingSpinner").hide();
	}