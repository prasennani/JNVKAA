var base64String = "";

$(document).ready(function () {
    $("#conditionalSubmit").click(function (event) {
        const name = $("#name").val();
        const mobileno = $("#mobileno").val();
        const email = $("#email").val();
        const batchNo = $("#batchNo").val();
        const donationAmount = $("#donationAmount").val();
        const recurring = $("#recurring").val();
        const paymentMode = $("#paymentMode").val();

        // Basic validations
        if (!name || !mobileno || !email || !batchNo || !donationAmount) {
            alert("All fields are mandatory!");
            return;
        }

        // Condition 1: One-time + UPI
        if (recurring === "1" && paymentMode === "1") {
            submitFormToDatabase();
            generateQRCode();
            $("#qrCodeModal").modal("show");
        }
        // Condition 2: One-time + Others
        else if (recurring === "1" && paymentMode === "2") {
            submitFormToDatabase();
            window.location.href = "https://pages.razorpay.com/pl_PGBArUtHEHaICK/view";
        }
        // Condition 3: Recurring payment
        else if (recurring === "2") {
            submitFormToDatabase();
            $("#thankYouMessage").text(`Thank you ${name}, Please check your email within the next 2-3 hours for the subscription link. We appreciate your support!`);
            $("#thankYouModal").modal("show");
        } else {
            alert("Please select valid options!");
        }
    });

    function submitFormToDatabase() {
        // Send data to the server
        $.ajax({
            url: '../WebService.asmx/Donate',
            type: "POST", // type of the data we send (POST/GET)
            contentType: "application/json",
            data: "{ 'name': '" + $('#name').val() + "', 'mobileNo': '" + $('#mobileno').val() + "', 'email': '" + $('#email').val() + "', 'batchNo': '" + $('#batchNo').val() + "', 'recurring': '" + $('#recurring').val() + "', 'frequency': '" + $('#frequency').val() + "', 'tenure': '" + $('#tenure').val() + "', 'PaymentMode': '" + $('#paymentMode').val() + "', 'DonateAmount': '" + $('#donationAmount').val() + "'}",
            datatype: "json",
            success: function (response) { // when successfully sent data and returned
                // alert("Res: " + response.d);
                switch (parseInt(JSON.parse(response.d))) {
                    case 1:
                        
                        
                        break;
                    case 0:

                        alert("Unable to Donate Now. Try after sometime.");
                        break;

                }

            } // success close
        }).done(function () {
        }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
            //alert("Status: " + textStatus + ", Error: " + errorThrown);
            //alert("Something went wrong. Please contact Admin.");
        }).always(function () {
        }); // ajax call ends

    }

    function generateQRCode() {
        const name = $("#name").val();
        const mobileno = $("#mobileno").val();
        const batchNo = $("#batchNo").val();
        const donationAmount = $("#donationAmount").val();

        const data = `upi://pay?pa=7075341606@ybl&pn=JNVKAA&am=${donationAmount}&tn=${mobileno} ${name} ${batchNo}&cu=INR`;
        const phonepeurl = `phonepe://pay?pa=7075341606@ybl&pn=JNVKAA&am=${donationAmount}&tn=${mobileno} ${name} ${batchNo}&cu=INR`;
        const gpayurl = `gpay://upi/pay?pa=7075341606@ybl&pn=JNVKAA&am=${donationAmount}&tn=${mobileno} ${name} ${batchNo}&cu=INR`;
        const credurl = `credpay://upi/pay?pa=7075341606@ybl&pn=JNVKAA&am=${donationAmount}&tn=${mobileno} ${name} ${batchNo}&cu=INR`;
        const apiURL = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(data)}`;

        document.getElementById('qrCode').src = apiURL;

        // Update href attributes of the buttons
        document.querySelector('a[href="Phonepeurl"]').href = phonepeurl;
        document.querySelector('a[href="Gpayurl"]').href = gpayurl;
        document.querySelector('a[href="Credurl"]').href = credurl;
    }
});





$(document).ready(function () {
    $('#preloader').css('display', 'flex');
    getDonationData();

});


function getDonationData() {
    $.ajax({
        url: "../WebService.asmx/getDonations",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            story = JSON.parse(JSON.parse(response.d));
            if (story[0].title.localeCompare("521") === 0) {
            }
            else if (story[0].title.localeCompare("522") === 0)
                alert("Something went wrong. Please try again.");
            else {

                for (i = 0; i < story.length; i++) {


                    var txt = '  <div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">';
                    txt += '<div class="causes-item d-flex flex-column bg-white border-top border-5 border-primary rounded-top overflow-hidden h-100">';
                    txt += '    <div class="text-center p-4 pt-0">';
                    txt += '      <div class="d-inline-block bg-primary text-white rounded-bottom fs-5 pb-1 px-3 mb-4">';
                    txt += '          <small id="category1">' + story[i].category + '</small>';
                    txt += '       </div>';
                    txt += '      <h5 class="mb-3" id="title1">' + story[i].title + '</h5>';
                    txt += '      <p id="description">' + story[i].description + '</p>';
                    txt += '<a class="btn btn-outline-primary my-2" target="_blank" href="' + story[i].expendLink + '">View Expenditure</a>';
                    txt += '    <div class="causes-progress bg-light p-3 pt-2">';
                    txt += '       <div class="d-flex justify-content-between">';
                    var percentage = (story[i].donateamount / story[i].targetamount) * 100;
                    txt += '            <p class="text-dark" id="targetamount1">₹' + story[i].targetamount + ' <small class="text-body">Goal</small></p>';
                    txt += '        <p class="text-dark">' + story[i].donateamount + ' <small class="text-body">Raised</small></p>';
                    txt += '      </div>';
                    txt += '           <div class="progress">';
                    txt += '                <div class="progress-bar" role="progressbar" aria-valuenow="' + Math.floor(percentage) + '" aria-valuemin="0" aria-valuemax="100">';
                    txt += '            <span>' + Math.floor(percentage) + '%</span>';
                    txt += '                </div> </div> </div> </div>';
                    txt += '    <div class="position-relative mt-auto">';
                    txt += '      <img class="img-fluid" id="photo1" src="' + story[i].photo + '" alt="">';
                    txt += '      <div class="causes-overlay">';
                    txt += '   <a class="btn btn-outline-primary" href="donate.html"> Donate Now <div class="d-inline-flex btn-sm-square bg-primary text-white rounded-circle ms-2"> ';
                    txt += ' <i class="fa fa-arrow-right"></i>';
                    txt += ' </div> </a> </div> </div> </div> </div>';


                    $('#donate-cards-d').append(txt);
                }
                $('#preloader').css('display', 'none');
                //j = i;
            }

        }

    }).done(function () {


    }).fail(function (XMLHttpRequest, status, error) {
        console.log("Status " + status + "Error" + error);
    });

}


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
                                offsetX: 10,
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
                //title: {
                //    text: `Batch-wise and Purpose-wise Donations (Total: ${formattedTotalDonations})`
                //},
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
                        return val.toLocaleString('en-IN');  // Format labels as currency
                    },
                    style: {
                        fontSize: '10px',
                        fontWeight: 'bold',
                        colors: ['#fff']
                    }
                }
            };

            // Render the chart
            var chart = new ApexCharts(document.querySelector("#donationChart2"), options);
            chart.render();

            // Update the heading with the total count
            var heading = document.querySelector(".card-title1");
            heading.innerHTML = "<b>Batch-wise and Purpose-wise Donations (Total: " + formattedTotalDonations + ")</b>";


        },
        error: function (xhr, status, error) {
            console.error("Error fetching donation data: ", error);
        }
    });
});

    //Edit user data and getting data using button 


	function showLoadingSpinner() {
		$("#loadingSpinner").show();
	}

	function hideLoadingSpinner() {
		$("#loadingSpinner").hide();
    }

