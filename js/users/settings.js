var base64String = "";
var userid = "";



$(document).ready(function () {
    $('#preloader').css('display', 'flex');
    

    getuserAccessLevel();
    getAllProfessions();

    $('#Savebtn').click(function(){
        UpdateData();
        
    });
    $('#ChangePass').click(function () {
        showModal();
        

    });
    $('#updatePassword').click(function () {
        changePassword();
    });

});

function showUserData(){
    $.ajax({
        url: "../WebService.asmx/getuserdata",
        type: "POST",
        contentType: "application/json",
        data: "{ 'uid': '0'}",
        dataType: "json",
        success: function (response) {
            //alert("Res: " + response.d);
            user = JSON.parse(JSON.parse(response.d));
            if (user[0].ustatus.localeCompare("521") === 0)
                alert("No records found");
            else if (user[0].ustatus.localeCompare("520") === 0)
                window.location = "../login.html";
            else {
                $('#fname').val(user[0].fname);
                $('#sname').val(user[0].sname);
                $('#gender').val(user[0].gender).change();
                $('#dob').val(user[0].dob);
                $('#maritalstatus').val(user[0].marriagestatus).change();
                $('#bloodgroup').val(user[0].bgroup).change();
                $('#phno').val(user[0].uphno);
                $('#email').val(user[0].uemail);
                $('#city').val(user[0].ucity);
                $('#profession').val(user[0].profession);
                $('#workingin').val(user[0].workingin);
                $('#lclass').val(user[0].lclass).change();
                $('#workingas').val(user[0].workingas).change();
                $('#bio').val(user[0].ubio);
                switch (parseInt(user[0].ustatus)) {
                    case -2:
                        $('#Pstatus').text("Pending");
                        break;
                    case -1:
                        $('#Pstatus').text("Pending");
                        break;
                    case 1:
                        $('#Pstatus').text("Approved");
                        break;
                    case 2:
                        $('#Pstatus').text("Blocked");
                        break;
                }
                $('#instaid').val(user[0].instaurl);
                $('#fbid').val(user[0].fbookurl);
                $('#lnkid').val(user[0].linkdnurl);

                $('#designation').val(user[0].designation);
                $('#medinsuexp').val(user[0].medinsuexp);
                $('#medinsupro').val(user[0].medinsupro);
                $('#expertin').val(user[0].expertin);
                $('#hob1').val(user[0].hob1);
                $('#hob2').val(user[0].hob2);
                $('#batchno').val(user[0].batchNo);
                $('#country_code').val(user[0].country_code);
            }
            $('#preloader').css('display', 'none');
        }

    }).done(function () {
    }).fail(function (XMLHttpRequest, status, error) {
        console.log("Status " + status + "Error" + error);
    });
}


