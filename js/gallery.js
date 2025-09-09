
var folderid = "";
$(document).ready(function () {
    getAllFolderName();
    
    $('#galleryselect').on('change', function () {
        folderid = $('#galleryselect :selected').val();
        $('#preloader').css('display', 'flex');
        showGalleryImages();


    });

});


function getAllFolderName() {
    $.ajax({
        url: '../WebService.asmx/getFolderNameClass',
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            folderName = JSON.parse(JSON.parse(response.d));
            if (folderName[0].folderid.localeCompare("521") === 0) {
                alert("Gallery Images Not Added");
            }
            else if (folderName[0].folderid.localeCompare("522") === 0)
                alert("Something went wrong. Please try again.");
            else {

                for (i = 0; i < folderName.length; i++) {


                    var txt = '<option value="' + folderName[i].folderid + '">' + folderName[i].foldername + '</option>';



                    $('#galleryselects').append(txt);
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


function showGalleryImages() {
    $('#galleryImages').empty();
    $('#imageGallery').remove();
    // Remove existing elements
    $.ajax({
        url: "../WebService.asmx/showGalleryImages",
        type: "POST",
        contentType: "application/json",
        data: "{'folderid':'" + folderid + "'}",
        dataType: "json",
        success: function (response) {
            //alert(response.d);
            images = JSON.parse(JSON.parse(response.d));
            if (images[0].photo.localeCompare("521") === 0) {
                alert("Image are not added");
                $('#preloader').css('display', 'none');
                
            }
            else if (images[0].photo.localeCompare("522") === 0)
                alert("Something went wrong. Please try again.");
            else {

                for (i = 0; i < images.length; i++) {

                    if (images[i].photo.length > 20) {
                        var image = '<div class="col-lg-4 col-md-6 wow fadeInUp " data-wow-delay="0.1s" id="imageGallery">';
                        image += ' <div class="service-item bg-white text-center h-100 align-items-center ">';
                        image += ' <img class="img-fluid " src="' + images[i].imgUrl + '" alt="">';
                        image += '  </div> </div>';
                    }



                    $('#galleryImagess').append(image);

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


var folderid = "";

$(document).ready(function () {
    getAllFolderName();

    $('#galleryselect').on('change', function () {
        folderid = $('#galleryselect :selected').val();
        $('#preloader').css('display', 'flex');
        showGalleryImages();
    });
});

function getAllFolderName() {
    $.ajax({
        url: '../WebService.asmx/GetGalleryFolders',
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            var folderName = JSON.parse(response.d);
            $('#galleryselect').empty().append('<option value="">-- Select Folder --</option>');

            folderName.forEach(function (f) {
                var txt = '<option value="' + f.folderid + '">' + f.foldername + '</option>';
                $('#galleryselect').append(txt);
            });
        }
    });
}

function showGalleryImages() {
    $('#galleryImages').empty();

    $.ajax({
        url: "../WebService.asmx/GetGalleryImages",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ folderid: folderid }),
        dataType: "json",
        success: function (response) {
            var images = JSON.parse(response.d);

            if (!images || images.length === 0) {
                $('#galleryImages').html('<p class="text-center">No images found.</p>');
                $('#preloader').hide();
                return;
            }

            images.forEach(function (img) {
                var imageHtml = `
          <div class="col-lg-4 col-md-6">
            <div class="service-item bg-white text-center h-100 align-items-center">
              <img src="${img.imgUrl}" 
                   alt="${img.name || ''}" 
                   class="img-fluid"
                   loading="lazy">
            </div>
          </div>`;
                $('#galleryImages').append(imageHtml);
            });

            $('#preloader').hide();
        },
        error: function (err) {
            console.error(err);
            $('#galleryImages').html('<p class="text-center text-danger">Failed to load images.</p>');
            $('#preloader').hide();
        }
    });
}
