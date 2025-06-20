$(document).ready(function() {
    setTimeout(function(){
        $("#student-attendance-menu").attr("href","#");
        $("#student-attendance-menu").addClass("active");
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

$(".modal").on("hidden.bs.modal",function(){
    $(this).find("form").trigger("reset");
})

getDashboardDetail();
getUserDetails();
var studentIdx;

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
        var image = list.image;
        if(image != null){
            if(list.image.includes("data:image/png;base64")){
                $("#global-user-image").attr("src", list.image);
            }
        }
        var name = list.firstname + " " + list.middlename.charAt(0) + ". " + list.lastname;
        $("#global-user-name").text(name);
    });
}

function getDashboardDetail(){
    processingModal("show");
    var dateFilter = $("#datefilter").val();
    $.ajax({
        type: "POST",
        url: "get-dashboard-details.php",
        dataType: 'html',
        data: {
            date:dateFilter
        },
        success: function(response){
            var resp = response.split("*_*");
            if(resp[0] == "true"){
                renderDashboardDetail(resp[1]);
            }else if(resp[0] == "false"){
                alert(resp[1]);
            } else{
                alert(response);
            }
        }
    });
}

function renderDashboardDetail(data){
    var lists = JSON.parse(data);
    lists.forEach(function(list){

        var attendance = []
        var attendances = JSON.parse(list.attendance);
        attendances.forEach(function(att){
            attendance[att.student] = att.idx;
        });

        var students = JSON.parse(list.studentlist);
        var markUp = '<table id="table" class="table table-striped table-bordered table-sm">\
                        <thead>\
                            <tr>\
                                <th>Name</th>\
                                <th>Status</th>\
                                <th>Tools</th>\
                            </tr>\
                        </thead>\
                        <tbody>';
        students.forEach(function(student){
            var name = student.firstname + " "  + student.middlename[0] + ". " + student.lastname;
            var button = '<button class="btn btn-info btn-sm btn-flat" onclick="send(\''+student.idx+'\',\''+name+'\')"><i class="fa fa-paper-plane"></i> Send</button>';
            var status;
            if(attendance[student.idx] == undefined){
                status = '<span class="badge badge-danger">Absent</span>';
            }else{
                status = '<span class="badge badge-success">Present</span>';
            }
            markUp += '<tr>\
                        <td>'+name+'</td>\
                        <td>'+status+'</td>\
                        <td>'+button+'</td>\
                       </tr>';
        }); 

        markUp += '</tbody></table>';
        $("#table-container").html(markUp);
        $("#table").DataTable();
        
        /**** Hidden table for export *****/
        var markUp = '<table id="hidden-table" class="d-none">\
                        <thead>\
                            <tr>\
                                <th>Name</th>\
                                <th>Status</th>\
                            </tr>\
                        </thead>\
                        <tbody>';
        students.forEach(function(student){
            var name = student.firstname + " "  + student.middlename[0] + ". " + student.lastname;
            var status;
            if(attendance[student.idx] == undefined){
                status = '<span class="badge badge-danger">Absent</span>';
            }else{
                status = '<span class="badge badge-success">Present</span>';
            }
            markUp += '<tr>\
                        <td>'+name+'</td>\
                        <td>'+status+'</td>\
                       </tr>';
        }); 

        markUp += '</tbody></table>';
        $("#hidden-table-container").html(markUp); 
    });
    processingModal("hide");
}

function exportSummary(){
    var date = $("#datefilter").val();

    var table = document.getElementById('hidden-table');

    var file = XLSX.utils.table_to_book(table, {sheet: "sheet1"});

    XLSX.write(file, { bookType: "xlsx", bookSST: true, type: 'base64' });

    XLSX.writeFile(file, date + "_attendance_summry.xlsx");
}

function send(idx,name){
    studentIdx = idx;
    $("#send-notif-modal-title").text("Send Message to " + name + "'s Parents");
    $("#send-notif-modal").modal("show");
}

function sendNotif(){
    var message = $("#notif-message").val();
    var error = "";

    if(message == "" ||  message == undefined){
        error = "*Message field should not be empty.";
    }else{
        $("#send-notif-modal").modal("hide");
        processingModal("show");
        
        $.ajax({
            type: "POST",
            url: "send-message.php",
            dataType: 'html',
            data: {
                idx:studentIdx,
                message: message
            },
            success: function(response){
                processingModal("hide");
                var resp = response.split("*_*");
                if(resp[0] == "true"){
                    setTimeout(function(){
                        alert("Message successfully sent!");
                    },100);
                }else if(resp[0] == "false"){
                    alert(resp[1]);
                } else{
                    alert(response);
                }
            }
        });
    }
    $("#send-notif-modal-error").text(error);
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
