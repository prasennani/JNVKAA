var base64String = "";
var donationId="";


$(document).ready(function () {
    $('#preloader').css('display', 'flex');
    let searchParams = new URLSearchParams(window.location.search);
    let param = searchParams.get('e');
    donationId = param;
    showDonationDatas();
    initProfilePic();


    //getuserAccessLevel();

    //$( "#date" ).datepicker( "setDate", new Date());

    $('#updateDonation').click(function(){
        UpdateDontionData();
        
    });

    $('#delete').click(function(){
        DeleteDonationData();
    });
    

   

    /*$('#del').click(function(){
        deleteImage();
    });*/
});
/*
function getuserAccessLevel() {
    $.ajax({
        url: "../WebService.asmx/getUserAcessLevel",
        type: "POST",
        contentType: "application/json",
        // data: "{ 'uid': '" + userid + "'}",
        dataType: "json",
        success: function (response) {
            user = response.d;
            switch (parseInt(user) !== 0) {
                case 0:
                    alert("Unauthorized Access. Please Login");
                    window.location = "../login.html";
                    break;
                case 1:
                    showUserEvent();
                    initProfilePic();
                    getEventPic();
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

}*/

function validateFileType(event) {
    var fileName = document.getElementById("fileprofile").value;
    var idxDot = fileName.lastIndexOf(".") + 1;
    var extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
    if (extFile == "jpg" || extFile == "jpeg" || extFile == "png") {
        //TO DO
        var output = document.getElementById('imgprofile');
        
        initProfilePic();
        output.src = URL.createObjectURL(event.target.files[0]);
        output.onload = function () {
            URL.revokeObjectURL(output.src) // free memory
        }


    } else {
        $("#fileprofile").val(null);
        alert("Only jpg/jpeg and png files are allowed!");
    }
}

function initProfilePic(){

    $('#fileprofile').on('change', function() {      
        compressImage()
    });

    
    
       
}

function showDonationDatas(){
    $.ajax({
        url: "../WebService.asmx/getEditDonationData",
        type: "POST",
        contentType: "application/json",
        data: "{ 'DonationId': '" + donationId + "'}",
        dataType: "json",
        success: function (response) {
            Donation = JSON.parse(JSON.parse(response.d));
            if (Donation[0].title.localeCompare("521") === 0){
                alert("No records found");
                $('#preloader').css('display', 'none');
            }
            else if (Donation[0].title.localeCompare("522") === 0)
                alert("Something went wrong. Please try again.");
            else {
                $('#title').val(Donation[0].title);
                $('#category').val(Donation[0].category);
                $('#targetamount').val(Donation[0].targetamount);
                $('#description').val(Donation[0].description);
                $('#expendLink').val(Donation[0].expendLink);
                $('#DoanteStatus').val(Donation[0].donationstatus);
                $('#imgprofile').attr('src', String(Donation[0].photo).replaceAll('"', ''));
               
                

                $('#preloader').css('display', 'none');  

            }
        }

    }).done(function () {


    }).fail(function (XMLHttpRequest, status, error) {
        console.log("Status " + status + "Error" + error);
    });
}


function UpdateDontionData() {

    
    if (donationId.length > 0) {
        // alert("uid"+userid+"fname"+$('#fname').val()+"sname"+$('#sname').val()+"gender"+$('#gender').val()+"dob"+$('#dob').val()+"maritalstatus"+$('#maritalstatus').val()+"bgroup"+$('#bloodgroup').val()+"phno"+$('#phno').val());
        $.ajax({
            url: '../WebService.asmx/updateDonationPurposeData',
            type: "POST", // type of the data we send (POST/GET)
            contentType: "application/json",
            data: "{ 'donateId': '" + donationId +"', 'title': '" + $('#title').val() +  "', 'category': '" + $('#category').val()+  "', 'photo': '" + base64String + "', 'description': '" + $('#description').val() + "', 'targetAmount': '" + $('#targetamount').val() + "', 'expendLink': '" + $('#expendLink').val() + "', 'donateStatus': '" + $('#DoanteStatus').val() + "'}",
            datatype: "json",
            success: function (response) { // when successfully sent data and returned

                switch (parseInt(JSON.parse(response.d))) {
                    case 1:
                        alert("Data of Donation Purpose Updated");
                        window.location.href='events.html';

                        break;
                    case 0:
                        alert("Unable to update Event Data. Try after sometime.");
                        break;

                }

            } // success close
        }).done(function () {
        }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
            alert("Status: " + textStatus + ", Error: " + errorThrown);
            //alert("Something went wrong. Please contact Admin.");
        }).always(function () {
        }); // ajax call ends
    } else
        alert("Invalid user details");
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


function DeleteDonationData() {
    // Ajax request to delete event data
    $.ajax({
        url: '../WebService.asmx/delDonations',
        type: "POST", // HTTP request method
        contentType: "application/json",
        data: "{ 'donationId': '" + donationId + "'}", // Data to be sent to the server
        datatype: "json",
        success: function (response) { // Callback function for a successful request
            // Handle the response from the server
            switch (parseInt(JSON.parse(response.d))) {
                case 1:
                    alert("Data of Donation Purpose Deleted");
                    
                    break;
                case 0:
                    alert("Unable to Delete Event Data. Try after sometime.");
                    break;
            }
        }
    }).done(function () {
        // Additional code to be executed when the request is successfully completed
    }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
        // Handle the failure of the request
        alert("Status: " + textStatus + ", Error: " + errorThrown);
        // alert("Something went wrong. Please contact Admin.");
    }).always(function () {
        // Code to be executed regardless of success or failure
    });
}

