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

$(document).ready(function () {
    // Fetch donation summary from the server
    $.ajax({
        url: "../WebService.asmx/GetDonationSummary", // Update this URL based on your service path
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            // Parse the response
            var donationData = JSON.parse(response.d);

            // Prepare data for the chart
            var categories = [];  // Store the batch numbers
            var seriesData = {};  // Store donation amounts grouped by purpose
            var purposeTotals = {};  // Store total donations for each purpose
            var totalDonations = 0; // Variable to store total donations

            // Loop through the donation data and structure it
            donationData.forEach(function (item) {
                // Add batch to categories if not already present
                if (!categories.includes(item.BatchNo)) {
                    categories.push(item.BatchNo);
                }

                // Group donations by purpose
                if (!seriesData[item.DonationPurpose]) {
                    seriesData[item.DonationPurpose] = [];
                    purposeTotals[item.DonationPurpose] = 0;  // Initialize purpose total
                }

                // Initialize array if batch is not present in donation purpose
                if (seriesData[item.DonationPurpose].length > categories.length) {
                    seriesData[item.DonationPurpose] = Array(categories.length).fill(0);
                }

                // Add total amount to corresponding purpose and batch
                var batchIndex = categories.indexOf(item.BatchNo);
                seriesData[item.DonationPurpose][batchIndex] = item.TotalAmount;

                // Add to the total for this purpose and the overall total
                purposeTotals[item.DonationPurpose] += parseFloat(item.TotalAmount);
                totalDonations += parseFloat(item.TotalAmount);
            });

            // Convert the seriesData into format required by ApexCharts, including total per purpose in the name
            var series = [];
            for (var purpose in seriesData) {
                var formattedTotal = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(purposeTotals[purpose]);
                series.push({
                    name: `${purpose} (Total: ${formattedTotal})`,  // Add total donations in the legend
                    data: seriesData[purpose]
                });
            }

            // Adjust the chart height based on the number of categories
            var chartHeight = categories.length * 30; // 30px per category

            // Format overall total donations as currency
            var formattedTotalDonations = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(totalDonations);

            // Build the ApexCharts chart
            var options = {
                series: series,
                chart: {
                    type: 'bar',
                    height: chartHeight,  // Dynamic height
                    stacked: true,
                },
                plotOptions: {
                    bar: {
                        horizontal: true,
                        dataLabels: {
                            total: {
                                enabled: true,
                                offsetX: 5,
                                style: {
                                    fontSize: '13px',
                                    fontWeight: 900
                                }
                            }
                        }
                    },
                },
                stroke: {
                    width: 1,
                    colors: ['#fff']
                },
                title: {
                    text: `Batch-wise and Purpose-wise Donations (Total: ${formattedTotalDonations})`
                },
                xaxis: {
                    categories: categories,
                    labels: {
                        formatter: function (val) {
                            return val;  // No need to append anything to batch number
                        }
                    }
                },
                yaxis: {
                    title: {
                        text: 'Batch Numbers'
                        
                    },
                },
                tooltip: {
                    y: {
                        formatter: function (val) {
                            return "₹" + val.toLocaleString('en-IN');  // Format as currency
                        }
                    }
                },
                fill: {
                    opacity: 1
                },
                legend: {
                    position: 'top',
                    horizontalAlign: 'left',
                    offsetX: 40
                },
                dataLabels: {
                    enabled: true,
                    formatter: function (val) {
                        return "₹" + val.toLocaleString('en-IN');  // Format labels as currency
                    },
                    style: {
                        fontSize: '12px',
                        fontWeight: 'bold',
                        colors: ['#000']
                    }
                }
            };

            // Render the chart
            var chart = new ApexCharts(document.querySelector("#donationChart"), options);
            chart.render();
        },
        error: function (xhr, status, error) {
            console.error("Error fetching donation data: ", error);
        }
    });
});

