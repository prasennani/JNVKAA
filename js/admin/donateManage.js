$(document).ready(function () {
    var j = 0;
    $('.loader').css('display', 'flex');

    getAllDonations();

    //getuserAccessLevel();

    



});


function getAllDonations() {
    $('.loader').css('display', 'flex');
    $('#eventTable').find("tr:gt(0)").remove();
    $.ajax({
        url: "../WebService.asmx/getDonationPurpose",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            
            getDonations = JSON.parse(JSON.parse(response.d));
            if (getDonations[0].title.localeCompare("521") === 0) {
                alert("No records found");
                $('.loader').css('display', 'none');
            }
            else if (getDonations[0].title.localeCompare("522") === 0)
                alert("Something went wrong. Please try again.");
            else {

                for (i = 0; i < getDonations.length; i++) {
                    var txt = '<tr><th scope="row">' + (parseInt(i) + 1) + '</th>';
                    txt += '<td>' + getDonations[i].title + '</td>';
                    
                    
                    txt += '<td>' + getDonations[i].totalAmount + '</td>';
                    txt += '<td>' + getDonations[i].targetAmount + '</td>';

                    //alert(user[i].uid
                    txt += '<th><p><a class="link-info link-opacity-50-hover" href="viewdonation.html?e=' + getDonations[i].donationId + '"> View </a></p></th>';
                    txt += '<th><p><a class="link-info link-opacity-50-hover" href="editDonation.html?e=' + getDonations[i].donationId + '"> Edit </a></p></th>';

                    $('#donationsPurposeTable tr:last').after(txt);
                }
                $('.loader').css('display', 'none');
                //j = i;
            }

        }

    }).done(function () {


    }).fail(function (XMLHttpRequest, status, error) {
        console.log("Status " + status + "Error" + error);
    });


    //Edit user data and getting data using button 

}