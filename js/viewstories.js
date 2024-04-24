var storyid = "";
var searchParams = new URLSearchParams(window.location.search);
var param = searchParams.get('storyid');

$(document).ready(function () {
    storyid = param;
    $('#preloader').css('display', 'flex');
    showUserStory();
});


function showUserStory() {

    $.ajax({
        url: "../WebService.asmx/GetStory",
        type: "POST",
        contentType: "application/json",
        data: "{ 'storyid': '" + storyid + "'}",
        dataType: "json",
        success: function (response) {
            story = JSON.parse(JSON.parse(response.d));

            if (story[0].title.localeCompare("521") === 0) {
                $('#preloader').css('display', 'none');
                alert("No records found");
                
            }
            else if (story[0].title.localeCompare("522") === 0) {
                alert("Something went wrong. Please try again.");
                $('#preloader').css('display', 'none');
            }
            else {
                if (story[0].photo < 10) {
                    $('#photo').attr("src", "../assets/imgs/stories.png");
                } else {
                    $('#photo').attr("src", story[0].photo);
                }

                $('#title').text(story[0].title);
				$('#title2').text(story[0].title);
                $('#postedon').text(story[0].postedon);
                $('#postedby').text(story[0].postedby);
                $('#description1').text(story[0].description1);
                $('#description2').text(story[0].description2);
                $('#description3').text(story[0].description3);








            }
            $('#preloader').css('display', 'none');
        }

    }).done(function () {


    }).fail(function (XMLHttpRequest, status, error) {
        console.log("Status " + status + "Error" + error);
    });
}