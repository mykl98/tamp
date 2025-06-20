$(document).ready(function() {
    setTimeout(function(){
        $("#staff-attendance-menu").attr("href","#");
        $("#staff-attendance-menu").addClass("active");
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

$(document).on('hidden.bs.modal', '.modal', function () {
    $('.modal.show').length && $(document.body).addClass('modal-open');
});

getUserDetails();
getData();

function showProcessingModal(){
    $("#processing-screen-modal").show();
}

function hideProcessingModal(){
    $("#processing-screen-modal").hide();
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
        if(list.image != "" && list.image != null){
            $("#global-user-image").attr("src", list.image);
        }
        var name = list.firstname + " " + list.middlename[0] + ". " + list.lastname;
        $("#global-user-name").text(name);
    })

}

function getData(){
    var monthFilter = $("#month-filter").val();

    showProcessingModal();

    $.ajax({
		type: "POST",
		url: "get-data.php",
		dataType: 'html',
		data: {
            month:monthFilter
		},
		success: function(response){
			var resp = response.split("*_*");
			if(resp[0] == "true"){
				renderData(resp[1], monthFilter);
			}else if(resp[0] == "false"){
				alert(resp[1]);
			} else{
				alert(response);
			}
		}
	});
}

function renderData(data, month){
    var numberOfDays = daysInMonth(month);
    var currentDate = getCurrentDate();
    var lists = JSON.parse(data);
    lists.forEach(function(list){
        var attendanceList = list.attendance;
        var attendance = JSON.parse(attendanceList);

        var accountList = list.account;
        var account = JSON.parse(accountList);

        var markUp = '<table id="data-table" class="table table-striped table-bordered table-sm">\
                        <thead>\
                            <tr>\
                                <th>Name</th>\
                                <th class="text-center">P</th>\
                                <th class="text-center">A</th>';
        for(var i=1; i<=numberOfDays; i++){
            markUp += '<th class="text-center">'+i+'</th>';
        }
        markUp += '<th style="width:80px;min-width:80px;max-width:80px;">Tools</th>';
        markUp += '</tr></thead><tbody>';

        account.forEach(function(acc){
            var pCount = 0;
            var aCount = 0;
            var tableBody = "";
            var tableHead = "";
            for(var i=1; i<=numberOfDays; i++){
                var date = "";
                if(i < 10){
                    date = month + "-0" + i;
                }else{
                    date = month + "-" + i;
                }
                var dayOfWeek = new Date(date).getDay();
                var dateToSearch = acc.idx + "_" + date;
                if(new Date(date) > new Date(currentDate)){
                    tableBody += '<td></td>';
                }else if(dayOfWeek == 0 || dayOfWeek == 6){
                    tableBody += '<td></td>';
                }else{
                    if($.inArray(dateToSearch, attendance) !== -1){
                        tableBody += '<td class="text-center">P</td>';
                        pCount += 1;
                    }else{
                        tableBody += '<td class="text-center">A</td>';
                        aCount += 1;
                    }
                }
            }
            var name = acc.firstname + " " + acc.middlename[0] + ". " + acc.lastname;
            tableHead = '<tr>\
                        <td>'+name+'</td>\
                        <td>'+pCount+'</td>\
                        <td>'+aCount+'</td>';
            var button = '<button class="btn btn-info btn-sm btn-flat" onclick="view(\''+acc.idx+'\')"><i class="fa fa-eye"></i> view</button>';
            tableBody += '<td>'+button+'</td>';
            markUp += tableHead;
            markUp += tableBody;
            markUp += '</tr>';
        });

        markUp += '</tbody></table>';
        $("#data-table-container").html(markUp);
    });
    hideProcessingModal();
}

function view(idx){
    staffIdx = idx;
    getAttendance();
}

var attendanceName;
var studentIdx;

function getAttendance(){
    showProcessingModal();
    var from = $("#attendance-from").val();
    var to = $("#attendance-to").val();
    $.ajax({
        type: "POST",
        url: "get-attendance.php",
        dataType: 'html',
        data: {
            idx: staffIdx,
            from: from,
            to: to
        },
        success: function(response){
            var resp = response.split("*_*");
            if(resp[0] == "true"){
                renderAttendance(resp[1]);
                attendanceName = resp[2];
            }else if(resp[0] == "false"){
                alert(resp[1]);
            } else{
                alert(response);
            }
        }
    });
}

function renderAttendance(data){
    var lists = JSON.parse(data);
    var markUp = '<table id="attendance-table" class="table table-striped table-bordered table-sm">\
                        <thead>\
                            <tr>\
                                <th>Date</th>\
                                <th>IN</th>\
                                <th>OUT</th>\
                                <th>IN</th>\
                                <th>OUT</th>\
                                <th>IN</th>\
                                <th>OUT</th>\
                                <th>IN</th>\
                                <th>OUT</th>\
                                <th>IN</th>\
                                <th>OUT</th>\
                            </tr>\
                        </thead>\
                        <tbody>';
    lists.forEach(function(list){
        markUp += '<tr>\
                        <td>'+list.date+' _</td>\
                        <td>'+list.in1+'</td>\
                        <td>'+list.out1+'</td>\
                        <td>'+list.in2+'</td>\
                        <td>'+list.out2+'</td>\
                        <td>'+list.in3+'</td>\
                        <td>'+list.out3+'</td>\
                        <td>'+list.in4+'</td>\
                        <td>'+list.out4+'</td>\
                        <td>'+list.in5+'</td>\
                        <td>'+list.out5+'</td>\
                   </tr>';
    })
    markUp += '</tbody></table>';
    $("#attendance-table-container").html(markUp);
    $("#attendance-table").DataTable();
    $("#attendance-modal").modal("show");
    hideProcessingModal();
}

function daysInMonth(monthFilter){
    var YM = monthFilter.split("-");
    return new Date(YM[0], YM[1], 0).getDate();
}

function getCurrentDate(){
    var d = new Date();

    var month = d.getMonth()+1;
    var day = d.getDate();

    var output = d.getFullYear() + '-' +
        (month<10 ? '0' : '') + month + '-' +
        (day<10 ? '0' : '') + day;
    return output;
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

function exportReport(){
    var data = document.getElementById('data-table');

    var file = XLSX.utils.table_to_book(data, {sheet: "sheet1"});

    XLSX.write(file, { bookType: "xlsx", bookSST: true, type: 'base64' });

    XLSX.writeFile(file, "staff_attendance_report.xlsx");
}

function exportAttendance(){
    var currentdate = new Date(); 
    var datetime = currentdate.getDate() + "_"
                + (currentdate.getMonth()+1)  + "_" 
                + currentdate.getFullYear() + "__"  
                + currentdate.getHours() + "_"  
                + currentdate.getMinutes() + "_" 
                + currentdate.getSeconds();

    var data = document.getElementById('attendance-table');

    var file = XLSX.utils.table_to_book(data, {sheet: "sheet1"});

    XLSX.write(file, { bookType: "xlsx", bookSST: true, type: 'base64' });

    XLSX.writeFile(file, attendanceName+"_"+datetime+".xlsx");
}

function showAttendance(){
    showProcessingModal();
    var date = $("#show-attendance-filter").val();
    $.ajax({
        type: "POST",
        url: "get-daily-attendance.php",
        dataType: 'html',
        data: {
            date:date
        },
        success: function(response){
            var resp = response.split("*_*");
            if(resp[0] == "true"){
                renderShowAttendance(resp[1]);
                attendanceName = resp[2];
            }else if(resp[0] == "false"){
                alert(resp[1]);
            } else{
                alert(response);
            }
        }
    });
}

function renderShowAttendance(data){
    var lists = JSON.parse(data);

    var markUp = '<table id="show-attendance-table" class="table table-striped table-bordered table-sm">\
                        <thead>\
                            <tr>\
                                <th>Name</th>\
                                <th>Date</th>\
                                <th>IN</th>\
                                <th>OUT</th>\
                                <th>IN</th>\
                                <th>OUT</th>\
                                <th>IN</th>\
                                <th>OUT</th>\
                                <th>IN</th>\
                                <th>OUT</th>\
                                <th>IN</th>\
                                <th>OUT</th>\
                            </tr>\
                        </thead>\
                        <tbody>';

    lists.forEach(function(list){
        var name = list.lastname + ", " + list.firstname + " " + list.middlename[0] + ".";
        markUp += '<tr>\
                        <td>'+name+'</td>';
        var attendanceList = JSON.parse(list.attendance);
        if(attendanceList.length > 0){
            attendanceList.forEach(function(att){
                markUp += '<td>\''+att.date+'</td>\
                            <td>'+att.in1+'</td>\
                            <td>'+att.out1+'</td>\
                            <td>'+att.in2+'</td>\
                            <td>'+att.out2+'</td>\
                            <td>'+att.in3+'</td>\
                            <td>'+att.out3+'</td>\
                            <td>'+att.in4+'</td>\
                            <td>'+att.out4+'</td>\
                            <td>'+att.in5+'</td>\
                            <td>'+att.out5+'</td>\
                            </tr>';
            });
        }else{
            markUp += '<td></td>\
                        <td></td>\
                        <td></td>\
                        <td></td>\
                        <td></td>\
                        <td></td>\
                        <td></td>\
                        <td></td>\
                        <td></td>\
                        <td></td>\
                        <td></td>\
                        </tr>';
        }             
    });

    markUp += '</tbody></table>';
    $("#daily-attendance-table-container").html(markUp);
    $("#show-attendance-table").DataTable();
    $("#daily-attendance-modal").modal("show");
    hideProcessingModal();
}

function exportDailyAttendance(){
    var datetime = $("#show-attendance-filter").val();

    $("#show-attendance-table").DataTable().destroy();

    var data = document.getElementById('show-attendance-table');

    var file = XLSX.utils.table_to_book(data, {sheet: "sheet1"});

    XLSX.write(file, { bookType: "xlsx", bookSST: true, type: 'base64' });

    XLSX.writeFile(file, "Student Attendance_"+datetime+".xlsx");

    setTimeout(function(){
        $("#show-attendance-table").DataTable();
    },100);
}





