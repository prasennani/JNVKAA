$(document).ready(function () {

    $('#saveFolder-btn').click(function () {
        addFolderName();
    });

    //getuserAccessLevel();
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
function addFolderName() {
    
    $.ajax({
        url: '../WebService.asmx/addFolderName',
        type: "POST", // type of the data we send (POST/GET)
        contentType: "application/json",
        data: "{ 'foldername': '" + $('#folder-name').val() + "'}",
        datatype: "json",
        success: function (response) { // when successfully sent data and returned
            // alert("Res: " + response.d);
            switch (parseInt(JSON.parse(response.d))) {
                case 1:
                    alert("Folder Name Inserted");
                    break;
                case 2:
                    alert("Inserted Folder Name Alredy Exist . Try after sometime.");
                    alert($('#foldername').val());
                    break;
                case 0:
                    alert("Unable to Insert Folder Name . Try after sometime.");
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
