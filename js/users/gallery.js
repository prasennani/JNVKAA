
var folderid = "";
$(document).ready(function () {
    $('#preloader').css('display', 'flex');
    

    
    getuserAccessLevel();
    $('#galleryselect').on('change', function () {
        $('#preloader').css('display', 'flex');
        folderid = $('#galleryselect :selected').val();
        
        
        showGalleryImages();


    });

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

            if (vals.length == 2) {
                switch (parseInt(vals[1])) {
                    case 1:
                        alert("Unauthorized access. Please Login");
                        window.location = "../login.html";
                        break;
                    case 0:
                        $('#puname').text(vals[0]);
                        console.log("wokring");
                        alert("working");
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
                    getAllFolderName();
                    getuser();
                    getuserDonations();
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



function getAllFolderName() {
    $.ajax({
        url: '../WebService.asmx/getFolderNameClass',
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            folderName= JSON.parse(JSON.parse(response.d));
            if (folderName[0].folderid.localeCompare("521") === 0) {
                alert("The Gallery Image Not Added");
            }
            else if (folderName[0].folderid.localeCompare("522") === 0)
                alert("Something went wrong. Please try again.");
            else {

                for (i = 0; i < folderName.length; i++) {


                    var txt = '<option value="' + folderName[i].folderid + '">' + folderName[i].foldername + '</option>';



                    $('#galleryselect').append(txt);
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




function showGalleryImages() {
    $('#galleryImages').empty();
    $('#imageGallery').remove();
     // Remove existing elements
    $.ajax({
        url: "../WebService.asmx/showGalleryImages",
        type: "POST",
        contentType: "application/json",
        data: "{'folderid':'" + folderid + "'}",
        dataType: "json",
        success: function (response) {
            //alert(response.d);
            images = JSON.parse(JSON.parse(response.d));
            if (images[0].photo.localeCompare("521") === 0) {
                $('#preloader').css('display', 'none');
                alert("The images are not added yet");
            }
            else if (images[0].photo.localeCompare("522") === 0)
                alert("Something went wrong. Please try again.");
            else {

                for (i = 0; i < images.length; i++) {

                    if (images[i].photo.length > 20) {
                        var image = '<div class="col-lg-4 col-md-6 wow fadeInUp " data-wow-delay="0.1s" id="imageGallery">';
                        image += ' <div class="service-item bg-white text-center h-100 align-items-center ">';
                        image += ' <img class="img-fluid " src="' + images[i].photo + '" alt="">';
                        image += '  </div> </div>';
                    }



                    $('#galleryImages').append(image);
                }
                $('#preloader').css('display', 'none');
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
