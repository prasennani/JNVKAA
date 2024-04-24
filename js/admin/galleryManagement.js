$(document).ready(function () {
    var j = 0;
    $('.loader').css('display', 'flex');
    getAllGallery();


    //getuserAccessLevel();
});

function getAllGallery() {
    $('.loader').css('display', 'flex');
    $('#galleryManagement').empty();
    $.ajax({
        url: "../WebService.asmx/galleryManagement",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            gallery= JSON.parse(JSON.parse(response.d));
            if (gallery[0].foldername.localeCompare("521") === 0) {
                alert("No records found");
                $('.loader').css('display', 'none');
            }
            else if (gallery[0].foldername.localeCompare("522") === 0)
                alert("Something went wrong. Please try again.");
            else {

                for (i = 0; i < gallery.length; i++) {
                    var txt = '<tr><th scope="row">' + (parseInt(i) + 1) + '</th>';
                    txt += '<td>' + gallery[i].foldername + '</td>';
                    txt += '<td>' + gallery[i].createdon + '</td>';
                    txt += '<td>' + gallery[i].lastupdate + '</td>';
                    txt += '<td>' + gallery[i].countImage + '</td>';


                    //alert(user[i].uid
                    txt += '<th><p><a class="link-info link-opacity-50-hover" href="viewgallery.html?folderid=' + gallery[i].folderid + '&foldername=' + gallery[i].foldername + '"> View </a></p></th>';
                    $('#galleryManagement').append(txt);
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