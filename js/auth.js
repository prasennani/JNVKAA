$(document).ready(function () {
    
    
    $("#chkshowpwd").click(function () {
        if ($("#chkshowpwd").prop('checked') == true)
            $("#txtpwd").attr('type', 'text');
        else
            $("#txtpwd").attr('type', 'password');
    });

    $(document).keypress(function (e) {
        if (e.which == 13) {
            login();
        }
    });
    $("#btnlogin").click(function () {
        login();
    });//end of btn login

});
function login() {
    if ($("#txtmobile").val().length > 0) {
        if ($("#txtpwd").val().length > 0) {

            showLoadingSpinner(); // Show loading spinner

            const client = getClientDetails();

            $.ajax({
                url: 'WebService.asmx/authenticateUser',
                type: "POST", // type of the data we send (POST/GET)
                contentType: "application/json",
                //data: "{ 'ph': '" + $("#txtmobile").val() + "', 'pwd': '" + $("#txtpwd").val() + "'}",
                data: JSON.stringify({
                    ph: $("#txtmobile").val(),
                    pwd: $("#txtpwd").val(),
                    device: client.device,
                    browser: client.browser,
                    network: client.network
                }),
                //datatype: "json",
                success: function (response) {
                    var res = JSON.parse(JSON.parse(response.d));
                    if (res[0].ustatus.localeCompare("1") === 0) {
                        var totalDonationAmount = parseFloat(res[0].DonatedValue);

                        if (totalDonationAmount >= 1000) {
                            window.location = "users/settings.html";
                        } else {
                            //window.location = "FR/settings.html";
                            window.location = "users/settings.html";
                        }
                    }
                    else {
                        switch (parseInt(res[0].ustatus)) {
                            case 0:
                                alert("Your account is blocked. Please contact admin");
                                location.reload();
                                break;
                            case -1:
                                alert("Your account is waiting for approval");
                                location.reload();
                                break;
                            case -2:
                                alert("Your account is waiting for approval by Batch admin");
                                location.reload();
                                break;
                            case 521:
                                alert("Invalid Mobile No/Password");
                                location.reload();
                                break;
                            case 522:
                                alert("Something went wrong. Please try after sometime.");
                                location.reload();
                                break;
                            case 523:
                                alert("Invalid Username/Password and Password is Case-Sensitive");
                                location.reload();
                                break;
                        }
                    }
                }
            }).done(function () {
            }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
                alert("Status: " + textStatus + ", Error: " + errorThrown);
            }).always(function () {
                hideLoadingSpinner(); // Hide loading spinner after response
            });
        } else {
            alert("Enter Password");
        }
    } else {
        alert("Enter Mobile Number");
    }
}

function showLoadingSpinner() {
    $("#loadingSpinner").show();
}

function hideLoadingSpinner() {
    $("#loadingSpinner").hide();
}

function getClientDetails() {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const browser = (() => {
        if (userAgent.includes("Chrome")) return "Chrome";
        if (userAgent.includes("Firefox")) return "Firefox";
        if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) return "Safari";
        if (userAgent.includes("Edge")) return "Edge";
        if (userAgent.includes("OPR")) return "Opera";
        return "Unknown";
    })();

    const network = navigator.connection?.effectiveType || "unknown";

    return {
        device: platform,
        browser: browser,
        network: network
    };
}

