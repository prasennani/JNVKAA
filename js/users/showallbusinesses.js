﻿$(document).ready(function () {
    $('#preloader').css('display', 'flex');
    loadCityDropdown();
    showAllBusinesses();
});

function loadCityDropdown() {
    $.ajax({
        url: "../WebService.asmx/getAllBusinessCities",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            let cities = JSON.parse(JSON.parse(response.d));
            cities.forEach(city => {
                $('#cityDropdown').append(`<option value="${city}">${city}</option>`);
            });
        }
    });
}

function filterBusinesses() {
    const city = $('#cityDropdown').val().trim();
    const keywords = $('#ServicesOrProducts').val().trim();

    $('#ShowBusinesses').empty();
    $('#preloader').show();

    $.ajax({
        url: "../WebService.asmx/filterBusinesses",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ city: city, keywords: keywords }),
        dataType: "json",
        success: function (response) {
            const data = JSON.parse(JSON.parse(response.d));
            renderBusinessCards(data);
        },
        error: function () {
            alert("Failed to fetch data");
            $('#preloader').hide();
        }
    });
}

function showAllBusinesses() {
    $.ajax({
        url: "../WebService.asmx/showAllBusinesses",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            const data = JSON.parse(JSON.parse(response.d));
            renderBusinessCards(data);
        },
        error: function () {
            alert("Unable to load businesses");
            $('#preloader').hide();
        }
    });
}

function renderBusinessCards(busyness) {
    $('#ShowBusinesses').empty();
    if (busyness[0].ustatus === "521") {
        $('#ShowBusinesses').append("<p class='text-center mt-4'>No businesses found.</p>");
    } else {
        busyness.forEach(b => {
            const photo = b.bcardphoto && b.bcardphoto.length > 10 ? b.bcardphoto : "../assets/imgs/stories.png";
            const card = `
                <div class="m-5 wow fadeInUp" data-wow-delay="0.1s" style="box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;">
                    <div class="container p-4">
                        <div class="col-md-12">
                            <h2 class="col-md-12 d-flex justify-content-center text-center" style="color:#129298;">${b.bname}</h2>
                        </div>
                        <div class="row">
                            <div class="col-lg-4 col-md-4">
                                <div class="service-item bg-white text-center p-4 col-12">
                                    <img class="img-fluid" style="max-height: 200px;" src="${photo}" alt="Business Card">
                                </div>
                            </div>
                            <div class="col-md-8 ps-2 mt-3">
                                <div class="row">
                                    <div class="col-md-6">
                                        <h5 class="postedby">Posted By: ${b.fname} ${b.sname}</h5>
                                    </div>
                                    <div class="col-md-6">
                                        <h5 class="postedby">Batch No: ${b.batchno}</h5>
                                    </div>
                                    <div class="col-md-6">
                                        <h5 class="postedby">Location: ${b.bcity}</h5>
                                    </div>
                                </div>
                                <p class="description mt-2" style="white-space: pre-line;">${b.bservices}</p>
                                <div class="row mt-3">
                                    <div class="col-md-9"></div>
                                    <div class="col-md-3">
                                        <a class="btn btn-outline-primary" href="viewbusinedd.html?user=${b.bid}">View Business</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
            $('#ShowBusinesses').append(card);
        });
    }
    $('#preloader').hide();
}