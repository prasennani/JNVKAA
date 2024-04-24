var base64String = "";
var storyid="";


$(document).ready(function () {
    var searchParams = new URLSearchParams(window.location.search);
    var param = searchParams.get('e');
    $('#preloader').css('display', 'flex');
    storyid = param;
    getStoryPic();
    initProfilePic();
    showUserStory();
    //getuserAccessLevel();
    

    $('#updateStory').click(function(){
        UpdateStoryData();
        
    });
    $('#deleteStory').click(function () {
        DeleteStory();

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
                    showUserStory();
                    initProfilePic();
                    getStoryPic();
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
*/
function validateFileType(event) {
    var fileName = document.getElementById("fileprofile").value;
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
        $("#fileprofile").val(null);
        alert("Only jpg/jpeg and png files are allowed!");
    }
}

function initProfilePic(){

    $('#fileprofile').on('change', function() {      
        compressImage();
    });

    
    
       
}

function saveImage(){
    //alert(base64String);
    if (base64String.length > 0) {
        if(storyid.length>0){
            $.ajax({
                url: '../WebService.asmx/updateStoreisPic',
                type: "POST", // type of the data we send (POST/GET)
                contentType: "application/json",
                data: "{ 'storyid': '"+storyid+"', 'baseval': '" + base64String + "'}",
                datatype: "json",
                success: function (response) { // when successfully sent data and returned
                    //    alert("Res: " + response.d);
                    switch (parseInt(JSON.parse(response.d))) {
                        case 1:
                            getStoryPic();
                            base64String = "";
                            
                            break;
                        case 0:
                            alert("Unable to update Story Pic. Try after sometime.");
                            break;
                    
                    }

                } // success close
            }).done(function () {
            }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
                alert("Status: " + textStatus + ", Error: " + errorThrown);
                //alert("Something went wrong. Please contact Admin.");
            }).always(function () {
            }); // ajax call ends
        }else
            alert("Invalid user details");
    } else
        alert("Please select an image to upload");
}

function getStoryPic() {
    
    $.ajax({
        url: '../WebService.asmx/getStoriesPic',
        type: "POST", // type of the data we send (POST/GET)
        contentType: "application/json",
        data: "{ 'storyid': '" + storyid + "'}",
        datatype: "json",
        success: function (response) { // when successfully sent data and returned
          //  alert("Res: " + JSON.stringify(response.d));
            if (response.d.length > 20) {
                $('#imgprofile').attr('src', String(response.d).replaceAll('"', ''));
                //$("#tarea").val(String(response.d).replaceAll('"', ''));
            }else
                $('#imgprofile').attr('src',"../assets/imgs/stories.png");
        } // success close
    }).done(function () {
    }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
        alert("Status: " + textStatus + ", Error: " + errorThrown);
        //alert("Something went wrong. Please contact Admin.");
    }).always(function () {
    }); // ajax call ends
}

function showUserStory(){
    $.ajax({
        url: "../WebService.asmx/GetStory",
        type: "POST",
        contentType: "application/json",
        data: "{ 'storyid': '" + storyid + "'}",
        dataType: "json",
        success: function (response) {
            story = JSON.parse(JSON.parse(response.d));
            if (story[0].title.localeCompare("521") === 0) {
                alert("No records found");
                $('#preloader').css('display', 'none');
            }
            else if (story[0].title.localeCompare("522") === 0)
                alert("Something went wrong. Please try again.");
            else {
                $('#title').val(story[0].title);
                $('#postedby').val(story[0].postedby);
                $('#description1').val(story[0].description1);
                $('#description2').val(story[0].description2);
                $('#description3').val(story[0].description3);
                $('#showonsite').val(story[0].showonsite).change();
                $('#preloader').css('display', 'none');




            }
        }

    }).done(function () {


    }).fail(function (XMLHttpRequest, status, error) {
        console.log("Status " + status + "Error" + error);
    });
}


function UpdateStoryData() {


    if (storyid.length > 0) {
       // alert("storyid"+storyid+"fname"+$('#fname').val()+"sname"+$('#sname').val()+"gender"+$('#gender').val()+"dob"+$('#dob').val()+"maritalstatus"+$('#maritalstatus').val()+"bgroup"+$('#bloodgroup').val()+"phno"+$('#phno').val());
        $.ajax({
            url: '../WebService.asmx/updateStoriesData',
            type: "POST", // type of the data we send (POST/GET)
            contentType: "application/json",
            data: "{ 'storyid': '" + storyid+ "', 'storytitle': '" + $('#title').val() +  "', 'postedby': '" + $('#postedby').val() + "', 'description1': '" + $('#description1').val() + "', 'description2': '" + $('#description2').val() + "', 'description3': '" + $('#description3').val()+ "', 'showonsite': '" + $('#showonsite').val()+ "'}",
            datatype: "json",
            success: function (response) { // when successfully sent data and returned
              //  alert("Res: " + response.d);
                switch (parseInt(JSON.parse(response.d))) {
                    case 1:
                        alert("Data of Story Updated");
                        window.location.href = '../admin/stories.html'; // Redirect to the specified URL




                        break;
                    case 0:
                        alert("Unable to update Story Data. Try after sometime.");
                        break;

                }

            } // success close
        }).done(function () {
        }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
            alert("Status: " + textStatus + ", Error: " + errorThrown);
            alert("Something went wrong. Please contact Admin.");
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
                       // alert(base64String);
                        saveImage();

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


function DeleteStory() {
    // Ajax request to delete event data
    $.ajax({
        url: '../WebService.asmx/DeleteStory',
        type: "POST", // HTTP request method
        contentType: "application/json",
        data: "{ 'storyId': '" + storyid + "'}", // Data to be sent to the server
        datatype: "json",
        success: function (response) { // Callback function for a successful request
            // Handle the response from the server
            switch (parseInt(JSON.parse(response.d))) {
                case 1:
                    alert("Data of Story Deleted");
                    window.location.href = '../admin/stories.html'; // Redirect to the specified URL
                    break;
                case 0:
                    alert("Unable to Delete Story Data. Try after sometime.");
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

