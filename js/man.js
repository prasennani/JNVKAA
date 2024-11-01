
    $( document ).ready(function() {
        CountryCodeList();

        $("#btnsubmit").click(function () {
            //alert($("#txtdob").val());
            if ($("#txtfname").val().length > 0) {
                if ($("#txtsname").val().length > 0) {
                    if ($("#genderselect").val().localeCompare("0") !== 0) {
                        if ($("#txtbatchno").val().length > 0) {
                            //if ($("#txtdob").val().length > 0) {
                                if ($("#txtphone").val().length > 6) {
                                    if ($("#txtemail").val().length > 0) {
                                        if ($("#txtpwd").val().length >= 4) {
                                            if ($("#txtcpwd").val().length >= 4) {
                                                if ($("#txtcpwd").val().localeCompare($("#txtpwd").val()) === 0) {
													if (validatePassword($("#txtpwd").val())) {
														// Display alert message
														//alert("Please wait. Do not refresh or close the tab until next response. Please click ok.");
														// Your existing form validation logic here

														showLoadingSpinner(); // Show loading spinner

														$.ajax({
															url: 'WebService.asmx/newUserRegistrationWeb',
															type: "POST", // type of the data we send (POST/GET)
															contentType: "application/json",
															data: "{ 'name': '" + $("#txtfname").val() + "', 'sname': '" + $("#txtsname").val() + "', 'gender': '" + $("#genderselect").val() + "', 'batchno': '" + $("#txtbatchno").val() + "', 'dob': '" + $("#txtdob").val() + "', 'mobile': '" + $("#txtphone").val() + "', 'email': '" + $("#txtemail").val() + "', 'pwd': '" + $("#txtpwd").val() + "', 'CountryCode': '" + $("#countryList").val() + "'}",
															datatype: "json",
                                                            success: function (response) { // when successfully sent data and returned
                                                                
                                                                alert(response.d);
                                                                window.location.href = '/login.html';
                                                                var res = parseInt(JSON.parse(response.d));
                                                                $scope.$apply();
                                                                
															} // success close
														}).done(function () {
														}).fail(function (XMLHttpRequest, textStatus, errorThrown) {
															alert("Status: " + textStatus + ", Error: " + errorThrown);
														}).always(function () {
														}); // ajax call ends

													}                                           
													
												} else
                                                    alert("Password and Confirm Password should match");
                                            } else
                                                alert("Enter Confirm Password");
                                        } else
                                            alert("Password length should be minimum 4 characters length.");
                                    } else
                                        alert("Enter Email");
                                } else
                                    alert("Please Check the Mobile No.");
                            //} else
                                //alert("Enter DOB");
                        } else
                            alert("Please select Batch No");
                    } else
                        alert("Select Gender");
                } else
                    alert("Enter Surname");
            } else
                alert("Enter First Name");
        });

        $("#chkshowpwd").click(function () {
            if ($("#chkshowpwd").prop('checked') == true)
                $("#txtpwd").attr('type', 'text');
            else
                $("#txtpwd").attr('type', 'password');
        });


    });

    function CountryCodeList() {
        
        $.ajax({
            type: "GET",
            url: "js/CountryCode.xml", // Path to your XML file
            dataType: "xml",
            success: function (xml) {
                // Clear existing options
                $('#countryList').empty();

                // Loop through each country and append its code to the list
                $(xml).find('countries').each(function () {
                    var countryCode = $(this).find('code').text();
                    var countryName = $(this).find('name').text();
                    $('#countryList').append('<option value="' + countryCode + '">' + countryName + '</option>');
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('Error:', errorThrown);
            }
        });
    }


	function showLoadingSpinner() {
		$("#loadingSpinner").show();
	}

	function hideLoadingSpinner() {
		$("#loadingSpinner").hide();
	}

	function validatePassword(password) {
		var passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
		if (!passwordPattern.test(password)) {
			alert("Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character.");
			return false;
		}
		return true;
	}


// Populate dropdown options with numbers from 1 to 30
$(document).ready(function () {
    var select = $('#txtbatchno');
    for (var i = 1; i <= 30; i++) {
        select.append('<option value="' + i + '">' + i + '</option>');
    }
});