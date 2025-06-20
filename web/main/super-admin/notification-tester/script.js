var updateProfileSettingsFlag = false;
var profileSettingsIdx;

$(document).ready(function(){
    setTimeout(function(){
        $("#notification-tester-menu").attr("href","#");
        $("#notification-tester-menu").addClass("active");
    },100)
})

$(document).on('shown.lte.pushmenu', function(){
    $("#global-department-name").show();
    $("#global-client-logo").attr("width","100px");
})

$(document).on('collapsed.lte.pushmenu', function(){
    $("#global-department-name").hide();
    $("#global-client-logo").attr("width","40px");
})

getProfileSettings();
getSchoolList();

function getProfileSettings(){
    $.ajax({
        type: "POST",
        url: "get-profile-settings.php",
        dataType: 'html',
        data: {
            dummy:"dummy"
        },
        success: function(response){
            var resp = response.split("*_*");
            if(resp[0] == "true"){
                renderProfileSettings(resp[1]);
            }else if(resp[0] == "false"){
                alert(resp[1]);
            } else{
                alert(response);
            }
        }
    });
}

function renderProfileSettings(data){
    var lists = JSON.parse(data);
    lists.forEach(function(list){
        if(list.image != "" && list.image != null){
            $("#global-user-image").attr("src", list.image);
        }
        var name = list.firstname + " " + list.middlename[0] + ". " + list.lastname;
        $("#global-user-name").text(name);
    })
}

function getSchoolList(){
    $.ajax({
        type: "POST",
        url: "get-school-list.php",
        dataType: 'html',
        data: {
            dummy:"dummy"
        },
        success: function(response){
            var resp = response.split("*_*");
            if(resp[0] == "true"){
                renderSchoolList(resp[1]);
            }else if(resp[0] == "false"){
                alert(resp[1]);
            } else{
                alert(response);
            }
        }
    });
}

function renderSchoolList(data){
    var lists = JSON.parse(data);
    var markUp = '<div class="form-group">\
                    <label class="control-label" for="notif-1-school">School:</label>\
                    <select class="form-control form-control-sm" id="notif-1-school" onchange="notif1SchoolChange()">\
                        <option value="">SELECT SCHOOL</option>';
    lists.forEach(function(list){
        markUp += '<option value="'+list.idx+'">'+list.name+'</option>';
    })
    markUp += '</select></div>';
    $("#school-select-container").html(markUp);
    $("#notif-1-school").select2({
        width:'100%',
        theme: "classic"
    });
}

function notif1SchoolChange(){
    var school = $("#notif-1-school").val();
    if(school == ""){
        $("#student-select-container").html = "<div></div>";
    }else{
        getStudentList(school);
    }
}

function getStudentList(school){
    $.ajax({
        type: "POST",
        url: "get-student-list.php",
        dataType: 'html',
        data: {
            school:school
        },
        success: function(response){
            var resp = response.split("*_*");
            if(resp[0] == "true"){
                renderStudentList(resp[1]);
            }else if(resp[0] == "false"){
                alert(resp[1]);
            } else{
                alert(response);
            }
        }
    });
}

function renderStudentList(data){
    var lists = JSON.parse(data);
    var markUp = '<div class="form-group">\
                    <label class="control-label" for="notif-1-student">Student:</label>\
                    <select class="form-control form-control-sm" id="notif-1-student">\
                        <option value="">SELECT STUDENT</option>';
    lists.forEach(function(list){
        markUp += '<option value="'+list.idx+'">'+list.name+'</option>';
    })
    markUp += '</select></div>';
    $("#student-select-container").html(markUp);
    $("#notif-1-student").select2({
        width:'100%',
        theme: "classic"
    });
}

