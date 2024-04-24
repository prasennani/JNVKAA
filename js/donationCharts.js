var DonationBatchData = [];
var DonationPurposeData = [];

DonationBatchData.push(["Batchs", "Donation Amount"]);
DonationPurposeData.push(["Donation Purpose", "Donation Amount"]);

$(document).ready(function () {
    // Load Google Charts library
    google.charts.load('current', { 'packages': ['bar'] });
    // Call getAllDonations after Google Charts library is loaded
   google.charts.setOnLoadCallback(getAllDonations);
});

function getAllDonations() {
    // Call both AJAX functions to fetch data
    showPurposeDonations();
    showBatchUserData();
}



function showPurposeDonations() {
    $.ajax({
        url: "../WebService.asmx/getDonationPurposeData",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            var DoneData = JSON.parse(JSON.parse(response.d));
            if (DoneData[0].BatchId === "521") {
                alert("No records found");
            } else if (DoneData[0].BatchId === "520") {
                window.location = "../login.html";
            } else {
                for (var i = 0; i < DoneData.length; i++) {
                    DonationPurposeData.push([DoneData[i].BatchId || 'Others', DoneData[i].TotalDonationAmount]);
                }
                // After data is fetched, draw the chart
                alert("f got");
                drawDonationPurposeChart();
            }
        },
        error: function (xhr, status, error) {
            console.log("Status " + status + " Error: " + error);
        }
    });
}


function getAllDonations() {
    $('#donationPersonList').find("tr:gt(0)").remove();
    $.ajax({
        url: "../WebService.asmx/getDonationPersonList",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            getDonations = JSON.parse(JSON.parse(response.d));
            if (getDonations[0].name.localeCompare("521") === 0) {
                alert("No records found");
                $('.loader').css('display', 'none');
            } else if (getDonations[0].name.localeCompare("522") === 0) {
                alert("Something went wrong. Please try again.");
            } else {
                // Sort donations by date in descending order
                getDonations.sort(function (a, b) {
                    return new Date(b.datee) - new Date(a.datee);
                });

                for (i = 0; i < getDonations.length; i++) {
                    var txt = '<tr><th scope="row">' + (parseInt(i) + 1) + '</th>';
                    txt += '<td>' + getDonations[i].datee + '</td>';
                    txt += '<td>' + getDonations[i].batchNo + '</td>';
                    txt += '<td>*****</td>';
                    if (getDonations[i].PaymentMode === "1") {
                        txt += '<td>Account Transfer</td>';
                    } else if (getDonations[i].PaymentMode === "2") {
                        txt += '<td>Phonepay QRCode</td>';
                    } else if (getDonations[i].PaymentMode === "3") {
                        txt += '<td>SBI CollectLink</td>';
                    } else if (getDonations[i].PaymentMode === "4") {
                        txt += '<td>Razor Pay</td>';
                    } else if (getDonations[i].PaymentMode === "5") {
                        txt += '<td>PhonePay App</td>';
                    }
                    txt += '<td>' + getDonations[i].DonationAmount + '</td>';
                    $('#donationPersonList').prepend('<tr>' + txt + '</tr>');
                }
                $('.loader').css('display', 'none');
            }
        },
        error: function (xhr, status, error) {
            console.log("Status " + status + "Error" + error);
        }
    });
}




    document.addEventListener("DOMContentLoaded", () => {
        showDonationPurposeData();
    });

    function showDonationPurposeData() {
        $.ajax({
            url: "../WebService.asmx/getDonationPurposeData",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            success: function (response) {
                var purposeData = JSON.parse(JSON.parse(response.d));

                // Extract purpose names and total donation amounts from purposeData
                var purposes = [];
                var totalDonations = [];
                purposeData.forEach(function (purpose) {
                    purposes.push(purpose.BatchId);
                    totalDonations.push(parseInt(purpose.TotalDonationAmount));
                });

                // Update the chart with dynamic data
                var chart = new Chart(document.querySelector('#DonationsBarChart'), {
                    type: 'bar',
                    data: {
                        labels: purposes, // Replace static data with dynamic purpose names
                        datasets: [{
                            label: 'Purpose of Donation',
                            data: totalDonations, // Replace static data with dynamic total donation amounts
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(54, 162, 235, 0.2)'
                            ],
                            borderColor: [
                                'rgb(255, 99, 132)',
                                'rgb(75, 192, 192)',
                                'rgb(54, 162, 235)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: 'AMOUNT'
                                }
                            }
                        }
                    }
                });
            },
            error: function (xhr, status, error) {
                console.log("Error: " + error);
            }
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

                batchUserData.forEach(function (data) {
                    batchLabels.push(data.BatchId);
                    totalUsersData.push(data.TotalUsers);
                });

                // Update the chart with dynamic data
                var chart = new ApexCharts(document.querySelector("#barChartBatchUsers"), {
                    series: [{
                        data: totalUsersData // Replace static data with dynamic total users data
                    }],
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
                    colors: ['#2E8B57', '#546E7A', '#d4526e', '#13d8aa', '#2b908f', '#f9a3a4', '#90ee7e',
                        '#f48024', '#69d2e7'
                    ],
                    dataLabels: {
                        enabled: true
                    },
                    xaxis: {
                        categories: batchLabels // Replace static data with dynamic batch labels
                    }

                });
                chart.render();
            },
            error: function (xhr, status, error) {
                console.log("Error: " + error);
            }
        });
    });



document.addEventListener("DOMContentLoaded", () => {
    // Fetch data from your C# method using AJAX
    $.ajax({
        url: "../WebService.asmx/getDonationBatchData",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            var batchData = JSON.parse(JSON.parse(response.d));

            // Extract batch numbers and total donation amounts from batchData
            var batches = [];
            var donations = [];
            batchData.forEach(function (batch) {
                batches.push(batch.BatchId);
                donations.push(parseInt(batch.TotalDonationAmount));
            });

            // Update the chart with dynamic data
            var chart = new ApexCharts(document.querySelector("#BatchwiseDonation"), {
                series: [{
                    data: donations // Replace static data with dynamic total users data
                }],
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
                colors: ['#f48024', '#546E7A', '#d4526e', '#13d8aa', '#2b908f', '#f9a3a4', '#90ee7e',
                    '#f48024', '#69d2e7'
                ],
                dataLabels: {
                    enabled: true

                },
                xaxis: {
                    categories: batches // Replace static data with dynamic batch labels
                }

            });
            chart.render();
        },
        error: function (xhr, status, error) {
            console.log("Error: " + error);
        }
    });
});

