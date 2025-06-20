$(document).ready(function() {
    setTimeout(function(){
        $("#manage-student-menu").attr("href","#");
        $("#manage-student-menu").addClass("active");
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

var gradeList = [];
var sectionList = [];

var studentList;
var studentIdx;
var studentName;
var attendanceName;
var table;
var page = 1;

function processingScreenModal(status){
    if(status == "show"){
        $("#processing-screen-modal").show();
    }else{
        $("#processing-screen-modal").hide();
    }
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

function getStudentList(){
    processingScreenModal("show");
    var grade = $("#grade-filter-select").val();
    var section = $("#section-filter-select").val();
    if(grade == "all"){
        section = "all";
    }
    $.ajax({
		type: "POST",
		url: "get-student-list.php",
		dataType: 'html',
		data: {
			grade:grade,
            section:section
		},
		success: function(response){
			var resp = response.split("*_*");
			if(resp[0] == "true"){
				renderStudentList(resp[1]);
			}else if(resp[0] == "false"){
				alert(resp[1]);
			} else{
				alert(response);
			}
		}
	});
}

function renderStudentList(data){
    var lists = JSON.parse(data);
    studentList = lists;
    var markUp = '<table id="student-table" class="table table-striped table-bordered table-sm">\
                        <thead>\
                            <tr>\
                                <th>ID</th>\
                                <th>Name</th>\
                                <th>Grade</th>\
                                <th>Section</th>\
                                <th>Status</th>\
                                <th style="max-width:40px;min-width:40px;width:40px;">Tools</th>\
                            </tr>\
                        </thead>\
                        <tbody>';
    lists.forEach(function(list){
        var name = list.lastname + ", " + list.firstname + " " + list.middlename[0] + ".";
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
        markUp += '<tr>\
                        <td>'+list.id+'</td>\
                        <td>'+name+'</td>\
                        <td>'+gradeList[list.grade]+'</td>\
                        <td>'+sectionList[list.section]+'</td>\
                        <td>'+status+'</td>\
                        <td>'+button+'</td>\
                   </tr>';
    })
    markUp += '</tbody></table>';
    $("#student-table-container").html(markUp);
    table = $("#student-table").DataTable();
    table.page(page).draw('page');
    processingScreenModal("hide");
}

function addStudent(){
    studentIdx = "";
    $("#add-edit-student-modal").modal("show");
    $("#add-edit-student-modal-title").text("Add New School");
    $("#add-edit-student-modal-error").text("");
    $("#student-image").attr("src","../../../../system/images/no-image-available.jpg");
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
                        <label for="student-grade" class="col-form-label">Grade Level:</label>\
                        <select class="form-control form-control-sm" id="student-grade" onchange="gradeChange()">\
                            <option value="">SELECT GRADE LEVEL</option>';
    lists.forEach(function(list){
        gradeList[list.idx] = list.name;
        markUp += '<option value="'+list.idx+'">'+list.name+'</option>';
    })
    markUp += '</select></div>';
    $("#grade-select-container").html(markUp);
    gradeChange(function(){

    });

    markUp = '<div class="input-group input-group-sm w-25 float-left">\
                    <div class="input-group-prepend"/>\
                        <span class="input-group-text bg-success">Grade</span>\
                    </div>\
                    <select class="form-control form-control-sm" id="grade-filter-select" onchange="gradeFilterChange()">';
    lists.forEach(function(list){
        markUp += '<option value="'+list.idx+'">'+list.name+'</option>';
    })
    markUp += '</select></div>';
    $("#grade-filter-container").html(markUp);
    gradeFilterChange();
}

function gradeChange(callback){
    var grade = $("#student-grade").val();
    getSectionList(grade, function(){
        callback()
    });
}

function getSectionList(grade, callback){
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
				renderSectionList(resp[1], function(){
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

function renderSectionList(data, callback){
    var lists = JSON.parse(data);
    var markUp = '<div class="form-group">\
                        <label for="student-section" class="col-form-label">Section:</label>\
                        <select class="form-control form-control-sm" id="student-section">\
                            <option value="">SELECT SECTION</option>';
    lists.forEach(function(list){
        markUp += '<option value="'+list.idx+'">'+list.name+'</option>';
    })
    markUp += '</select></div>';
    $("#section-select-container").html(markUp);
    callback();
}

function gradeFilterChange(){
    var grade = $("#grade-filter-select").val();
    if(grade != "all"){
        getSectionFilterList(grade);
    }else{
        getStudentList();
    }
}

function getSectionFilterList(grade){
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
				renderSectionFilterList(resp[1]);
			}else if(resp[0] == "false"){
				alert(resp[1]);
			} else{
				alert(response);
			}
		}
	});
}

function renderSectionFilterList(data){
    var lists = JSON.parse(data);
    markUp = '<div class="input-group input-group-sm w-25 float-left ml-2">\
                    <div class="input-group-prepend"/>\
                        <span class="input-group-text bg-success">Section</span>\
                    </div>\
                    <select class="form-control form-control-sm" id="section-filter-select" onchange="getStudentList()">\
                        <option value="all">ALL</option>';
    lists.forEach(function(list){
        sectionList[list.idx] = list.name;
        markUp += '<option value="'+list.idx+'">'+list.name+'</option>';
    })
    markUp += '</select></div>';
    $("#section-filter-container").html(markUp);
    getStudentList();
}

function edit(idx){
    page = table.page();
    studentIdx = idx;
    $.ajax({
        type: "POST",
        url: "get-student-detail.php",
        dataType: 'html',
        data: {
            idx:studentIdx
        },
        success: function(response){
            var resp = response.split("*_*");
            if(resp[0] == "true"){
                renderEditStudent(resp[1]);
            }else if(resp[0] == "false"){
                alert(resp[1]);
            } else{
                alert(response);
            }
        }
    });
}

function renderEditStudent(data){
    var lists = JSON.parse(data);
    lists.forEach(function(list){
        var image = list.image;
        if(image == ""){
            image = "../../../../system/images/no-image-available.jpg";
        }
        $("#student-image").attr("src",image);
        $("#student-id").val(list.id);
        $("#student-firstname").val(list.firstname);
        $("#student-middlename").val(list.middlename);
        $("#student-lastname").val(list.lastname);
        $("#student-fnumber").val(list.fnumber);
        $("#student-mnumber").val(list.mnumber);
        $("#student-gnumber").val(list.gnumber);
        $("#student-grade").val(list.grade);
        $("#student-status").val(list.status);
        gradeChange(function(){
            $("#student-section").val(list.section);
        })
    })
    $("#add-edit-student-modal-error").text("");
    $("#add-edit-student-modal-title").text("Edit Student Details");
    $("#add-edit-student-modal").modal("show");
}

function saveStudent(){
    if(startCapture == true){
        return;
    }
    var image = $("#student-image").attr("src");
    var id = $("#student-id").val();
    var firstname = $("#student-firstname").val();
    var middlename = $("#student-middlename").val();
    var lastname = $("#student-lastname").val();
    var fNumber = $("#student-fnumber").val();
    var mNnumber = $("#student-mnumber").val();
    var gNumber = $("#student-gnumber").val();
    var grade = $("#student-grade").val();
    var section = $("#student-section").val();
    var status = $("#student-status").val();

    if(!image.includes("data:image/png;base64")){
        image = "";
    }

    var error = "";
    if(id == "" || id == undefined){
        error = "*Please scan a ID card!";
    }else if(firstname == "" || firstname == undefined){
        error = "*Firstname field should not be empty.";
    }else if(middlename == "" || middlename == undefined){
        error = "*Middlename field should not be empty.";
    }else if(lastname == "" || lastname == undefined){
        error = "*Lastname field should not be empty.";
    }else if(fNumber == "" || fNumber == undefined){
        error = "*Fathers's phone number field should not be empty.";
    }else if(grade == "" || grade == undefined){
        error = "*Please select grade level.";
    }else if(section == "" || section == undefined){
        error = "*Please select section.";
    }else{
        $.ajax({
            type: "POST",
            url: "save-student.php",
            dataType: 'html',
            data: {
                idx:studentIdx,
                id:id,
                image:image,
                firstname:firstname,
                middlename:middlename,
                lastname:lastname,
                fnumber:fNumber,
                mnumber:mNnumber,
                gnumber:gNumber,
                grade:grade,
                section:section,
                status:status
            },
            success: function(response){
                var resp = response.split("*_*");
                if(resp[0] == "true"){
                    $("#add-edit-student-modal").modal("hide");
                    getStudentList();
                }else if(resp[0] == "false"){
                    alert(resp[1]);
                } else{
                    alert(response);
                }
            }
        });
    }

    $("#add-edit-student-modal-error").text(error);
}

function del(idx){
    if(confirm("Are you sure you want to delete this Student?\nThis Action cannot be undone!")){
        $.ajax({
            type: "POST",
            url: "delete-student.php",
            dataType: 'html',
            data: {
                idx:idx
            },
            success: function(response){
                var resp = response.split("*_*");
                if(resp[0] == "true"){
                    getStudentList();
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

function exportStudent(){
    var markUp = '<table id="temp-student-table" class="table table-striped table-bordered table-sm d-none">\
                        <thead>\
                            <tr>\
                                <th>ID</th>\
                                <th>Name</th>\
                                <th>Address</th>\
                                <th>Grade</th>\
                                <th>Section</th>\
                                <th>Status</th>\
                                <th style="max-width:50px;min-width:50px;">Action</th>\
                            </tr>\
                        </thead>\
                        <tbody>';
    studentList.forEach(function(list){
        var button = '<div class="dropdown">\
                        <button type="button" data-toggle="dropdown" class="btn btn-success btn-sm dropdown-toggle">More</button>\
                        <ul class="dropdown-menu">\
                            <li><a href="#" class="pl-2" onclick="getAttendance('+list.idx+')"><i class="fa fa-eye"></i> Attendance</a></li>\
                            <div class="dropdown-divider"></div>\
                            <li><a href="#" class="pl-2" onclick="editStudent('+list.idx+')"><i class="fa fa-pencil"></i> Edit</a></li>\
                            <div class="dropdown-divider"></div>\
                            <li><a href="#" class="pl-2" onclick="deleteStudent('+list.idx+')"><i class="fa fa-trash"></i> Delete</a></li>\
                        </ul>\
                      </div>';
        var status = list.status;
        var middlename = list.middlename;
        if(middlename != ""){
            middlename = middlename.slice(0,1) + ". ";
        }
        var name = list.lastname + ", " + list.firstname + " " + middlename + list.extention;
        if(status == "active"){
            status = '<span class="badge badge-success">Active</span>';
        }else if(status == "inactive"){
            status = '<span class="badge badge-danger">Inactive</span>';
        }
        markUp += '<tr>\
                        <td>#'+list.id+'</td>\
                        <td>'+name+'</td>\
                        <td>'+list.address+'</td>\
                        <td>'+list.grade+'</td>\
                        <td>'+list.section+'</td>\
                        <td>'+status+'</td>\
                        <td>'+button+'</td>\
                   </tr>';
    })
    markUp += '</tbody></table>';
    $("#temp-student-table-container").html(markUp);

    var currentdate = new Date();

    var table = document.getElementById('temp-student-table');

    var file = XLSX.utils.table_to_book(table, {sheet: "sheet1"});

    XLSX.write(file, { bookType: "xlsx", bookSST: true, type: 'base64' });

    XLSX.writeFile(file, currentdate.getFullYear() + "_Student_List.xlsx");
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
				$('#student-image').attr('src', dataImg);
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

/************** RFID Reader ************/
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
                $("#student-id").val(cardId);
                startCapture = false;
			},200);
		}
        if(startCapture == true){
			cardId += String.fromCharCode(key);
		}
	});
});





