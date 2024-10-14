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
            var totalUsersCount = 0; // Variable to store the total count of all batch members

            batchUserData.forEach(function (data) {
                batchLabels.push(data.BatchId);
                totalUsersData.push(data.TotalUsers);
                totalUsersCount += data.TotalUsers; // Increment the total count
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

            // Update the heading with the total count
            var heading = document.querySelector(".card-title");
            heading.innerHTML = "<b>Batch wise Registered Users (Total: " + totalUsersCount + ")</b>";
        },
        error: function (xhr, status, error) {
            console.log("Error: " + error);
        }
    });
});

