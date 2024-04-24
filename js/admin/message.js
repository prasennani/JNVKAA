$(document).ready(function () {
    $('#selectMsg').on('change', function () {
        getAllMessages();
    });
    $('#preloader').css('display', 'flex');
    getAllMessages();
    getProfilePic();
    
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
                    getAllMessages();
                    getProfilePic();
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
function delMsg(msgid) {
    if (confirm("Sure,Want to Delete this Message") == true) {
        $('#preloader').css('display', 'flex');
        $.ajax({
            url: "../WebService.asmx/delMessage",
            type: "POST",
            contentType: "application/json",
            data: "{'msgid':'" + msgid + "'}",
            dataType: "json",
            success: function (response) {

                event = JSON.parse(JSON.parse(response.d));

                if (parseInt(event) == "1") {
                    alert("Message Deleted");
                    $('#msg-table tr').empty();
                    getAllMessages();
                }


            }

        }).done(function () {


        }).fail(function (XMLHttpRequest, status, error) {
            console.log("Status " + status + "Error" + error);
        });


        //Edit user data and getting data using button 

    }


}

function seenStatus(msgid) {
    

        $.ajax({
            url: "../WebService.asmx/updateMsgStatus",
            type: "POST",
            contentType: "application/json",
            data: "{'msgid':'" + msgid + "'}",
            dataType: "json",
            success: function (response) {
                
                event = JSON.parse(JSON.parse(response.d));
                if(parseInt(event)==1){
                    //alert("Message Seen");
                    getAllMessages();
                }
                else if (parseInt(event) == 0) {
                    alert("Already Seen Message");
                }


                

            }

        }).done(function () {


        }).fail(function (XMLHttpRequest, status, error) {
            console.log("Status " + status + "Error" + error);
        });


        //Edit user data and getting data using button 

    }




function getAllMessages() {
    $('#msg-table tr').empty();
    $.ajax({
        url: "../WebService.asmx/GetMessages",
        type: "POST",
        contentType: "application/json",
        data: "{'seenstatus':'" + $('#selectMsg').val()+ "'}",
        dataType: "json",
        success: function (response) {
            event = JSON.parse(JSON.parse(response.d));
            if (event[0].msgid.localeCompare("521") === 0) {
                alert("No records found");
                $('#preloader').css('display', 'none');
            }
            else if (event[0].msgid.localeCompare("522") === 0)
                alert("Something went wrong. Please try again.");
            else {

                for (i = 0; i < event.length; i++) {
                    var txt = '<tr><th scope="row">' + (parseInt(i) + 1) + '</th>';
                    txt += '<td>' + event[i].uname + '</td>';
                    txt += '<td>' + event[i].date + '</td>';
                    txt += '<td>' + event[i].uphno + '</td>';
                    txt += '<td>' + event[i].sub + '</td>';
                    txt += '<td>' + event[i].msg + '</td>';

                    //alert(user[i].uid
                    txt += '<th class="text-center"><p><a class="link-info link-opacity-50-hover" onclick="seenStatus(\'' + event[i].msgid + '\')"  href="#" style="font-size:20px"> ' + event[i].msgstatus + '</i></i></a></p></th>';

                    txt += '<th><p><a class="link-info link-opacity-50-hover" onclick="delMsg(\'' + event[i].msgid + '\')"  href="#"> Delete </a></p></th>';
                    $('#msg-table tr:last').after(txt);
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
function getProfilePic() {
    $.ajax({
        url: '../WebService.asmx/getProfilePic',
        type: "POST", // type of the data we send (POST/GET)
        contentType: "application/json",
        data: "{ 'uid': '0'}",
        datatype: "json",
        success: function (response) { // when successfully sent data and returned
            //alert("Res: " + JSON.stringify(response.d));
            if (response.d.length > 10) {
                //$('#imgprofile').attr('src', String(response.d).replaceAll('"', ''));
                $('#profileicon').attr('src', String(response.d).replaceAll('"', ''));
                $('#preloader').css('display', 'none');

                //$("#tarea").val(String(response.d).replaceAll('"', ''));
            } else {

                $('#profileicon').attr('src', "../assets/imgs/profile pic.png");
                $('#preloader').css('display', 'none');
            }
        } // success close
    }).done(function () {
    }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
        alert("Status: " + textStatus + ", Error: " + errorThrown);
        //alert("Something went wrong. Please contact Admin.");
    }).always(function () {
    }); // ajax call ends
}