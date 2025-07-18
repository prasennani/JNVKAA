﻿var base64String = "";
var userid = "";



$(document).ready(function () {
    $('#preloader').css('display', 'flex');
    
   
    getuserAccessLevel();
    getAllProfessions();
    getAllDesignations();

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
                $('#idno').text("JNVKAA ID No.: " + user[0].uid);
                $('#fullname1').text(user[0].fname + " " + user[0].sname);
                $('#fullname2').text(user[0].fname + " " + user[0].sname);
                $('#gender').val(user[0].gender).change();
                $('#dob').val(user[0].dob);
                $('#maritalstatus').val(user[0].marriagestatus).change();
                $('#bloodgroup').val(user[0].bgroup).change();
                $('#bloodgroup1').text("Blood Group: " + getBloodGroup(user[0].bgroup));
                $('#phno').val(user[0].uphno);
                $('#phno1').text(user[0].country_code + " " + user[0].uphno);
                $('#email').val(user[0].uemail);
                $('#email1').text(user[0].uemail);
                $('#city').val(user[0].ucity);
                $('#city1').text("City: " + user[0].ucity);
                $('#profession').val(user[0].profession);
                $('#profession1').text(user[0].profession);
                $('#workingin').val(user[0].workingin);
                $('#workingin1').text(user[0].workingin);
                $('#lclass').val(user[0].lclass).change();
                $('#workingas').val(user[0].workingas).change();
                $('#bio').val(user[0].ubio);
                $('#bio1').text(user[0].ubio);
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
                $('#designation1').text(user[0].designation);
                $('#medinsuexp').val(user[0].medinsuexp);
                $('#medinsupro').val(user[0].medinsupro);
                $('#expertin').val(user[0].expertin);
                $('#expertin1').text(user[0].expertin);
                $('#native').val(user[0].native);
                $('#native1').text(user[0].native);
                $('#hob2').val(user[0].hob2);
                $('#batchno').val(user[0].batchNo);
                $('#batchno1').text("Batch No: " + user[0].batchNo);
                $('#country_code').val(user[0].country_code);
                $('#house').val(user[0].house);
                $('#house1').text(user[0].house);

                var instaUrl = user[0].instaurl;
                var fbookUrl = user[0].fbookurl;
                var linkdnUrl = user[0].linkdnurl;
                $('.instagram').attr('href', instaUrl);
                $('.facebook').attr('href', fbookUrl);
                $('.twitter').attr('href', linkdnUrl);
                $('.instagram').click(function (event) {
                    event.preventDefault(); // Prevent the default action of the anchor tag
                    window.open(instaUrl, '_blank'); // Open the link in a new tab
                });
                $('.facebook').click(function (event) {
                    event.preventDefault(); // Prevent the default action of the anchor tag
                    window.open(fbookUrl, '_blank'); // Open the link in a new tab
                });
                $('.twitter').click(function (event) {
                    event.preventDefault(); // Prevent the default action of the anchor tag
                    window.open(linkdnUrl, '_blank'); // Open the link in a new tabs
                });
            }
            $('#preloader').css('display', 'none');
        }

    }).done(function () {
    }).fail(function (XMLHttpRequest, status, error) {
        console.log("Status " + status + "Error" + error);
    });
}

function getBloodGroup(value) {
    switch (value) {
        case '1':
            return 'O+';
        case '2':
            return 'O-';
        case '3':
            return 'A+';
        case '4':
            return 'A-';
        case '5':
            return 'B+';
        case '6':
            return 'B-';
        case '7':
            return 'AB+';
        case '8':
            return 'AB-';
        default:
            return 'Unknown';
    }
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
                
            }

        }

    }).done(function () {


    }).fail(function (XMLHttpRequest, status, error) {
        console.log("Status " + status + "Error" + error);
    });


    //Edit user data and getting data using ..button 


}

