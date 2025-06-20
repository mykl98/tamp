$(document).ready(function() {
    setTimeout(function(){
        $("#dashboard-menu").attr("href","#");
        $("#dashboard-menu").addClass("active");
    },100)
});

$(document).on('shown.lte.pushmenu', function(){
    $("#global-department-name").show();
    $("#global-client-logo").attr("width","100px");
})

$(document).on('collapsed.lte.pushmenu', function(){
    $("#global-department-name").hide();
    $("#global-client-logo").attr("width","40px");
})

getUserDetails();
getDashboardDetails();

function getDashboardDetails(){
    $.ajax({
        type: "POST",
        url: "get-dashboard-details.php",
        dataType: 'html',
        data: {
            dummy:"dummy"
        },
        success: function(response){
            var resp = response.split("*_*");
            if(resp[0] == "true"){
                renderDashboardDetails(resp[1]);
            }else if(resp[0] == "false"){
                alert(resp[1]);
            } else{
                alert(response);
            }
        }
    });
}

function renderDashboardDetails(data){
    var lists = JSON.parse(data);
    lists.forEach(function(list){
        var studentTotalCount = 0;
        var presentTotalCount = 0;
        var absentTotalCount = 0;

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
                            </tr>\
                        </thead>\
                        <tbody>';
        students.forEach(function(student){
            studentTotalCount ++;
            var name = student.firstname + " "  + student.middlename[0] + ". " + student.lastname;
            var status;
            if(attendance[student.idx] == undefined){
                absentTotalCount ++;
                status = '<span class="badge badge-danger">Absent</span>';
            }else{
                presentTotalCount ++;
                status = '<span class="badge badge-success">Present</span>';
            }
            markUp += '<tr>\
                        <td>'+name+'</td>\
                        <td>'+status+'</td>\
                       </tr>';
        }); 

        $("#student-count").text(studentTotalCount);
        $("#student-absent").text(absentTotalCount);
        $("#student-present").text(presentTotalCount);

        markUp += '</tbody></table>';
        $("#table-container").html(markUp);
        $("#table").DataTable();        
    });
}

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
    })
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
