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