function sendNotif1(){
    var school = $("#notif-1-school").val();
    var student = $("#notif-1-student").val();
    var message = $("#notif-1-message").val();
    var error = "";
    if(school == "" || school == undefined){
        error = "*Please select school!";
    }else if(student == "" || student == undefined){
        error = "*Please select student";
    }else if(message == "" || message == undefined){
        error = "*Message field should not be empty!";
    }else{
        if(confirm("Are you sure you want to send this test notification?")){
            processingModal("show");
            $.ajax({
                type: "POST",
                url: "send-notif-1.php",
                dataType: 'html',
                data: {
                    school:school,
                    student:student,
                    message:message
                },
                success: function(response){
                    processingModal("hide");
                    var resp = response.split("*_*");
                    if(resp[0] == "true"){
                        setTimeout(function(){
                            alert("Notification Successfully Sent!");
                        },100);
                    }else if(resp[0] == "false"){
                        alert(resp[1]);
                    } else{
                        alert(response);
                    }
                }
            });
        }
    }
    $("#notif-1-send-error").text(error);
    
}

function sendNotif1Activity(activity){
    var school = $("#notif-1-school").val();
    var student = $("#notif-1-student").val();
    var error = "";

    if(school == "" || school == undefined){
        error = "*Please select school!";
    }else if(student == "" || student == undefined){
        error = "*Please select student";
    }else{
        if(confirm("Are you sure you want to send this "+activity+" test notification?")){
            processingModal("show");
            $.ajax({
                type: "POST",
                url: "send-notif1-activity.php",
                dataType: 'html',
                data: {
                    school:school,
                    student:student,
                    activity:activity
                },
                success: function(response){
                    processingModal("hide");
                    var resp = response.split("*_*");
                    if(resp[0] == "true"){
                        setTimeout(function(){
                            alert("Notification Successfully Sent!");
                        },100);
                    }else if(resp[0] == "false"){
                        alert(resp[1]);
                    } else{
                        alert(response);
                    }
                }
            });
        }
    }
    $("#notif-1-send-error").text(error);
}

function sendNotif2(){
    var number = $("#notif-2-number").val();
    var message = $("#notif-2-message").val();
    var error = "";

    if(number == "" || number == undefined){
        error = "*Phone Number field should not be empty!";
    }else if(number.length != 11){
        error = "*Invalid phone number!";
    }else if(message == "" || message == undefined){
        error = "*Message field should not be empty!";
    }else{
        if(confirm("Are you sure you want to send this test notification?")){
            processingModal("show");
            $.ajax({
                type: "POST",
                url: "send-notif-2.php",
                dataType: 'html',
                data: {
                    number: number,
                    message:message
                },
                success: function(response){
                    processingModal("hide");
                    var resp = response.split("*_*");
                    if(resp[0] == "true"){
                        setTimeout(function(){
                            alert("Notification Successfully Sent!");
                        },100);
                    }else if(resp[0] == "false"){
                        alert(resp[1]);
                    } else{
                        alert(response);
                    }
                }
            });
        }
    }
    $("#notif-2-send-error").text(error);
}

function sendNotif2Activity(activity){
    var number = $("#notif-2-number").val();
    var error = "";

    if(number == "" || number == undefined){
        error = "*Phone Number field should not be empty!";
    }else if(number.length != 11){
        error = "*Invalid phone number!";
    }else{
        if(confirm("Are you sure you want to send this "+activity+" test push notification?")){
            processingModal("show");
            $.ajax({
                type: "POST",
                url: "send-notif2-activity.php",
                dataType: 'html',
                data: {
                    number: number,
                    activity:activity
                },
                success: function(response){
                    processingModal("hide");
                    var resp = response.split("*_*");
                    if(resp[0] == "true"){
                        setTimeout(function(){
                            alert("Notification Successfully Sent!");
                        },100);
                    }else if(resp[0] == "false"){
                        alert(resp[1]);
                    } else{
                        alert(response);
                    }
                }
            });
        }
    }

    $("#notif-2-send-error").text(error);
}

function processingModal(action){
    if(action == "show"){
        $("#processing-screen-modal").show();
    }else{
        $("#processing-screen-modal").hide();
    }
}

function logout(){
    $.ajax({
        type: "POST",
        url: "logout.php",
        dataType: 'html',
        data: {
            dummy:"dummy"
        },
        success: function(response){
            var resp = response.split("*_*");
            if(resp[0] == "true"){
                window.open("../../../index.php","_self")
            }else if(resp[0] == "false"){
                alert(resp[1]);
            } else{
                alert(response);
            }
        }
    });
}