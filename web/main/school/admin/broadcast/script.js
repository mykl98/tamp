$(document).ready(function() {
    setTimeout(function(){
        $("#broadcast-menu").attr("href","#");
        $("#broadcast-menu").addClass("active");
    },100)
})

$(document).on('shown.lte.pushmenu', function(){
    $("#global-department-name").show();
})

$(document).on('collapsed.lte.pushmenu', function(){
    $("#global-department-name").hide();
})

$(".modal").on("hidden.bs.modal",function(){
    $(this).find("form").trigger("reset");
})

getUserDetails();
getGradeList();

function getUserDetails(){
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
                renderUserDetails(resp[1]);
            }else if(resp[0] == "false"){
                alert(resp[1]);
            } else{
                alert(response);
            }
        }
    });
}

function renderUserDetails(data){
    var lists = JSON.parse(data);

    lists.forEach(function(list){
        if(list.image != "" && list.image != null){
            $("#global-user-image").attr("src", list.image);
        }
        var name = list.firstname + " " + list.middlename[0] + ". " + list.lastname;
        $("#global-user-name").text(name);
    })

}

function getGradeList(){
    $.ajax({
        type: "POST",
        url: "get-grade-list.php",
        dataType: 'html',
        data: {
            dummy:"dummy"
        },
        success: function(response){
            var resp = response.split("*_*");
            if(resp[0] == "true"){
                renderGradeList(resp[1]);
            }else if(resp[0] == "false"){
                alert(resp[1]);
            } else{
                alert(response);
            }
        }
    });
}

function renderGradeList(data){
    var lists = JSON.parse(data);
    var markUp = '<div class="form-group" id="grade-container">\
                        <label for="broadcast-grade" class="col-form-label">Grade:</label>\
                        <select class="form-control form-control-sm" id="broadcast-grade" onchange="getSectionList()">';
    lists.forEach(function(list){
        markUp += '<option value="'+list.idx+'">'+list.name+'</option>';
    })
    markUp += '</select></div>'
    $("#grade-select-container").html(markUp);
    getSectionList();
}

function getSectionList(){
    var grade = $("#broadcast-grade").val();
    $.ajax({
        type: "POST",
        url: "get-section-list.php",
        dataType: 'html',
        data: {
            grade:grade
        },
        success: function(response){
            var resp = response.split("*_*");
            if(resp[0] == "true"){
                renderSectionList(resp[1]);
            }else if(resp[0] == "false"){
                alert(resp[1]);
            } else{
                alert(response);
            }
        }
    });
}

function renderSectionList(data){
    var lists = JSON.parse(data);
    var markUp = '<div class="form-group" id="section-container">\
                        <label for="broadcast-section" class="col-form-label">Section:</label>\
                        <select class="form-control form-control-sm" id="broadcast-section">';
    lists.forEach(function(list){
        markUp += '<option value="'+list.idx+'">'+list.name+'</option>';
    })
    markUp += '</select></div>'
    $("#section-select-container").html(markUp);
}

function sendBroadcast(){
    var text = $("#broadcast-text").val();
    var grade = $("#broadcast-grade").val();
    var section = $("#broadcast-section").val();
    
    var error = "";
    if(text == "" || text == undefined){
        error = "*Announcement field should not be empty!";
    }else{
        processingModal("show");
        $.ajax({
            type: "POST",
            url: "send-broadcast.php",
            dataType: 'html',
            data: {
                text:text,
                grade:grade,
                section:section
            },
            success: function(response){
                processingModal("hide");
                var resp = response.split("*_*");
                if(resp[0] == "true"){
                    setTimeout(function(){
                        alert(resp[1]);
                    },100);
                    $("#broadcast-text").val("");
                }else if(resp[0] == "false"){
                    alert(resp[1]);
                } else{
                    alert(response);
                }
            }
        });
    }
    $("#send-broadcast-error").text(error);
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
                window.open("../../../../index.php","_self")
            }else if(resp[0] == "false"){
                alert(resp[1]);
            } else{
                alert(response);
            }
        }
    });
}

