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
        $("#admin-count").text(list.admincount);
        
        var studentTotalCount = 0;
        var schoolTotalCount = 0;

        var schools = JSON.parse(list.schoollist);
        var markUp = '<table id="school-list-table" class="table table-striped table-bordered table-sm">\
                        <thead>\
                            <tr>\
                                <th>Name</th>\
                                <th>Student Count</th>\
                                <th>Status</th>\
                            </tr>\
                        </thead>\
                        <tbody>';
        schools.forEach(function(school){
            var studentCount = school.studentcount;
            studentTotalCount += studentCount;
            schoolTotalCount ++;
            $("#student-count").text(studentTotalCount);
            $("#school-count").text(schoolTotalCount);

            var status = school.status;
            if(status == "active"){
                status = '<span class="badge badge-success">Active</span>';
            }else if(status == "inactive"){
                status = '<span class="badge badge-danger">Inactive</span>';
            }

            markUp += '<tr>\
                        <td>'+school.name+'</td>\
                        <td>'+studentCount+'</td>\
                        <td>'+status+'</td>\
                   </tr>';
        }); 
        markUp += '</tbody></table>';
        $("#school-list-table-container").html(markUp);
        $("#school-list-table").DataTable();
    })
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
        var image = list.image
        if(image != "" && image != null){
            $("#global-user-image").attr("src", image);
        }
        var name = list.firstname + " " + list.middlename[0] + ". " + list.lastname;
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
