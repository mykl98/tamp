$(document).ready(function() {
    setTimeout(function(){
        $("#faculty-menu").attr("href","#");
        $("#faculty-menu").addClass("active");
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
getGradeList();
var facultyIdx;
var gradeList = [];
var sectionList = [];

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

function getFacultyList(){
    $.ajax({
		type: "POST",
		url: "get-faculty-list.php",
		dataType: 'html',
		data: {
			dummy:"dummy"
		},
		success: function(response){
			var resp = response.split("*_*");
			if(resp[0] == "true"){
				renderFacultyList(resp[1]);
			}else if(resp[0] == "false"){
				alert(resp[1]);
			} else{
				alert(response);
			}
		}
	});
}

function renderFacultyList(data){
    var lists = JSON.parse(data);
    var markUp = '<table id="faculty-table" class="table table-striped table-bordered table-sm">\
                        <thead>\
                            <tr>\
                                <th>ID</th>\
                                <th>Name</th>\
                                <th>Username</th>\
                                <th>Grade Level</th>\
                                <th>Section</th>\
                                <th>Status</th>\
                                <th style="max-width:40px;min-width:40px;width:40px;">Tools</th>\
                            </tr>\
                        </thead>\
                        <tbody>';
    lists.forEach(function(list){
        var button = '<div class="dropdown">\
                        <button type="button" data-toggle="dropdown" class="btn btn-success btn-sm dropdown-toggle">More</button>\
                        <ul class="dropdown-menu">\
                            <li><a href="#" class="pl-2" onclick="edit('+list.idx+')"><i class="fa fa-pencil"></i> Edit</a></li>\
                            <div class="dropdown-divider"></div>\
                            <li><a href="#" class="pl-2" onclick="del('+list.idx+')"><i class="fa fa-trash"></i> Delete</a></li>\
                        </ul>\
                      </div>';

        var status = list.status;
        if(status == "active"){
            status = '<span class="badge badge-success">Active</span>';
        }else if(status == "inactive"){
            status = '<span class="badge badge-danger">Inactive</span>';
        }

        var name = list.firstname + " " + list.middlename[0] + ". " + list.lastname;
        markUp += '<tr>\
                        <td>'+list.id+'</td>\
                        <td>'+name+'</td>\
                        <td>'+list.username+'</td>\
                        <td>'+gradeList[list.grade]+'</td>\
                        <td>'+sectionList[list.section]+'</td>\
                        <td>'+status+'</td>\
                        <td>'+button+'</td>\
                   </tr>';
    })
    markUp += '</tbody></table>';
    $("#faculty-table-container").html(markUp);
    $("#faculty-table").DataTable();
}

function addFaculty(){
    facultyIdx = "";
    gradeChange(function(){
        $("#faculty-image").attr("src", "../../../../system/images/no-image-available.jpg");
        $("#add-edit-faculty-modal").modal("show");
        $("#add-edit-faculty-modal-title").text("Add Faculty");
        $("#add-edit-faculty-modal-error").text("");
    });
}

function saveFaculty(){
    if(startCapture){
        return;
    }
    var image = $("#faculty-image").attr("src");
    var id = $("#faculty-id").val();
    var firstName = $("#faculty-firstname").val();
    var middleName = $("#faculty-middlename").val();
    var lastName = $("#faculty-lastname").val();
    var userName = $("#faculty-username").val();
    var grade = $("#faculty-grade").val();
    var section = $("#faculty-section").val();
    var status = $("#faculty-status").val();
    var error = "";

    if(!image.includes("data:image/png;base64")){
        image = "";
    }

    if(id == "" || id == undefined){
        error = "*Please scan an RFID card.";
    }else if(firstName == "" || firstName == undefined){
        error = "*Firstname field should not be empty.";
    }else if(middleName == "" || middleName == undefined){
        error = "*Middlename field should not be empty.";
    }else if(lastName == "" || lastName == undefined){
        error = "*Lastname field should not be empty.";
    }else if(userName == "" || userName == undefined){
        error = "*Username field should not be empty.";
    }else if(grade == "" || grade == undefined){
        error = "*Please select grade level.";
    }else if(section == "" || section == undefined){
        error = "*Please select section.";
    }else{
        $.ajax({
            type: "POST",
            url: "save-faculty.php",
            dataType: 'html',
            data: {
                idx:facultyIdx,
                image: image,
                id: id,
                firstname:firstName,
                middlename: middleName,
                lastname: lastName,
                username: userName,
                grade:grade,
                section: section,
                status:status
            },
            success: function(response){
                var resp = response.split("*_*");
                if(resp[0] == "true"){
                    $("#add-edit-faculty-modal").modal("hide");
                    getFacultyList();
                }else if(resp[0] == "false"){
                    alert(resp[1]);
                } else{
                    alert(response);
                }
            }
        });
    }

    $("#add-edit-faculty-modal-error").text(error);
}

function edit(idx){
    facultyIdx = idx;
    $.ajax({
        type: "POST",
        url: "get-faculty-detail.php",
        dataType: 'html',
        data: {
            idx:facultyIdx
        },
        success: function(response){
            var resp = response.split("*_*");
            if(resp[0] == "true"){
                renderEditFaculty(resp[1]);
            }else if(resp[0] == "false"){
                alert(resp[1]);
            } else{
                alert(response);
            }
        }
    });
}

function renderEditFaculty(data){
    var lists = JSON.parse(data);
    lists.forEach(function(list){
        image = list.image;
        if(image == ""){
            image = "../../../../system/images/no-image-available.jpg";
        }
        $("#faculty-image").attr("src", image);
        $("#faculty-id").val(list.id);
        $("#faculty-firstname").val(list.firstname);
        $("#faculty-middlename").val(list.middlename);
        $("#faculty-lastname").val(list.lastname);
        $("#faculty-username").val(list.username);
        $("#faculty-grade").val(list.grade);
        gradeChange(function(){
            $("#faculty-section").val(list.section);
        });
        $("#faculty-status").val(list.status);
    })
    $("#add-edit-faculty-modal-error").text("");
    $("#add-edit-faculty-modal-title").text("Edit Faculty Details");
    $("#add-edit-faculty-modal").modal("show");
}

function del(idx){
    if(confirm("Are you sure you want to delete this Faculty?\nThis Action cannot be undone!")){
        $.ajax({
            type: "POST",
            url: "delete-faculty.php",
            dataType: 'html',
            data: {
                idx:idx
            },
            success: function(response){
                var resp = response.split("*_*");
                if(resp[0] == "true"){
                    getFacultyList();
                }else if(resp[0] == "false"){
                    alert(resp[1]);
                } else{
                    alert(response);
                }
            }
        });
    }
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
                        <label for="teacher-grade" class="col-form-label">Grade Level:</label>\
                        <select class="form-control" id="faculty-grade" onchange="gradeChange(function(){})">';
    lists.forEach(function(list){
        markUp += '<option value="'+list.idx+'">'+list.name+'</option>';
        gradeList[list.idx] = list.name;
    })
    markUp += '</select></div>';
    $("#grade-select-container").html(markUp);
    getSectionList();
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
    lists.forEach(function(list){
        sectionList[list.idx] = list.name;
    });
    getFacultyList();
}

function gradeChange(callback){
    var gradeFilter = $("#faculty-grade").val();
    $.ajax({
		type: "POST",
		url: "get-section-list-by-grade.php",
		dataType: 'html',
		data: {
			grade:gradeFilter
		},
		success: function(response){
			var resp = response.split("*_*");
			if(resp[0] == "true"){
				renderGradeChange(resp[1], function(){
                    callback();
                });
			}else if(resp[0] == "false"){
				alert(resp[1]);
			} else{
				alert(response);
			}
		}
	});
}

function renderGradeChange(data, callback){
    var lists = JSON.parse(data);
    var markUp = '<div class="form-group">\
                        <label for="teacher-section" class="col-form-label">Section:</label>\
                        <select class="form-control" id="faculty-section">';
    lists.forEach(function(list){
        markUp += '<option value="'+list.idx+'">'+list.name+'</option>';
        gradeList[list.idx] = list.name;
    })
    markUp += '</select></div>';
    $("#section-select-container").html(markUp);
    callback();
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

/************** Image Editor *************/
var img;
var loadImage= function(event){
	var reader = new FileReader();
	reader.onload = function(e) {
		$('#image-editor-buffer').attr('src', e.target.result);

        if(img){
            img.destroy();
        }

		img = new Croppie($('#image-editor-buffer')[0], {
			viewport: { width: 300, height: 300,type:'square'},
			boundary: { width: 400, height: 400 },
            enableOrientation: true
		});

        $('#image-editor-modal').modal('show');
		$('#image-editor-ok-btn').on('click', function() {
			img.result('base64').then(function(dataImg) {
				var data = [{ img: dataImg }, { name: 'myimage.jpg' }];
				$('#faculty-image').attr('src', dataImg);
			});
		});
	}
	reader.readAsDataURL(event.target.files[0]);
}

function imageEditorCancel(){
	if(img){
		img.destroy();
    }
}

function imageEditorRotate(){
	img.rotate(-90);
}

/************** RFID Card Reader *************/
var startCapture = false;
var cardId;
$(function() {
	$(window).keypress(function(e) {
		var ev = e || window.event;
		var key = ev.keyCode || ev.which;
        if(startCapture == false){
			cardId = "";
			startCapture = true;
			setTimeout(function(){
				startCapture = false;
			},200);
		}
		if(key == 13 && startCapture == true){
            setTimeout(function(){
                $("#faculty-id").val(cardId);
                startCapture = false;
			},200);
		}
        if(startCapture == true){
			cardId += String.fromCharCode(key);
		}
	});
});

