
  /*  $scope.auth = function () {
        //$window.location = "office/admin/db";
        //alert("Fun called");
        if ($("#txtuname").val().length > 2) {
            if ($("#txtpwd").val().length > 2) {
                $.ajax({
                    url: '../WebService.asmx/authenticateStaff',
                    type: "POST", // type of the data we send (POST/GET)
                    contentType: "application/json",
                    data: "{ 'uname': '" + $("#txtuname").val() + "', 'pwd': '" + $("#txtpwd").val() + "' }",
                    datatype: "json",
                    success: function (response) { // when successfully sent data and returned
                        //alert("Res: " + JSON.parse(response.d));
                        $scope.userList = JSON.parse(JSON.parse(response.d));
                        if ($scope.userList.length > 0) {
                            if ($scope.userList[0].uid.localeCompare("0") === 0 || $scope.userList[0].uid.localeCompare("-1") === 0) {
                                alert("Invalid Credentials");
                            } else {
                                switch (parseInt($scope.userList[0].desiglevel)) {
                                    case 1:
                                        $window.location = "office/admin/db";
                                        break;
                                    case 2:
                                        // seekApproval(2);
                                        $window.location = "office/manager/db";
                                        break;
                                    case 3:
                                        $window.location = "office/hr/db";
                                        break;
                                    case 4:
                                        seekApproval(4,$scope.userList[0].loginid);
                                        //$window.location = "office/hod/db";
                                        break;
                                    case 5:
                                        //alert("Reached 5");
                                        //$window.location = "office/staff/db";
                                        seekApproval(5,$scope.userList[0].loginid);
                                        break;
                                    case 6:
                                        seekApproval(6,$scope.userList[0].loginid);
                                        break;
                                }
                            }
                        }
                        $scope.$apply();
                    } // success close
                }).done(function () {
                }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
                    alert("Status: " + textStatus + ", Error: " + errorThrown);
                }).always(function () {
                }); // ajax call ends
            } else
                alert("Enter Password");
        } else
            alert("Enter User Id");
    }

    seekApproval = function (desig,logid) {
        modal.style.display = "block";
                
        const checkStatus = setInterval(function() {
            $.ajax({
                url: '../WebService.asmx/seekApproval',
                type: "POST", // type of the data we send (POST/GET)
                contentType: "application/json",
                data: "{ 'id': '" + logid + "' }",
                datatype: "json",
                success: function (response) { // when successfully sent data and returned
                    //alert("Res: " + JSON.parse(response.d));
                    var res = parseInt(JSON.parse(response.d));
                    if(res===2){
                        switch (desig) {
                            case 4:
                                clearInterval(checkStatus);
                                $window.location = "office/hod/db";
                                break;
                            case 5:
                                //alert("Reached 5");
                                clearInterval(checkStatus);
                                $window.location = "office/staff/db";
                                break;
                            case 6:
                                clearInterval(checkStatus);
                                $window.location = "office/fe/db";
                                break;
                        }
                        $scope.$apply();
                    }else if(res===3){
                        alert("Your login request is rejected by HR.");
                        clearInterval(checkStatus);
                        modal.style.display = "none";
                    }else if(res===0){
                        alert("Your login request is Expired. Please Try Again.");
                        modal.style.display = "none";
                    }

                } // success close
            }).done(function () {
            }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
                alert("Status: " + textStatus + ", Error: " + errorThrown);
            }).always(function () {
            }); // ajax call ends
        }, 5000);
                

    }
*/
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