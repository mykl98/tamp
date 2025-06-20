$(document).ready(function() {
    setTimeout(function(){
        $("#manage-school-menu").attr("href","#");
        $("#manage-school-menu").addClass("active");
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

$(document).on('hidden.bs.modal', '.modal', function () {
    $('.modal.show').length && $(document.body).addClass('modal-open');
});

getSchoolList();
getAgentList();
getUserDetails();
var schoolIdx;

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

function getSchoolList(){
    processingModalShow();
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
    var markUp = '<table id="school-table" class="table table-striped table-bordered table-sm">\
                        <thead>\
                            <tr>\
                                <th>ID</th>\
                                <th>Name</th>\
                                <th>Address</th>\
                                <th>Color</th>\
                                <th>Status</th>\
                                <th style="max-width:50px;min-width:50px;">Action</th>\
                            </tr>\
                        </thead>\
                        <tbody>';
    lists.forEach(function(list){
        var button = '<div class="dropdown">\
                        <button type="button" data-toggle="dropdown" class="btn btn-success btn-sm dropdown-toggle">More</button>\
                        <ul class="dropdown-menu">\
                            <li><a href="#" class="pl-2" onclick="editSchool('+list.idx+')"><i class="fa fa-pencil"></i> Edit</a></li>\
                            <div class="dropdown-divider"></div>\
                            <li><a href="#" class="pl-2" onclick="deleteSchool('+list.idx+')"><i class="fa fa-trash"></i> Delete</a></li>\
                            <div class="dropdown-divider"></div>\
                            <li><a href="#" class="pl-2" onclick="resetStudentAttendance('+list.idx+')"><i class="fa fa-warning"></i> Reset Student Attendance</a></li>\
                            <div class="dropdown-divider"></div>\
                            <li><a href="#" class="pl-2" onclick="resetAccountAttendance('+list.idx+')"><i class="fa fa-warning"></i> Reset Account<br>Attendance</a></li>\
                            <div class="dropdown-divider"></div>\
                            <li><a href="#" class="pl-2" onclick="resetSchool('+list.idx+')"><i class="fa fa-warning"></i> Reset School</a></li>\
                        </ul>\
                      </div>';
        var status = list.status;
        if(status == "active"){
            status = '<span class="badge badge-success">Active</span>';
        }else if(status == "inactive"){
            status = '<span class="badge badge-danger">Inactive</span>';
        }
        var color = '<span class="badge px-4" style="background-color:'+list.color+';">&nbsp;</span>';

        markUp += '<tr>\
                        <td>'+list.id+'</td>\
                        <td>'+list.name+'</td>\
                        <td>'+list.address+'</td>\
                        <td>'+color+'</td>\
                        <td>'+status+'</td>\
                        <td>'+button+'</td>\
                   </tr>';
    })
    markUp += '</tbody></table>';
    $("#school-table-container").html(markUp);
    $("#school-table").DataTable();
    processingModalHide();
}

function getAgentList(){
    $.ajax({
		type: "POST",
		url: "get-agent-list.php",
		dataType: 'html',
		data: {
			dummy:"dummy"
		},
		success: function(response){
			var resp = response.split("*_*");
			if(resp[0] == "true"){
				renderAgentList(resp[1]);
			}else if(resp[0] == "false"){
				alert(resp[1]);
			} else{
				alert(response);
			}
		}
	});
}

function renderAgentList(data){
    var lists = JSON.parse(data);
    var markup = '<label for="school-agent1" class="col-form-label">Agent 1:</label>\
                    <select class="form-control form-control-sm" id="school-agent1"/>\
                        <option value="">SELECT AGENT 1</option>';

    lists.forEach(function(list){
        var name = list.firstname + " " + list.middlename.charAt(0) + ". " + list.lastname;
        markup += '<option value="'+list.idx+'">'+name+'</option>';
    });
    markup += '</select></div>';
    $("#agent1-select-container").html(markup);

    markup = '<label for="school-agent2" class="col-form-label">Agent 2:</label>\
                    <select class="form-control form-control-sm" id="school-agent2"/>\
                        <option value="">SELECT AGENT 2</option>';

    lists.forEach(function(list){
        var name = list.firstname + " " + list.middlename.charAt(0) + ". " + list.lastname;
        markup += '<option value="'+list.idx+'">'+name+'</option>';
    });
    markup += '</select></div>';
    $("#agent2-select-container").html(markup);

    markup = '<label for="school-agent3" class="col-form-label">Agent 3:</label>\
                    <select class="form-control form-control-sm" id="school-agent3"/>\
                        <option value="">SELECT AGENT 3</option>';

    lists.forEach(function(list){
        var name = list.firstname + " " + list.middlename.charAt(0) + ". " + list.lastname;
        markup += '<option value="'+list.idx+'">'+name+'</option>';
    });
    markup += '</select></div>';
    $("#agent3-select-container").html(markup);
}

function addSchool(){
    schoolIdx = "";
    $("#add-edit-school-modal").modal("show");
    $("#add-edit-school-modal-title").text("Add New School");
    $("#add-edit-school-modal-error").text("");
    $("#school-image").attr("src","../../../system/images/no-image-available.jpg");
}

function saveSchool(){
    var image = $("#school-image").attr("src");
    var name = $("#school-name").val();
    var address = $("#school-address").val();
    var color = $("#school-color").val();
    var status = $("#school-status").val();

    var agent1 = $("#school-agent1").val();
    var agent2 = $("#school-agent2").val();
    var agent3 = $("#school-agent3").val();
    var mainShare = $("#school-mainshare").val();
    var techShare = $("#school-techshare").val();
    var agentShare = $("#school-agentshare").val();

    if(!image.includes("data:image/png;base64")){
        image = "";
    }

    var error = "";
    if(name == "" || name == undefined){
        error = "*Name field should not be empty.";
    }else if(address == "" || address == undefined){
        error = "*Address field should not be empty!";
    }else if(color == "" || color == undefined){
        error = "*Please select color!";
    }else{
        $.ajax({
            type: "POST",
            url: "save-school.php",
            dataType: 'html',
            data: {
                idx:schoolIdx,
                image:image,
                name:name,
                address:address,
                color:color,
                status:status,
                agent1:agent1,
                agent2:agent2,
                agent3:agent3,
                mainshare:mainShare,
                techshare:techShare,
                agentshare:agentShare
            },
            success: function(response){
                var resp = response.split("*_*");
                if(resp[0] == "true"){
                    $("#add-edit-school-modal").modal("hide");
                    getSchoolList();
                }else if(resp[0] == "false"){
                    alert(resp[1]);
                } else{
                    alert(response);
                }
            }
        });
    }

    $("#add-edit-school-modal-error").text(error);
}

function editSchool(idx){
    schoolIdx = idx;
    $.ajax({
        type: "POST",
        url: "get-school-detail.php",
        dataType: 'html',
        data: {
            idx:schoolIdx
        },
        success: function(response){
            var resp = response.split("*_*");
            if(resp[0] == "true"){
                renderEditSchool(resp[1]);
            }else if(resp[0] == "false"){
                alert(resp[1]);
            } else{
                alert(response);
            }
        }
    });
}

function renderEditSchool(data){
    var lists = JSON.parse(data);
    lists.forEach(function(list){
        var image = list.image;
        if(image == ""){
            image = "../../../system/images/no-image-available.jpg";
        }
        $("#school-id").val(list.id);
        $("#school-image").attr("src",image);
        $("#school-name").val(list.name);
        $("#school-address").val(list.address);
        $("#school-color").val(list.color);
        $("#school-status").val(list.status);
        $("#school-agent1").val(list.agent1);
        $("#school-agent2").val(list.agent2);
        $("#school-agent3").val(list.agent3);
        $("#school-mainshare").val(list.mainshare);
        $("#school-techshare").val(list.techshare);
        $("#school-agentshare").val(list.agentshare);
    })
    $("#add-edit-school-modal-error").text("");
    $("#add-edit-school-modal-title").text("Edit School Details");
    $("#add-edit-school-modal").modal("show");
}

function deleteSchool(idx){
    if(confirm("Are you sure you want to delete this School?\nThis Action cannot be undone!")){
        $.ajax({
            type: "POST",
            url: "delete-school.php",
            dataType: 'html',
            data: {
                idx:idx
            },
            success: function(response){
                var resp = response.split("*_*");
                if(resp[0] == "true"){
                    getSchoolList();
                }else if(resp[0] == "false"){
                    alert(resp[1]);
                } else{
                    alert(response);
                }
            }
        });
    }
}

function processingModalShow(){
    $("#processing-screen-modal").modal("show");
}

function processingModalHide(){
    $("#processing-screen-modal").modal("hide");
}

function resetStudentAttendance(idx){
    if(confirm("Are you sure you want to reset the student attendance database. This action cannot be undone!")){
        $.ajax({
            type: "POST",
            url: "reset-student-attendance.php",
            dataType: 'html',
            data: {
                idx:idx
            },
            success: function(response){
                var resp = response.split("*_*");
                if(resp[0] == "true"){
                    alert("Student Attendance reset successfull!");
                }else if(resp[0] == "false"){
                    alert(resp[1]);
                } else{
                    alert(response);
                }
            }
        });
    }
}

function resetAccountAttendance(idx){
    if(confirm("Are you sure you want to reset the account attendance database. This action cannot be undone!")){
        $.ajax({
            type: "POST",
            url: "reset-account-attendance.php",
            dataType: 'html',
            data: {
                idx:idx
            },
            success: function(response){
                var resp = response.split("*_*");
                if(resp[0] == "true"){
                    alert("Account Attendance reset successfull!");
                }else if(resp[0] == "false"){
                    alert(resp[1]);
                } else{
                    alert(response);
                }
            }
        });
    }
}

function resetSchool(idx){
    if(confirm("Are you sure you want to reset the school. This action cannot be undone!")){
        $.ajax({
            type: "POST",
            url: "reset-school.php",
            dataType: 'html',
            data: {
                idx:idx
            },
            success: function(response){
                var resp = response.split("*_*");
                if(resp[0] == "true"){
                    alert("School reset successfull!");
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
                window.open("../../../index.php","_self")
            }else if(resp[0] == "false"){
                alert(resp[1]);
            } else{
                alert(response);
            }
        }
    });
}

/************** Image Editor *************/
var image;
var loadImage= function(event){
	var reader = new FileReader();
	reader.onload = function(e) {
		$('#image-editor-buffer').attr('src', e.target.result);

        if(image){
            image.destroy();
        }

		image = new Croppie($('#image-editor-buffer')[0], {
			viewport: { width: 300, height: 300,type:'square'},
			boundary: { width: 400, height: 400 },
            enableOrientation: true
		});

        $('#image-editor-modal').modal('show');
		$('#image-editor-ok-btn').on('click', function() {
			image.result('base64').then(function(dataImg) {
				var data = [{ image: dataImg }, { name: 'myimage.jpg' }];
				$('#school-image').attr('src', dataImg);
			});
		});
	}
	reader.readAsDataURL(event.target.files[0]);
}

function imageEditorCancel(){
	if(image){
		image.destroy();
    }
}

function imageEditorRotate(){
	image.rotate(-90);
}

