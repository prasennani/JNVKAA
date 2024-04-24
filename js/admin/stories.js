$(document).ready(function () {
    var j = 0;
    $('.loader').css('display', 'flex');
    getAllStories();
    $('#storyStatus').on('change', function () {
        $('.loader').css('display', 'flex');
        getStories();
    });

});
/*
function getuserAccessLevel() {
    $.ajax({
        url: "../WebService.asmx/getUserAcessLevel",
        type: "POST",
        contentType: "application/json",
        // data: "{ 'uid': '" + userid + "'}",
        dataType: "json",
        success: function (response) {
            user = response.d;
            switch (parseInt(user) !== 0) {
                case 0:
                    alert("Unauthorized Access. Please Login");
                    window.location = "../login.html";
                    break;
                case 1:
                    getAllStories();
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
*/
function getAllStories() {
    $('.loader').css('display', 'flex');
    $.ajax({
        url: "../WebService.asmx/getAllStories",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            story = JSON.parse(JSON.parse(response.d));
            if (story[0].title.localeCompare("521") === 0) {
                alert("No records found");
                $('.loader').css('display', 'none');
            }
            else if (story[0].title.localeCompare("522") === 0)
                alert("Something went wrong. Please try again.");
            else {

                for (i = 0; i < story.length; i++) {
                    var txt = '<tr><th scope="row">' + (parseInt(i) + 1) + '</th>';
                    txt += '<td>' + story[i].title + '</td>';
                    txt += '<td>' + story[i].postedon + '</td>';
                    txt += '<td>' + story[i].postedby + '</td>';
                    txt += '<td>' + story[i].description1 + '</td>';

                    //alert(user[i].uid
                    txt += '<th><p><a class="link-info link-opacity-50-hover" href="editstories.html?e=' + story[i].storyid + '"> Edit </a></p></th>';
                    $('#stories-table tr:last').after(txt);
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

function getStories() {
    $('.loader').css('display', 'flex');
    $('#stories-table').find("tr:gt(0)").remove();
    $.ajax({
        url: "../WebService.asmx/getallStory",
        type: "POST",
        data: "{ 'storyStatus':'"+$('#storyStatus').val()+"'}",
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            story = JSON.parse(JSON.parse(response.d));
            if (story[0].title.localeCompare("521") === 0) {
                $('.loader').css('display', 'none');
                alert("No records found");
            }
            else if (story[0].title.localeCompare("522") === 0)
                alert("Something went wrong. Please try again.");
            else {

                for (i = 0; i < story.length; i++) {
                    var txt = '<tr><th scope="row">' + (parseInt(i) + 1) + '</th>';
                    txt += '<td>' + story[i].title + '</td>';
                    txt += '<td>' + story[i].postedon + '</td>';
                    txt += '<td>' + story[i].postedby + '</td>';
                    txt += '<td>' + story[i].description1 + '</td>';

                    //alert(user[i].uid
                    txt += '<th><p><a class="link-info link-opacity-50-hover" href="editstories.html?e=' + story[i].storyid + '"> Edit </a></p></th>';
                    $('#stories-table tr:last').after(txt);
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
