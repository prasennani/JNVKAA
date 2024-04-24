$(document).ready(function () {
    var j = 0;
    $('#preloader').css('display', 'flex');
    getAllStories();
   // getProfilePic();
   // getuser();



});


function getAllStories() {
    $.ajax({
        url: "../WebService.asmx/getAllStories",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            story = JSON.parse(JSON.parse(response.d));
            if (story[0].title.localeCompare("521") === 0) {
                $('#preloader').css('display', 'none');
                alert("Stories Not Added");
            }
            else if (story[0].title.localeCompare("522") === 0)
                alert("Something went wrong. Please try again.");
            else {

                for (i = 0; i < story.length; i++) {

                    var storiesCard = '<div class="m-5 " style="box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;">';
                    storiesCard += '<div class="container p-4 ">';


                    storiesCard += '<div class="col-md-12 ">';
                    storiesCard += '<h2 class="col-md-12 d-flex justify-content-center text-center" style="color:#129298;">' + story[i].title + '</h2>';
                    storiesCard += ' </div>';
                    storiesCard += '<div class="row">';
                    storiesCard += '<div class="col-lg-4 col-md-4 wow fadeInUp  " data-wow-delay="0.1s">';
                    storiesCard += '<div class="service-item bg-white text-center p-4 col-12">';
                    if (story[i].photo < 10) {
                        storiesCard += '<img class="img-fluid " style="max-height: 200px;" src="../assets/imgs/stories.png" id="Img1" alt="Preview Image">';
                    }
                    else {
                        storiesCard += '<img class="img-fluid " style="max-height: 200px;" src="' + story[i].photo + '" id="Img1" alt="Preview Image">';
                    }
                    storiesCard += ' </div>';
                    storiesCard += '</div>';

                    storiesCard += ' <div class="col-md-8 wow fadeInUp ps-2 mt-3" data-wow-delay="0.1s">';

                    storiesCard += ' <div class=" row col-md-12">';

                    storiesCard += '  <div class="row col-md-6">';
                    storiesCard += '  <h3 class="postedby">Posted On:&nbsp; ' + story[i].postedon + '</h3>';
                    storiesCard += ' </div>';

                    storiesCard += '  <div class="row col-md-6">';
                    storiesCard += '  <h3 class="postedby">Posted By:&nbsp; ' + story[i].postedby + '</h3>';
                    storiesCard += ' </div></div>';
                    storiesCard += ' <div class="row col-md-12 mt-3 ">';
                    storiesCard += ' <p id="P1" class="description">' + story[i].description1 + '</p>';


                    storiesCard += '   <div class=" row mt-3">';
                    storiesCard += '<div class="col-md-9">';
                    storiesCard += '  </div>';
                    storiesCard += ' <div class="col-md-3">';

                    storiesCard += '  <a class="btn btn-outline-primary" href="readstory.html?storyid=' + story[i].storyid + '">Read More</a>'
                    storiesCard += '</div> </div> </div> </div> </div> </div></div>';



                    $('#Stories').append(storiesCard);
                }
                $('#preloader').css('display', 'none');
                //j = i;
            }

        }

    }).done(function () {


    }).fail(function (XMLHttpRequest, status, error) {
        console.log("Status " + status + "Error" + error);
    });


    //Edit user data and getting data using button 




}