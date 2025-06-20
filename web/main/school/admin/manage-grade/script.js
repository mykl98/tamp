$(document).ready(function() {
    setTimeout(function(){
        $("#manage-grade-menu").attr("href","#");
        $("#manage-grade-menu").addClass("active");
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

getGradeList();
getUserDetails();
var gradeIdx;

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
    var markUp = '<table id="grade-table" class="table table-striped table-bordered table-sm">\
                        <thead>\
                            <tr>\
                                <th>Name</th>\
                                <th>Status</th>\
                                <th style="max-width:40px;min-width:40px;width:40px;">Tools</th>\
                            </tr>\
                        </thead>\
                        <tbody>';
    lists.forEach(function(list){
        var button = '<div class="dropdown">\
                        <button type="button" data-toggle="dropdown" class="btn btn-success btn-sm dropdown-toggle">More</button>\
                        <ul class="dropdown-menu">\
                            <li><a href="#" class="pl-2" onclick="editGrade('+list.idx+')"><i class="fa fa-pencil"></i> Edit</a></li>\
                            <div class="dropdown-divider"></div>\
                            <li><a href="#" class="pl-2" onclick="deleteGrade('+list.idx+')"><i class="fa fa-trash"></i> Delete</a></li>\
                        </ul>\
                      </div>';
        var status = list.status;
        if(status == "active"){
            status = '<span class="badge badge-success">Active</span>';
        }else if(status == "inactive"){
            status = '<span class="badge badge-danger">Inactive</span>';
        }
        markUp += '<tr>\
                        <td>'+list.name+'</td>\
                        <td>'+status+'</td>\
                        <td>'+button+'</td>\
                   </tr>';
    })
    markUp += '</tbody></table>';
    $("#grade-table-container").html(markUp);
    $("#grade-table").DataTable();
}

function addGrade(){
    gradeIdx = "";
    $("#add-edit-grade-modal").modal("show");
    $("#add-edit-grade-modal-title").text("Add New Grade Level");
    $("#add-edit-grade-modal-error").text("");
}

function saveGrade(){
    var name = $("#grade-name").val();
    var status = $("#grade-status").val();
    var error = "";
    if(name == "" || name == undefined){
        error = "*Name field should not be empty.";
    }else{
        $.ajax({
            type: "POST",
            url: "save-grade.php",
            dataType: 'html',
            data: {
                idx:gradeIdx,
                name:name,
                status:status
            },
            success: function(response){
                var resp = response.split("*_*");
                if(resp[0] == "true"){
                    $("#add-edit-grade-modal").modal("hide");
                    getGradeList();
                }else if(resp[0] == "false"){
                    alert(resp[1]);
                } else{
                    alert(response);
                }
            }
        });
    }

    $("#add-edit-grade-modal-error").text(error);
}

function editGrade(idx){
    gradeIdx = idx;
    $.ajax({
        type: "POST",
        url: "get-grade-detail.php",
        dataType: 'html',
        data: {
            idx:gradeIdx
        },
        success: function(response){
            var resp = response.split("*_*");
            if(resp[0] == "true"){
                renderEditGrade(resp[1]);
            }else if(resp[0] == "false"){
                alert(resp[1]);
            } else{
                alert(response);
            }
        }
    });
}

function renderEditGrade(data){
    var lists = JSON.parse(data);
    lists.forEach(function(list){
        $("#grade-name").val(list.name);
        $("#grade-status").val(list.status);
    })
    $("#add-edit-grade-modal-error").text("");
    $("#add-edit-grade-modal-title").text("Edit Grade Details");
    $("#add-edit-grade-modal").modal("show");
}

function deleteGrade(idx){
    if(confirm("Are you sure you want to delete this Grade Level?\nThis Action cannot be undone!")){
        $.ajax({
            type: "POST",
            url: "delete-grade.php",
            dataType: 'html',
            data: {
                idx:idx
            },
            success: function(response){
                var resp = response.split("*_*");
                if(resp[0] == "true"){
                    getGradeList();
                }else if(resp[0] == "false"){
                    alert(resp[1]);
                } else{
                    alert(response);
                }
            }
        });
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

