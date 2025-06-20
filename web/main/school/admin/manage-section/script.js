$(document).ready(function() {
    setTimeout(function(){
        $("#manage-section-menu").attr("href","#");
        $("#manage-section-menu").addClass("active");
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

getSectionList();
getUserDetails();
getGradeList();
var sectionIdx;

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

function getSectionList(){
    $.ajax({
		type: "POST",
		url: "get-section-list.php",
		dataType: 'html',
		data: {
			dummy:"dummy"
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
    var markUp = '<table id="section-table" class="table table-striped table-bordered table-sm">\
                        <thead>\
                            <tr>\
                                <th>Name</th>\
                                <th>Grade Level</th>\
                                <th>Status</th>\
                                <th style="max-width:40px;min-width:40px;width:40px;">Tools</th>\
                            </tr>\
                        </thead>\
                        <tbody>';
    lists.forEach(function(list){
        var button = '<div class="dropdown">\
                        <button type="button" data-toggle="dropdown" class="btn btn-success btn-sm dropdown-toggle">More</button>\
                        <ul class="dropdown-menu">\
                            <li><a href="#" class="pl-2" onclick="editSection('+list.idx+')"><i class="fa fa-pencil"></i> Edit</a></li>\
                            <div class="dropdown-divider"></div>\
                            <li><a href="#" class="pl-2" onclick="deleteSection('+list.idx+')"><i class="fa fa-trash"></i> Delete</a></li>\
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
                        <td>'+list.grade+'</td>\
                        <td>'+status+'</td>\
                        <td>'+button+'</td>\
                   </tr>';
    })
    markUp += '</tbody></table>';
    $("#section-table-container").html(markUp);
    $("#section-table").DataTable();
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
    var markUp = '<div class="form-group">\
                        <label for="section-grade" class="col-form-label">Grade Level:</label>\
                        <select class="form-control" id="section-grade">\
                            <option value="">SELECT GRADE LEVEL</option>';
    lists.forEach(function(list){
        markUp += '<option value="'+list.idx+'">'+list.name+'</option>';
    })
    markUp += '</select></div>';
    $("#grade-select-container").html(markUp);
}

function addSection(){
    sectionIdx = "";
    $("#add-edit-section-modal").modal("show");
    $("#add-edit-section-modal-title").text("Add New Section");
    $("#add-edit-section-modal-error").text("");
}

function saveSection(){
    var name = $("#section-name").val();
    var grade = $("#section-grade").val();
    var status = $("#section-status").val();
    var error = "";
    //alert(name);
    if(name == "" || name == undefined){
        error = "*Name field should not be empty.";
    }else if(grade == "" || grade == undefined){
        error = "*Please select grade level.";
    }else{
        $.ajax({
            type: "POST",
            url: "save-section.php",
            dataType: 'html',
            data: {
                idx:sectionIdx,
                name:name,
                grade:grade,
                status:status
            },
            success: function(response){
                var resp = response.split("*_*");
                if(resp[0] == "true"){
                    $("#add-edit-section-modal").modal("hide");
                    getSectionList();
                }else if(resp[0] == "false"){
                    alert(resp[1]);
                } else{
                    alert(response);
                }
            }
        });
    }

    $("#add-edit-section-modal-error").text(error);
}

function editSection(idx){
    sectionIdx = idx;
    $.ajax({
        type: "POST",
        url: "get-section-detail.php",
        dataType: 'html',
        data: {
            idx:sectionIdx
        },
        success: function(response){
            var resp = response.split("*_*");
            if(resp[0] == "true"){
                renderEditSection(resp[1]);
            }else if(resp[0] == "false"){
                alert(resp[1]);
            } else{
                alert(response);
            }
        }
    });
}

function renderEditSection(data){
    var lists = JSON.parse(data);
    lists.forEach(function(list){
        $("#section-name").val(list.name);
        $("#section-grade").val(list.grade);
        $("#section-status").val(list.status);
    })
    $("#add-edit-section-modal-error").text("");
    $("#add-edit-section-modal-title").text("Edit Section Details");
    $("#add-edit-section-modal").modal("show");
}

function deleteSection(idx){
    if(confirm("Are you sure you want to delete this Section?\nThis Action cannot be undone!")){
        $.ajax({
            type: "POST",
            url: "delete-section.php",
            dataType: 'html',
            data: {
                idx:idx
            },
            success: function(response){
                var resp = response.split("*_*");
                if(resp[0] == "true"){
                    getSectionList();
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

