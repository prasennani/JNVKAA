var DonationId ="";
var payId="";

$(document).ready(function () {
    
    $('.loader').css('display', 'flex');
    var searchdata = new URLSearchParams(window.location.search);
    var param = searchdata.get('e');
    DonationId = param;
    
    
    $('#changeDonation').click(function () {
        changeDonationPurposeStatus();
    });

    getDonationDetails(DonationId);
    getDonationValues();
    //getuserAccessLevel();

    $('#SaveData').click(function(){
        changeStatus();
    });



});


function getDonationDetails() {
    $('.loader').css('display', 'flex');
    
    $.ajax({
        url: "../WebService.asmx/getDonationDetails",
        type: "POST",
        contentType: "application/json",
        data: "{ 'DonationId': '" + DonationId + "'}",
        datatype: "json",
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
                    $('#donateTitle').text(getDonations[0].title);
                    $('#donateCategory').text(getDonations[0].category);
                    $('#collAmount').text(getDonations[0].totalAmount);
                    $('#totalAmount').text(getDonations[0].targetAmount);
                    $('#donateDesc').text(getDonations[0].description);
                    $('#DoanteStatus').val(getDonations[0].donationStatus);
                    
                    
                    $('#donateImage').attr('src', String(getDonations[0].photo).replaceAll('"', ''));

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

function getDonationValues() {
    $('#donationList').find("tr:gt(0)").remove();
    
    $('.loader').css('display', 'flex');
    
    $.ajax({
        url: "../WebService.asmx/getDonationList",
        type: "POST",
        contentType: "application/json",
        data: "{ 'PurposeId': '" + DonationId + "'}",
        datatype: "json",
        success: function (response) {
            
            donateData = JSON.parse(JSON.parse(response.d));
            
            if (donateData[0].name.localeCompare("521") === 0) {
                alert("No records found");
                $('.loader').css('display', 'none');
            }
            else if (donateData[0].name.localeCompare("522") === 0)
                alert("Something went wrong. Please try again.");
            else {

                for (i = 0; i < donateData.length; i++) {
                    var txt = '<tr><th scope="row">' + (parseInt(i) + 1) + '</th>';
                    txt += '<td>' + donateData[i].name + '</td>';
                    txt += '<td>' + donateData[i].email + '</td>';
                    txt += '<td>' + donateData[i].DonationAmount + '</td>';
                    if(donateData[i].PaymentMode ==="1"){
                        txt += '<td>Account Transfer</td>';
                    }
                    else if(donateData[i].PaymentMode==="2"){
                        txt += '<td>Phonepay QRCode</td>';

                    }
                    else if(donateData[i].PaymentMode==="3"){
                        txt += '<td>SBI CollectLink</td>';
                    }
                    else if(donateData[i].PaymentMode==="4"){
                        txt += '<td>Razor Pay</td>';

                    }
                    else if(donateData[i].PaymentMode==="5"){
                        txt += '<td>PhonePay App</td>';

                    }

                    if(donateData[i].payStatus==="0"){
                        txt += '<td style="color:red">Process</td>';
                    }
                    else if (donateData[i].payStatus === "2") {
                        txt += '<td style="color:red">Failed</td>';
                    }
                    else if (donateData[i].payStatus === "1") {
                        txt += '<td style="color:greeen">Success</td>';
                    }

                    //alert(user[i].uid
                    txt += '<th><p><button class="btn btn-primary" id="changeStatus" onclick="PaymentDataStatus(\'' + donateData[i].name + '\',\'' + donateData[i].email + '\',\'' + donateData[i].mobileNo + '\',\'' + donateData[i].batchNo + '\',\'' + donateData[i].PaymentMode + '\',\'' + donateData[i].payStatus + '\',\'' + donateData[i].paymentSS + '\',\'' + donateData[i].DonationAmount + '\',\'' + donateData[i].RefNo + '\',\'' + donateData[i].donationId + '\')" > Edit </button></p></th>';
                    $('#donationList tr:last').after(txt);
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


// Your existing code here...

function PaymentDataStatus(name,email,mobile,batch,paymode,paystatus,photo,amount,refno,paymentId) {
    
    payId=paymentId

    // Show the modal when the "Edit" link is clicked
    $(document).on("click", "#changeStatus", function() {
        showModal();
    });

    $('.closeModal').click(function(){
        hideModal();
    });
    
    $('#PayImage').attr('src', String(photo).replaceAll('"', ''));
    $('#payName').val(name);
    $('#payEmail').val(email);
    $('#payMobile').val(mobile);
    $('#payBatch').val(batch);
    if(paymode ==="1"){

        $('#payMode').val("Account Transfer");
    }
    else if(paymode==="2"){

        $('#payMode').val("Phonepay QRCode");

    }
    else if(paymode==="3"){

        $('#payMode').val("SBI CollectLink");
    }
    else if(paymode==="4"){
        $('#payMode').val("Razor Pay");



    }
    else if(paymode==="5"){
        $('#payMode').val("PhonePay App");


    }

    
    $('#payStatus').val(paystatus);
    $('#payAmount').val(amount);
    $('#payRef').val(refno);
    console.log(payId);
    
    // Here you can perform operations with the donation data
    // For example, you can access properties like donationData.name, donationData.email, etc.
    // Use index to identify which donation data you are working with
}

function changeStatus() {

    
        
            $.ajax({
                url: '../WebService.asmx/updatePayStatus',
                type: "POST", // type of the data we send (POST/GET)
                contentType: "application/json",
                data: "{ 'payId': '" + payId + "', 'PayStatus': '" + $('#payStatus').val() + "'}",
                datatype: "json",
                success: function (response) { // when successfully sent data and returned
                    //    alert("Res: " + response.d);
                    switch (parseInt(JSON.parse(response.d))) {
                        case 1:
                            hideModal();
                            alert("Pay Status Changed");
                            getDonationValues();
                            
                            break;
                        case 0:
                            alert("Unable to update Payment Status. Try after sometime.");
                            break;

                    }

                } // success close
            }).done(function () {
            }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
                alert("Status: " + textStatus + ", Error: " + errorThrown);
                //alert("Something went wrong. Please contact Admin.");
            }).always(function () {
            }); // ajax call ends
        
    
}

// Your existing code here...


function showModal() {
    $("#paymentStatus").modal('show');
}

// Function to hide the modal
function hideModal() {
    $("#paymentStatus").modal('hide');

    
}

function changeDonationPurposeStatus() {
    $.ajax({
        url: '../WebService.asmx/updateDonationPurposeStatus',
        type: "POST", // type of the data we send (POST/GET)
        contentType: "application/json",
        data: "{ 'DonationPurposeId': '" + DonationId + "', 'donateStatus': '" + $('#DoanteStatus').val() + "'}",
        datatype: "json",
        success: function (response) { // when successfully sent data and returned
            //  alert("Res: " + response.d);
            switch (parseInt(JSON.parse(response.d))) {
                case 1:
                    hideModal();
                    alert("Donation Status Changed Successfully");


                    break;
                case 0:
                    alert("Unable to update Password. Try after sometime.");
                    break;

            }

        } // success close
    }).done(function () {
    }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
        alert("Status: " + textStatus + ", Error: " + errorThrown);
        //alert("Something went wrong. Please contact Admin.");
    }).always(function () {
    }); // ajax call ends
}