function getAllProfessions() {
    $.ajax({
        url: '../WebService.asmx/getProfessions',
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            user = JSON.parse(JSON.parse(response.d));
            if (user[0].profession.localeCompare("521") === 0)
                alert("No records found");
            else if (user[0].profession.localeCompare("522") === 0)
                alert("Something went wrong. Please try again.");
            else {

                for (i = 0; i < user.length; i++) {


                    var txt = '<option value="' + user[i].profession + '">' + user[i].profession + '</option>';



                    $('#profession').append(txt);
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


$(document).ready(function() {
    $('#profession').select2({
        placeholder: "Select a profession",
        allowClear: true // This option allows clearing the selection
    });
});

$(document).ready(function () {
    // Show/hide input field based on selection
    $('#profession').change(function () {
        if ($(this).val() === 'other') {
            $('#otherProfessionInput').show();
        } else {
            $('#otherProfessionInput').hide();
        }
    });

    // Validate the form before submission
    $('form').submit(function () {
        if ($('#professionSelect').val() === 'other' && $('#otherProfessionInput').val() === '') {
            alert('Please enter your profession');
            return false; // Prevent form submission
        }
    });
});





function UpdateData() {
    var professionValue = $('#profession').val();
    // Check if the profession value is 'other'
    if (professionValue === 'other') {
        // Get the value from the otherProfessionInput field
        professionValue = $('#otherProfessionInput').val();
    }

    $.ajax({
        url: '../WebService.asmx/updateUserDataByUserSettings',
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            'fname': $('#fname').val(),
            'sname': $('#sname').val(),
            'gender': $('#gender').val(),
            'dob': $('#dob').val(),
            'maritalstatus': $('#maritalstatus').val(),
            'bgroup': $('#bloodgroup').val(),
            'phno': $('#phno').val(),
            'email': $('#email').val(),
            'city': $('#city').val(),
            'profession': professionValue, // Use the professionValue variable
            'workingin': $('#workingin').val(),
            'lclass': $('#lclass').val(),
            'workingas': $('#workingas').val(),
            'bio': $('#bio').val(),
            'instaurl': $('#instaid').val(),
            'fbookurl': $('#fbid').val(),
            'linkdnurl': $('#lnkid').val(),
            'medinsuexp': $('#medinsuexp').val(),
            'medinsupro': $('#medinsupro').val(),
            'expertin': $('#expertin').val(),
            'hob1': $('#hob1').val(),
            'hob2': $('#hob2').val(),
            'designation': $('#designation').val(),
            'country_code': $('#country_code').val()
        }),
        dataType: "json",
        success: function (response) {
            switch (parseInt(JSON.parse(response.d))) {
                case 1:
                    alert("User Data Updated Successfully");
                    location.reload();
                    break;
                case 0:
                    alert("Unable to update Profile Pic. Try after sometime.");
                    location.reload();
                    break;
            }
        }
    }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
        alert("Status: " + textStatus + ", Error: " + errorThrown);
    });
}



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

    $('#fileprofile').on('change', function () {
        compressImage();

        
    });


   
}

function saveImage(){
    
    if (base64String.length > 0) {
        
            $.ajax({
                url: '../WebService.asmx/updateProfilePic',
                type: "POST", // type of the data we send (POST/GET)
                contentType: "application/json",
                data: "{ 'uid': '0', 'baseval': '" + base64String + "'}",
                datatype: "json",
                success: function (response) { // when successfully sent data and returned
                      //  alert("Res: " + response.d);
                    switch (parseInt(JSON.parse(response.d))) {
                        case 1:
                            getProfilePic();
                            //alert("Success");
                            base64String = "";
                            
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
        alert("Please select an image to upload");
}

function getProfilePic() {
    $.ajax({
        url: '../WebService.asmx/getProfilePic',
        type: "POST", // type of the data we send (POST/GET)
        contentType: "application/json",
        data: "{ 'uid': '0'}",
        datatype: "json",
        success: function (response) { // when successfully sent data and returned

            if (response.d.length > 20) {
                $('#imgprofile').attr('src', String(response.d).replaceAll('"', ''));
                $('#profileicon').attr('src', String(response.d).replaceAll('"', ''));
                $('#profileicon2').attr('src', String(response.d).replaceAll('"', ''));

                //$("#tarea").val(String(response.d).replaceAll('"', ''));
            } else {
                $('#imgprofile').attr('src', "../assets/imgs/profile pic.png");
                $('#profileicon2').attr('src', "../assets/imgs/profile pic.png");
                $('#profileicon').attr('src', "../assets/imgs/profile pic.png");
            }
        } // success close
    }).done(function () {
    }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
        alert("Status: " + textStatus + ", Error: " + errorThrown);
        //alert("Something went wrong. Please contact Admin.");
    }).always(function () {
    }); // ajax call ends
}

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
                    getuser();
                    showUserData();
                    initProfilePic();
                    getProfilePic();
                    getuserDonations();
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

function showModal() {
	
    $("#changePassword").modal('show');
    
}

function changePassword() {
	
	var newPassword = $('#newPass').val();
    var confirmPassword = $('#confirmPass').val();
	
	
    if ($('#newPass').val() === '' || $('#confirmPass').val() === '') {
        
        $('#errormsg').text('Please enter both passwords');
        return false;
    }
	
	// Validate password
    if (!validatePassword(newPassword)) {
        $('#errormsg').text('Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character.');
        return;
    }

    if ($('#newPass').val() == $('#confirmPass').val()) {
        $('#errormsg').text('');
        $.ajax({
            url: '../WebService.asmx/updatePassword',
            type: "POST", // type of the data we send (POST/GET)
            contentType: "application/json",
            data: "{ 'userEmail': '" + $('#phno').val() + "', 'userPass': '" + $('#confirmPass').val() + "'}",
            datatype: "json",
            success: function (response) { // when successfully sent data and returned
                //  alert("Res: " + response.d);
                switch (parseInt(JSON.parse(response.d))) {
                    case 1:
                        hideModal();
                        alert("Password Updated Successfully");


                        break;
                    case 0:
                        alert("Unable to update Password. Try after sometime.");
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
    else {
        $('#errormsg').text("Password Doesn't Match");
        
    }
    
}

// Function to validate password
function validatePassword(password) {
    var passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
    return passwordPattern.test(password);
}

// Function to hide the modal
function hideModal() {
    $("#changePassword").modal('hide');


}
