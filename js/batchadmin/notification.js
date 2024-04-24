$(document).ready(function () {
    $('#preloader').css('display', 'flex');
    //    getuserAccessLevel();
    $('#notifications').text('0');

    showBatchNotification();
    
});

function showBatchNotification() {
    $.ajax({
        url: "../WebService.asmx/getCountofBatchUser",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            //  alert(response.d);
            user = JSON.parse(JSON.parse(response.d));
            if (user[0].count.localeCompare("521") === 0) {
                $('#notifications').text("0");
                $('#preloader').css('display', 'none');
            }
            else if (user[0].count.localeCompare("522") === 0)
                alert("Something went wrong. Please try again.");
            else {
                $('#notifications').text(user[0].pending);

                $('#preloader').css('display', 'none');




            }
        }

    }).done(function () {


    }).fail(function (XMLHttpRequest, status, error) {
        console.log("Status " + status + "Error" + error);
    });
}