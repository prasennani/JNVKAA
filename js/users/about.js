$(document).ready(function () {
    $('#preloader').css('display', 'flex');

    getuser();
    getProfilePic();
    getuserAccessLevel();
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
            $('#puname2').text(user);/*
            var vals = user.split("-");

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
                    getuserDonations();
                    getuser();
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
                //alert("Reached");
                //$('#imgprofile').attr('src', String(response.d).replaceAll('"', ''));
                $('#profileicon').attr('src', String(response.d).replaceAll('"', ''));
                $('#profileicon2').attr('src', String(response.d).replaceAll('"', ''));
                //$("#tarea").val(String(response.d).replaceAll('"', ''));
                $('#preloader').css('display', 'none');
            } else {
                $('#profileicon').attr('src', "/assets/imgs/profile pic.png");
                $('#profileicon2').attr('src', "/assets/imgs/profile pic.png");
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

document.addEventListener("DOMContentLoaded", () => {
    // Fetch data from your C# method using AJAX
    $.ajax({
        url: "../WebService.asmx/getBatchUserData",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            var batchUserData = JSON.parse(JSON.parse(response.d));
            var batchLabels = [];
            var totalUsersData = [];
            var totalDonorsData = [];
            var totalUsersCount = 0; // Variable to store the total count of all batch members
            var totalDonorsCount = 0; // Variable to store the total count of all batch Donors

            batchUserData.forEach(function (data) {
                batchLabels.push(data.BatchId);
                totalUsersData.push(data.TotalUsers);
                totalDonorsData.push(data.DonorsAboveOneRupee);
                totalUsersCount += data.TotalUsers; // Increment the total count
                totalDonorsCount += data.DonorsAboveOneRupee; // Increment the total count
            });

            // Update the chart with dynamic data
            var chart = new ApexCharts(document.querySelector("#barChartBatchUsers"), {
                series: [
                    {
                        name: 'Total Users',
                        data: totalUsersData, // Data for total users
                        color: '#2E8B57' // Color for total users
                    },
                    {
                        name: 'Members Donated (Total:' + totalDonorsCount + ' Members)',
                        data: totalDonorsData, // Data for unique donors
                        color: '#d4526e' // Color for unique donors
                    }
                ],
                chart: {
                    type: 'bar',
                    height: 800
                },
                plotOptions: {
                    bar: {
                        borderRadius: 4,
                        horizontal: true,

                    }
                },
                colors: ['#2E8B57', '#d4526e'], // Colors for each series
                dataLabels: {
                    enabled: true
                },
                xaxis: {
                    categories: batchLabels // Dynamic batch labels
                },
                legend: {
                    position: 'top',
                    horizontalAlign: 'left'
                }
            });
            chart.render();

            // Update the heading with the total count
            var heading = document.querySelector(".card-title");
            heading.innerHTML = "<b>Batch wise Registered Users (Total: " + totalUsersCount + ")</b>";
        },
        error: function (xhr, status, error) {
            console.log("Error: " + error);
        }
    });
});
