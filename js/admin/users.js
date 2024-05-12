var selectUser = "";
var batchno = "";
var calldispo = "";

$(document).ready(function () {
    $('.loader').css('display', 'flex');
    var j = 0;
    getAllUser();
    getBatches();
    

    $('#user-head').on('click', '#editUser', function () {
        
        var col_num = $(this).children().index($(this));
        getUserData();
        
    });
    $('#selectUser').on('change', function () {
        
        getUser();

    });
    $('#selectbatch').on('change', function () {
        batchno = $('#selectbatch').val();
        $('.loader').css('display', 'flex');
        getUser();

    });
    $('#selectDispo').on('change', function () {
        batchno = $('#selectbatch').val();
        calldispo = $('#selectDispo').val();
        $('.loader').css('display', 'flex');
        getUser();

    });
    
});

function getAllUser() {
    $('.loader').css('display','flex');
    $('#usertable tbody').empty();
    $.ajax({
        url: "../WebService.asmx/getAllusers",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        data: "{'utype': '2','batchNo':'0','calldispo':'-1'}",
        success: function (response) {
           // alert(response.d);
            user = JSON.parse(JSON.parse(response.d));
            if (user[0].ustatus.localeCompare("521") === 0) {
                alert("No records found");
                $('.loader').css('display', 'none');
            }
            else if (user[0].ustatus.localeCompare("522") === 0)
                alert("Something went wrong. Please try again.");
            else {

                for (i = 0; i < user.length; i++) {
                    var txt = '<tr><th scope="row">' + (parseInt(i) + 1) + '</th>';
                    switch (parseInt(user[i].callDispo)) {
                        case 0:
                            txt += '<td> <div class="approved"> Un Answered </div></td>';
                            break;
                        case 1:
                            txt += '<td> <div class="approved"> User will update </div></td>';
                            break;
                        case 2:
                            txt += '<td> <div class="approved"> Admin will update </div></td>';
                            break;
                        case 3:
                            txt += '<td> <div class="blocked"> Call Back </div></td>';
                            break;
                        default:
                            txt += '<td> <div class="pending"> Undailed </div></td>';
                            break;
                    }
                    txt += '<td>' + user[i].fname +" "+ user[i].sname + '</td>';
                    txt += '<td>' + user[i].batchno + '</td>';
                    txt += '<td><a href="tel:' + user[i].country_code + user[i].uphno + '">' + user[i].country_code + user[i].uphno + '</a></td>';
                    txt += '<th><a class="link-info link-opacity-50-hover" target="_blank" href="https://wa.me/' + user[i].country_code + user[i].uphno + '"> WA </a></th>';
                    switch (parseInt(user[i].ustatus)) {
                        case -2:
                            txt += '<td> <div class="pending"> P </div></td>';
                            break;
                        case -1:
                            txt += '<td> <div class="pending"> P </div></td>';
                            break;
                        case 1:
                            txt += '<td> <div class="approved"> A </div></td>';
                            break;
                        case 0:
                            txt += '<td> <div class="blocked"> B </div></td>';
                            break;
                    }
                    //alert(user[i].uid);
                    txt += '<th><a class="link-info link-opacity-50-hover" id="editUser" href="editusers.html?e=' + user[i].uid + '"> Edit </a></th>';
                    $('#usertable tr:last').after(txt);
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

function getUser() {
    $('.loader').css('display', 'flex');
    //$('#usertable').remove();
    //$("#usertable tbody").empty();
    $('#usertable').find("tr:gt(0)").remove();

    $.ajax({
        url: "../WebService.asmx/getAllusers",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        data: "{'utype': '" + $('#selectUser').val() + "','calldispo': '" + $('#selectDispo').val() + "','batchNo':'" + $('#selectbatch').val() + "'}",
        success: function (response) {
          //  alert(response.d);
            user = JSON.parse(JSON.parse(response.d));

            if (user[0].ustatus.localeCompare("521") === 0) {
                $('.loader').css('display', 'none');
                alert("No records found");
            }
            else if (user[0].ustatus.localeCompare("522") === 0)
                alert("Something went wrong. Please try again.");
            else {

                for (i = 0; i < user.length; i++) {
                    var txt = '<tr><th scope="row">' + (parseInt(i) + 1) + '</th>';
                    switch (parseInt(user[i].callDispo)) {
                        case 0:
                            txt += '<td> <div class="approved"> Un Answered </div></td>';
                            break;
                        case 1:
                            txt += '<td> <div class="approved"> User will update </div></td>';
                            break;
                        case 2:
                            txt += '<td> <div class="approved"> Admin will update </div></td>';
                            break;
                        case 3:
                            txt += '<td> <div class="blocked"> Call Back </div></td>';
                            break;
                        default:
                            txt += '<td> <div class="pending"> Undailed </div></td>';
                            break;
                    }
                    txt += '<td>' + user[i].fname + " " + user[i].sname + '</td>';
                    txt += '<td>' + user[i].batchno + '</td>';
                    txt += '<td><a href="tel:' + user[i].country_code + user[i].uphno + '">' + user[i].country_code + user[i].uphno + '</a></td>';
                    txt += '<th><a class="link-info link-opacity-50-hover" target="_blank" href="https://wa.me/' + user[i].country_code + user[i].uphno + '"> WA </a></th>';
                    switch (parseInt(user[i].ustatus)) {
                        case -2:
                            txt += '<td> <div class="pending"> P </div></td>';
                            break;
                        case -1:
                            txt += '<td> <div class="pending"> P </div></td>';
                            break;
                        case 1:
                            txt += '<td> <div class="approved"> A </div></td>';
                            break;
                        case 0:
                            txt += '<td> <div class="blocked"> B </div></td>';
                            break;
                    }
                    //alert(user[i].uid);
                    txt += '<th><a class="link-info link-opacity-50-hover" id="editUser" href="editusers.html?e=' + user[i].uid + '"> Edit </a></th>';
                    $('#usertable tr:last').after(txt);
                }
                $('.loader').css('display', 'none');
                //j = i;
            }

        }

    }).done(function () {


    }).fail(function (XMLHttpRequest, status, error) {
        console.log("Status " + status + "Error" + error);
    });
    

}

function getBatches() {
    
    $.ajax({
        url: "../WebService.asmx/batchnumber",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        data: "{'utype': '" + selectUser + "'}",
        success: function (response) {
            //  alert(response.d);
            user = JSON.parse(JSON.parse(response.d));

            if (user[0].batchno.localeCompare("521") === 0)
                alert("No records found");
            else if (user[0].batchno.localeCompare("522") === 0)
                alert("Something went wrong. Please try again.");
            else {

                for (i = 0; i < user.length; i++) {
                    var txt = '<option value="' + user[i].batchno + '">Batch No:' + user[i].batchno + '</option>';
                    $('#selectbatch').append(txt);
                }
                //j = i;
            }

        }

    }).done(function () {


    }).fail(function (XMLHttpRequest, status, error) {
        console.log("Status " + status + "Error" + error);
    });


    //Edit user data and getting data using button 




}