function getAllDesignations() {
    $.ajax({
        url: '../WebService.asmx/getDesignations',
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            user = JSON.parse(JSON.parse(response.d));
            if (user[0].designation.localeCompare("521") === 0)
                alert("No records found");
            else if (user[0].designation.localeCompare("522") === 0)
                alert("Something went wrong. Please try again.");
            else {

                for (i = 0; i < user.length; i++) {


                    var txt = '<option value="' + user[i].designation + '">' + user[i].designation + '</option>';



                    $('#designation').append(txt);
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

//$(document).ready(function() {
  //  $('#profession').select2({
    //    placeholder: "Select a profession",
      //  allowClear: true // This option allows clearing the selection
 //   });
//});

$(document).ready(function () {
    // Show/hide input field based on selection
    $('#profession').change(function () {
        if ($(this).val() === 'other') {
            $('#otherProfessionInput').show();
            $('#otherProfessionInput').attr('placeholder', 'Enter your profession');
            $('#otherProfessionLabel').text('Please type your current profession here');
        } else {
            $('#otherProfessionInput').hide();
            $('#otherProfessionInput').removeAttr('placeholder');
            $('#otherProfessionLabel').text('');
        }
    });

    $('#designation').change(function () {
        if ($(this).val() === 'other') {
            $('#otherDesignationInput').show();
            $('#otherDesignationInput').attr('placeholder', 'Enter your designation');
            $('#otherDesignationLabel').text('Please type your Designation here');
        } else {
            $('#otherDesignationInput').hide();
            $('#otherDesignationInput').removeAttr('placeholder');
            $('#otherDesignationLabel').text('');
        }
    });

    // Validate the form before submission
    $('form').submit(function () {
        if ($('#professionSelect').val() === 'other' && $('#otherProfessionInput').val() === '') {
            alert('Please enter your profession');
            return false; // Prevent form submission
        }
        if ($('#designationSelect').val() === 'other' && $('#otherDesignationInput').val() === '') {
            alert('Please enter your designation');
            return false; // Prevent form submission
        }
    });
});



function UpdateData() {
    var professionValue = $('#profession').val();
    var designationValue = $('#designation').val();
    // Check if the profession value is 'other'
    if (professionValue === 'other') {
        // Get the value from the otherProfessionInput field
        professionValue = $('#otherProfessionInput').val();
    }
    if (designationValue === 'other') {
        // Get the value from the otherProfessionInput field
        designationValue = $('#otherDesignationInput').val();
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
            'native': $('#native').val(),
            'hob2': $('#hob2').val(),
            'designation': designationValue, // Use the designationValue variable
            'country_code': $('#country_code').val(),
            'house': $('#house').val()
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
                $('#imgprofile1').attr('src', String(response.d).replaceAll('"', ''));
                $('#profileicon').attr('src', String(response.d).replaceAll('"', ''));
                $('#profileicon2').attr('src', String(response.d).replaceAll('"', ''));

                //$("#tarea").val(String(response.d).replaceAll('"', ''));
            } else {
                $('#imgprofile').attr('src', "../assets/imgs/profile pic.png");
                $('#imgprofile1').attr('src', "../assets/imgs/profile pic.png");
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
            $('#puname1').text(user);
            $('#puname2').text(user);
            $('#puname3').text(user);
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
            data: "{ 'userPass': '" + $('#confirmPass').val() + "'}",
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

function printCard() {
    const card = document.getElementById('profileCard');
    const cardClone = card.cloneNode(true);
    const printWindow = window.open('', '_blank');

    // Define CSS styles for A5 size
    const styles = `
        <style>

            @page {
                size: A5 portrait; /* Set page size to A5 and portrait orientation */
                margin: 0; /* Remove default margin */
            }
            body {
                display: flex;
                justify-content: center;
                width: 148mm; /* Set width to match A5 size */
                height: 210mm; /* Set height to match A5 size */
                margin: 0; /* Remove default margin */
                padding: 10mm; /* Add padding to maintain spacing */
            }
            .card {
                width: 100%; /* Set card width to fill page */
                height: 100%; /* Set card height to fill page */
            }
            /* Adjust other styles as needed */
        </style>
    `;

    printWindow.document.write(`
        <html>
            <head>
                <title>Profile Card</title>
                <link href="../css/bootstrap.min.css" rel="stylesheet">
                <link href="../css/style.css" rel="stylesheet">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css" rel="stylesheet">
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Saira:wght@500;600;700&display=swap"
          rel="stylesheet">
                ${styles}
            </head>
            <body>${cardClone.outerHTML}</body>
        </html>
    `);

    printWindow.document.close();
    printWindow.print();
    printWindow.close();
}


$(document).ready(function () {
    loadBusinessFormData();
});

let currentUploadType = "";
function validateBusinessImage(event, previewId, type) {
    const fileInput = event.target;
    const fileName = fileInput.value;
    const idxDot = fileName.lastIndexOf(".") + 1;
    const extFile = fileName.substr(idxDot, fileName.length).toLowerCase();

    if (["jpg", "jpeg", "png"].includes(extFile)) {
        currentUploadType = type;
        compressBusinessImage(fileInput, previewId);
    } else {
        fileInput.value = null;
        alert("Only jpg/jpeg and png files are allowed!");
    }
}

function compressBusinessImage(input, previewId) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.src = e.target.result;
            img.onload = function () {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const maxDimension = 800;
                let newWidth, newHeight;

                if (img.width > img.height) {
                    newWidth = maxDimension;
                    newHeight = img.height / img.width * maxDimension;
                } else {
                    newHeight = maxDimension;
                    newWidth = img.width / img.height * maxDimension;
                }

                canvas.width = newWidth;
                canvas.height = newHeight;
                ctx.drawImage(img, 0, 0, newWidth, newHeight);
                const compressedData = canvas.toDataURL('image/jpeg', 0.8);
                const blob = dataURItoBlob(compressedData);

                if (blob.size < 900 * 1024) {
                    document.getElementById(previewId).src = compressedData;
                    const reader2 = new FileReader();
                    reader2.onloadend = function () {
                        uploadBusinessImage(reader2.result);
                    };
                    reader2.readAsDataURL(blob);
                } else {
                    alert('Please provide image size below 900KB.');
                }
            };
        };
        reader.readAsDataURL(file);
    }
}

function uploadBusinessImage(base64String) {
    const endpoint = currentUploadType === 'visitingcard' ? 'updateVisitingCard' : 'updateBusinessImage';
    $.ajax({
        url: '../WebService.asmx/' + endpoint,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ uid: '0', baseval: base64String }),
        success: function (res) {
            const val = JSON.parse(res.d);
            if (val === "1") alert(currentUploadType + " updated successfully.");
            else alert("Failed to update " + currentUploadType + ".");
        },
        error: function () {
            alert("Error uploading " + currentUploadType + ".");
        }
    });
}

function loadBusinessImages() {
    $.ajax({
        url: '../WebService.asmx/getVisitingCard',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ uid: '0' }),
        success: function (res) {
            const url = JSON.parse(res.d);
            if (url.length > 20) $('#visitingCard').attr('src', url);
        }
    });
    $.ajax({
        url: '../WebService.asmx/getBusinessImage',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ uid: '0' }),
        success: function (res) {
            const url = JSON.parse(res.d);
            if (url.length > 20) $('#businessImage').attr('src', url);
        }
    });
}

