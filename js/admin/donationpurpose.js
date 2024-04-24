var base64String = "";

$(document).ready(function () {

    $('#saveDonation').click(function () {
        addDonation();
    });
    initProfilePic();
    //getuserAccessLevel();
});

function addDonation() {
    $('#preloader').css('display', 'flex');

    var donationData = {
        donationtitle: $('#title').val(),
        category: $('#category').val(),
        targetamount: $('#targetamount').val(),
        description: $('#description').val(),
        photo: base64String,
        ExpendLink: $('#expendLink').val()
    };
    $.ajax({
        url: '../WebService.asmx/addDonation',
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(donationData),
        dataType: "json",
        success: function (response) {
            $('#preloader').css('display', 'flex');
            console.log("Response from server:", response); // Log the response for debugging

            // Parse the response as an integer
            var parsedResponse = JSON.parse(response.d)
            parsedResponse = parseInt(parsedResponse);
            
            // Check if parsing was successful and handle accordingly
            switch (parsedResponse) {
                case 1:
                    $('#preloader').css('display', 'none');
                    alert("Donation Purpose Added");
                    break;
                case 520:
                    $('#preloader').css('display', 'none');
                    alert("Unable to add donation purpose. Please try again later.");
                    break;
                case 2:
                    $('#preloader').css('display', 'none');
                    alert("Unable to add donation purpose. Please check once.");
                    break;
                case 3:
                    $('#preloader').css('display', 'none');
                    alert("Unable to add donation purpose. Please try again later.");
                    break;
                default:
                    $('#preloader').css('display', 'none');
                    alert("Unexpected response received.");
                    break;
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            alert("An error occurred while processing your request. Please try again later.");
            alert("Please Enter Amount without Comma(,)");
            console.log("Error: " + textStatus + ", Details: " + errorThrown);
        },
        complete: function () {
            // Additional actions to be performed after success or failure
        }
    });
}


function validateFileType(event) {
    var fileName = document.getElementById("fileprofile").value;
    var idxDot = fileName.lastIndexOf(".") + 1;
    var extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
    if (extFile == "jpg" || extFile == "jpeg" || extFile == "png") {
        //TO DO
        var output = document.getElementById('imgprofile');
        output.src = URL.createObjectURL(event.target.files[0]);
        output.onload = function () {
            URL.revokeObjectURL(output.src) // free memory
        }

        $('#imgprofile').attr('src', output.src);


    } else {
        $("#fileprofile").val(null);
        alert("Only jpg/jpeg and png files are allowed!");
    }
}
/*
function initProfilePic() {

    $('#fileprofile').on('change', function () {
        var img = $('#fileprofile')[0].files[0];



        var reader = new FileReader();
        reader.onloadend = function (e) {
            $("#imgprofile").attr("src", e.target.result);

            //$("#base64Img").attr("href",reader.result); 
            base64String = reader.result;
            //alert(base64String);
            //saveImage();
            //alert(base64String);
        }
        reader.readAsDataURL(img);


    });




}

*/

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
                        // alert(base64String);


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
                    initProfilePic();
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

