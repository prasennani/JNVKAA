var base64String = "";
var folderid = "";
var foldername;


$(document).ready(function () {
    $('.loader').css('display', 'flex');
    var searchParams = new URLSearchParams(window.location.search);
    var param = searchParams.get('folderid');
     foldername = searchParams.get('foldername');
    folderid = param;
    //alert(foldername);
    
    showGalleryImages()
    initProfilePic();
   // showUserEvent();

   // getProfilePic();

    //$( "#date" ).datepicker( "setDate", new Date());

    $('#saveImage').click(function () {
        saveImage();     
    });
    
    $('#deleteFolder').click(function () {
        deleteFolder();
    });


   

    /*$('#del').click(function(){
        deleteImage();
    });*/
});






function validateFileType(event) {
    
    var fileName = document.getElementById('photo').value;
    var idxDot = fileName.lastIndexOf(".") + 1;
    var extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
    if (extFile == "jpg" || extFile == "jpeg" || extFile == "png") {
        //TO DO
        /*var output = document.getElementById('imgprofile');
        output.src = URL.createObjectURL(event.target.files[0]);
        output.onload = function () {
            URL.revokeObjectURL(output.src) // free memory
        }*/



    } else {
        $("#photo").val(null);
        alert("Only jpg/jpeg and png files are allowed!");
    }
}

function initProfilePic() {
    
    
    $('#photo').on('change', function () {
        
        compressImage();
    });




}

function saveImage() {
    
    if (base64String.length > 0) {
        
        if (folderid.length > 0) {
            $.ajax({
                url: '../WebService.asmx/addGalleryImage',
                type: "POST", // type of the data we send (POST/GET)
                contentType: "application/json",
                data: "{ 'folderid': '" + folderid + "', 'photo': '" + base64String + "'}",
                datatype: "json",
                success: function (response) { // when successfully sent data and returned
                    //    alert("Res: " + response.d);
                    switch (parseInt(JSON.parse(response.d))) {
                        case 1:
                            
                            alert("Image Stored Successfully!");
                            showGalleryImages();


                            break;
                        case 0:
                            alert("Unable to update Profile Pic. Try after sometime.");
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
    } else
        alert("Please select an image to upload");
}

function showGalleryImages() {
    $('.loader').css('display', 'flex');
    $('#galleryImages').empty();
    $('#gallerytitle').text(foldername);
    
    $.ajax({
        url: "../WebService.asmx/showGalleryImages",
        type: "POST",
        contentType: "application/json",
        data:"{'folderid':'"+folderid+"'}",
        dataType: "json",
        success: function (response) {
            images = JSON.parse(JSON.parse(response.d));
            if (images[0].photo.localeCompare("521") === 0) {
                $('.loader').css('display', 'none');
                alert("No records found");
            }
            else if (images[0].photo.localeCompare("522") === 0)
                alert("Something went wrong. Please try again.");
            else {

                for (i = 0; i < images.length; i++) {


                    //   var image = '<img src="' + images[i].photo + '"   class="img-fluid hover-shadow rounded m-1"   alt="image' + i + '" width="150px"/>'

                    var image = '<div class="d-flex justify-content-end rounded m-1" style="background: url(' + images[i].photo + ') white; width:120px; height: 120px; background-size: contain; background-repeat: no-repeat;">';
                    image += '  <i class="bi bi-trash3-fill text-danger m-1 rounded-circle text-center" onclick=\'deleteImage("' + images[i].imgId + '")\' style="background-color: white; width: 25px; height: 25px;"></i></div>';


                    $('#galleryImages').append(image);
                }
                $('.loader').css('display', 'none');
                //j = i;
            }

        }

    }).done(function () {


    }).fail(function (XMLHttpRequest, status, error) {
        console.log("Status " + status + "Error" + error);
    });


    //Edit user data and getting data using button 




}

function compressImage() {

    var inputImage = document.getElementById('photo');
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


function deleteImage(imageId) {
    // Ajax request to delete event data
    $.ajax({
        url: '../WebService.asmx/DeleteImage',
        type: "POST", // HTTP request method
        contentType: "application/json",
        data: "{ 'imageId': '" + imageId + "'}", // Data to be sent to the server
        datatype: "json",
        success: function (response) { // Callback function for a successful request
            // Handle the response from the server
            switch (parseInt(JSON.parse(response.d))) {
                case 1:
                    alert("Image Deleted Successfully");
                    showGalleryImages();
                    break;
                case 0:
                    alert("Unable to Delete Image. Try after sometime.");
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

function deleteFolder() {
    if (confirm("Are you sure you want delete this Folder?") == true) {
        $('.loader').css('display', 'flex');
        
        if (folderid.length > 0) {
            $.ajax({
                url: '../WebService.asmx/DeleteGallerFolder',
                type: "POST", // type of the data we send (POST/GET)
                contentType: "application/json",
                data: "{ 'FolderId': '" + folderid + "'}",
                datatype: "json",
                success: function (response) { // when successfully sent data and returned
                    //    alert("Res: " + response.d);
                    switch (parseInt(JSON.parse(response.d))) {
                        case 1:
                            $('.loader').css('display', 'none');
                            alert("Gallery Folder Delete Successfully");
                            window.location.href = '../admin/gallery.html';
                            break;
                        case 0:
                            $('.loader').css('display', 'none');
                            alert("Unable to update Profile Pic. Try after sometime.");
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

}