$(document).ready(function () {
    loadBusinessImages();
});


// This is the enhanced JS file that handles:
// - auto-filling business form from user data if new
// - loading existing business data
// - saving new business or updating existing one

let businessExists = false;

function initBusinessForm() {
    // Step 1: Get user profile data
    $.ajax({
        url: "../WebService.asmx/getuserdata",
        type: "POST",
        contentType: "application/json",
        data: "{ 'uid': '0' }",
        dataType: "json",
        success: function (response) {
            let user = JSON.parse(JSON.parse(response.d))[0];
            if (user.ustatus === "1") {
                $('#bpemail').val(user.uemail);
                $('#pphno').val(user.uphno);
                $('#userid').val(user.uid);
                $('#batchno').val(user.batchNo);
            }
        }
    });

    // Step 2: Get business data and show/hide sections
    $.ajax({
        url: '../WebService.asmx/getBusinessdata',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ uid: '0' }),
        success: function (res) {
            const data = JSON.parse(JSON.parse(res.d))[0];

            if (data.ustatus === "1") {
                businessExists = true;

                // Show update, hide save
                $('#saveBusinessBtn').hide();
                $('#updateBusinessBtn').show();

                // Fill values from existing business data
                $('#bemail').val(data.bemail);
                $('#bphno').val(data.bphno);
                $('#pphno').val(data.bpphno);
                $('#bname').val(data.bname);
                $('#bnature').val(data.bnature);
                $('#registrationmode').val(data.registrationmode);
                $('#baddress').val(data.baddress);
                $('#bpincode').val(data.bpincode);
                $('#bcity').val(data.bcity);
                $('#bservices').val(data.bservices);
                $('#note').val(data.bdescription);
                $('#bwebsite').val(data.bwebsite);
                $('#binstaurl').val(data.binstaurl);
                $('#bfbookurl').val(data.bfbookurl);
                $('#botherurl1').val(data.bourl1);
                $('#botherurl2').val(data.bourl2);
                $('#bmapurl').val(data.bmapurl);
                $('#userid').val(data.bid);
                $('#batchno').val(data.batchno);

                // Show visiting card and brochure image section
                $('#businessImagesContainer').show();

                if (data.bcardphoto) {
                    $('#visitingCard').attr('src', data.bcardphoto);
                }

                if (data.bimage) {
                    $('#businessImage').attr('src', data.bimage);
                }

            } else {
                // No business data exists yet

                businessExists = false;

                $('#saveBusinessBtn').show();
                $('#updateBusinessBtn').hide();

                // Hide the visiting card and brochure section
                $('#businessImagesContainer').hide();

                // Optional: Clear values if needed
                $('#businessForm')[0].reset();
                $('#visitingCard').attr('src', '../img/no-card.jpg');
                $('#businessImage').attr('src', '../img/no-brochure.jpg');
            }
        }
    });
}


