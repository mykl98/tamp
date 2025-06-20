$(document).ready(function() {
    setTimeout(function(){
        $("#dashboard-menu").attr("href","#");
        $("#dashboard-menu").addClass("active");
    },100)
});

$(document).on('shown.lte.pushmenu', function(){
    $("#global-department-name").show();
})

$(document).on('collapsed.lte.pushmenu', function(){
    $("#global-department-name").hide();
})


getUserDetails();
getDashboardDetails();

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

function getDashboardDetails(){
    proccessingModal("show");
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
        var totalStaffCount = 0;
        var totalStudentCount = 0;
        var totalStaffPresentCount = 0;
        var totalStaffAbsentCount = 0;
        var totalStudentPresentCount = 0;
        var totalStudentAbsentCount = 0;
        var staffAttendanceList = [];
        var studentAttendanceList = [];
        var gradeList = [];
        var status;

        var staffList = JSON.parse(list.stafflist);
        var studentList = JSON.parse(list.studentlist);
        var staffAttendance = JSON.parse(list.staffattendance);
        var studentAttendance = JSON.parse(list.studentattendance);
        var grades = JSON.parse(list.gradelist);

        staffAttendance.forEach(function(att){
            staffAttendanceList[att.staffidx] = "test";
        });

        studentAttendance.forEach(function(att){
            studentAttendanceList[att.studentidx] = "test";
        });

        grades.forEach(function(grade){
            gradeList[grade.idx] = grade.name;
        });

        //Staff Attendance Table
        var markUp = '<table id="staff-attendance-table" class="table table-striped table-bordered table-sm">\
                        <thead>\
                            <tr>\
                                <th>Name</th>\
                                <th>Status</th>\
                            </tr>\
                        </thead>\
                        <tbody>';

        staffList.forEach(function(staff){
            totalStaffCount++;
            if(staffAttendanceList[staff.idx]){
                totalStaffPresentCount++;
                status = "present";
            }else{
                totalStaffAbsentCount++;
                status = "absent";
            }

            if(status == "present"){
                status = '<span class="badge badge-success">Present</span>';
            }else if(status == "absent"){
                status = '<span class="badge badge-danger">Absent</span>';
            }
            var name = staff.firstname + " " + staff.middlename.charAt(0) + ". " + staff.lastname;
            markUp += '<tr>\
                        <td>'+name+'</td>\
                        <td>'+status+'</td>\
                       </tr>';

            $("#admin-faculty-count").text(totalStaffCount);
            $("#admin-faculty-present").text(totalStaffPresentCount);
            $("#admin-faculty-absent").text(totalStaffAbsentCount);
        });
        markUp += '</tbody></table>';
        $("#admin-attendance-table-container").html(markUp);
        $("#staff-attendance-table").DataTable();

        // Staff Attendance Hidden Table
        var markUp = '<table id="hidden-staff-attendance-table" class="d-none table">\
                        <thead>\
                            <tr>\
                                <th>Name</th>\
                                <th>Status</th>\
                            </tr>\
                        </thead>\
                        <tbody>';

        staffList.forEach(function(staff){
            if(staffAttendanceList[staff.idx]){
                status = "present";
            }else{
                status = "absent";
            }

            if(status == "present"){
                status = '<span class="badge badge-success">Present</span>';
            }else if(status == "absent"){
                status = '<span class="badge badge-danger">Absent</span>';
            }
            var name = staff.firstname + " " + staff.middlename.charAt(0) + ". " + staff.lastname;
            markUp += '<tr>\
                        <td>'+name+'</td>\
                        <td>'+status+'</td>\
                       </tr>';
        });
        markUp += '</tbody></table>';
        $("#hidden-admin-attendance-table-container").html(markUp);

        //Student Attendance Table
        var markUp = '<table id="student-attendance-table" class="table table-striped table-bordered table-sm">\
                        <thead>\
                            <tr>\
                                <th>Name</th>\
                                <th>Grade</th>\
                                <th>Status</th>\
                            </tr>\
                        </thead>\
                        <tbody>';

        studentList.forEach(function(student){
            totalStudentCount++;
            if(studentAttendanceList[student.idx]){
                totalStudentPresentCount++;
                status = "present";
            }else{
                totalStudentAbsentCount++;
                status = "absent";
            }

            if(status == "present"){
                status = '<span class="badge badge-success">Present</span>';
            }else if(status == "absent"){
                status = '<span class="badge badge-danger">Absent</span>';
            }
            var name = student.firstname + " " + student.middlename.charAt(0) + ". " + student.lastname;
            markUp += '<tr>\
                        <td>'+name+'</td>\
                        <td>'+gradeList[student.grade]+'</td>\
                        <td>'+status+'</td>\
                       </tr>';

            $("#student-count").text(totalStudentCount);
            $("#student-present").text(totalStudentPresentCount);
            $("#student-absent").text(totalStudentAbsentCount);
        });
        markUp += '</tbody></table>';
        $("#student-attendance-table-container").html(markUp);
        $("#student-attendance-table").DataTable();

        // Student Attendance Hidden Table
        var markUp = '<table id="hidden-student-attendance-table" class="d-none table">\
                        <thead>\
                            <tr>\
                                <th>Name</th>\
                                <th>Grade</th>\
                                <th>Status</th>\
                            </tr>\
                        </thead>\
                        <tbody>';

        studentList.forEach(function(student){
            if(studentAttendanceList[student.idx]){
                status = "present";
            }else{
                status = "absent";
            }

            if(status == "present"){
                status = '<span class="badge badge-success">Present</span>';
            }else if(status == "absent"){
                status = '<span class="badge badge-danger">Absent</span>';
            }
            var name = student.firstname + " " + student.middlename.charAt(0) + ". " + student.lastname;
            markUp += '<tr>\
                        <td>'+name+'</td>\
                        <td>'+gradeList[student.grade]+'</td>\
                        <td>'+status+'</td>\
                       </tr>';
        });
        markUp += '</tbody></table>';
        $("#hidden-student-attendance-table-container").html(markUp);

        // Layout grades
        markUp = '<div class="row">';
        var i = 0;
        grades.forEach(function(grade){
            var present = 0;
            var absent = 0;
            var gradeIdx = grade.idx;
            studentList.forEach(function(student){
                if(student.idx == gradeIdx){
                    if(studentAttendanceList[student.idx]){
                        present++;
                    }else{
                        absent++;
                    }
                }
            });

            markUp += '<div class="col-lg-3 col-6">\
                            <div class="small-box bg-info">\
                                <div class="inner">\
                                    <h3>'+ present +'</h3>\
                                    <p>'+ absent +' Absent Students</p>\
                                </div>\
                                <div class="icon">\
                                    <i class="fas fa-list"></i>\
                                </div>\
                                <a href="#" class="small-box-footer">'+grade.name+'</a>\
                            </div>\
                        </div>';
            if(i > 3){
                i = 0;
                markUp += '</div><div class="row">';
            }
            if(i > 0 < 4){
                markUp += '</row>';
            }
        });
        $("#grade-level-attendance-container").html(markUp);
    });
        
    proccessingModal("hide");
}

function showAdminAttendance(){
    $("#show-admin-attendance-modal").modal("show");
}

function showStudentAttendance(){
    $("#show-student-attendance-modal").modal("show");
}

function exportStaffAttendance(){
    var data = document.getElementById('hidden-staff-attendance-table');

    var file = XLSX.utils.table_to_book(data, {sheet: "sheet1"});

    XLSX.write(file, { bookType: "xlsx", bookSST: true, type: 'base64' });

    XLSX.writeFile(file, "staff_attendance_report.xlsx");
}

function exportStudentAttendance(){
    var data = document.getElementById('hidden-student-attendance-table');

    var file = XLSX.utils.table_to_book(data, {sheet: "sheet1"});

    XLSX.write(file, { bookType: "xlsx", bookSST: true, type: 'base64' });

    XLSX.writeFile(file, "student_attendance_report.xlsx");
}

function proccessingModal(action){
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
