var base64String = "";

$(document).ready(function () {
    
    $('#addEvent').click(function () {
        addEvents();
    });
    initProfilePic();
    //getuserAccessLevel();
    
});

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
function addEvents() {
    $('#preloader').css('display', 'flex');
    $.ajax({
        url: '../WebService.asmx/addEvent',
        type: "POST", // type of the data we send (POST/GET)
        contentType: "application/json",
        data: "{ 'title': '" + $('#title').val() + "', 'date': '" + $('#date').val() + "', 'time': '" + $('#time').val() + "', 'location': '" + $('#location').val() + "', 'organizedby': '" + $('#orgnizedby').val() + "', 'description': '" + $('#description').val() + "', 'descdetails': '" + $('#descdetail').val() + "', 'locationLink': '" + $('#locationlink').val() + "', 'photo': '" + base64String + "'}",
        datatype: "json",
        success: function (response) { // when successfully sent data and returned
            // alert("Res: " + response.d);
            switch (parseInt(JSON.parse(response.d))) {
                case 1:
                    $('#preloader').css('display', 'none');
                    alert("Event Inserted");
                    window.location = "events.html";
                    break;
                case 0:
                    alert("Unable to Insert Event Data. Try after sometime.");
                    $('#preloader').css('display', 'none');
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

function initProfilePic() {

    $('#fileprofile').on('change', function () {        
        compressImage();
    });




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