function submitOrUpdateBusiness(isUpdate) {
    let payload = {
        bname: $('#bname').val(),
        bnature: $('#bnature').val(),
        registrationmode: $('#registrationmode').val(),
        baddress: $('#baddress').val(),
        bpincode: $('#bpincode').val(),
        bcity: $('#bcity').val(),
        bphno: $('#bphno').val(),
        bpemail: $('#bpemail').val(),
        bemail: $('#bemail').val(),
        pphno: $('#pphno').val(),
        bservices: $('#bservices').val(),
        note: $('#note').val(),
        bwebsite: $('#bwebsite').val(),
        binstaurl: $('#binstaurl').val(),
        bfbookurl: $('#bfbookurl').val(),
        botherurl1: $('#botherurl1').val(),
        botherurl2: $('#botherurl2').val(),
        bmapurl: $('#bmapurl').val(),
        fname: $('#fname').val(),           // FIXED: added fname and sname for C#
        sname: $('#sname').val()
    };

    $.ajax({
        url: '../WebService.asmx/' + (isUpdate ? 'updateBusinessDataByUser' : 'insertBusinessDataByUser'),
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(payload),
        success: function (res) {
            let result = JSON.parse(res.d);
            if (result === "success") {
                alert(isUpdate ? "Business details updated successfully!" : "Business details saved successfully!");
            } else if (result === "exists") {
                alert("Business data already exists for this user. Kindly refresh the page to Update.");
            } else if (result === "520") {
                alert("Session expired. Please login again.");
            } else {
                alert("Failed: " + result);
            }
        },
        error: function () {
            alert("Server error. Please try again later.");
        }
    });
}


$(document).ready(function () {
    initBusinessForm();

    $('#saveBusinessBtn').on('click', function () {
        submitOrUpdateBusiness(false);
    });

    $('#updateBusinessBtn').on('click', function () {
        submitOrUpdateBusiness(true);
    });
});

$(document).ready(function () {
    $("#Savepollbtn").click(function (e) {
        e.preventDefault();

        const vote1 = $("#vote1").val();
        const vote2 = $("#vote2").val();
        const vote3 = $("#vote3").val();
        const vote4 = $("#vote4").val();
        const vote5 = $("#vote5").val();
        const note = $("#pollnote").val();

        const votes = [vote1, vote2, vote3, vote4, vote5];

        // Remove "Select" and check for duplicates
        const filteredVotes = votes.filter(v => v !== "0");
        const uniqueVotes = [...new Set(filteredVotes)];

        if (uniqueVotes.length !== filteredVotes.length) {
            alert("❗ Each vote priority must be unique.");
            return;
        }

        $.ajax({
            url: "../WebService.asmx/savePollVotes",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({ vote1, vote2, vote3, vote4, vote5, note }),
            success: function (res) {
                const result = JSON.parse(res.d);
                if (result === "success") {
                    alert("✅ Your vote has been submitted successfully!");
                    location.reload();
                } else if (result === "already") {
                    alert("⚠️ You have already submitted your vote for this poll.");
                } else {
                    alert("❌ " + result);
                }
            },
            error: function () {
                alert("❌ Failed to submit your vote. Try again.");
            }
        });
    });
});

