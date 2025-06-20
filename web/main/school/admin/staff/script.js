$(document).ready(function() {
    setTimeout(function(){
        $("#staff-menu").attr("href","#");
        $("#staff-menu").addClass("active");
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
getPositionList();
var StaffIdx;
var positionList = [];

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

function getStaffList(){
    $.ajax({
		type: "POST",
		url: "get-staff-list.php",
		dataType: 'html',
		data: {
			dummy:"dummy"
		},
		success: function(response){
			var resp = response.split("*_*");
			if(resp[0] == "true"){
				renderStaffList(resp[1]);
			}else if(resp[0] == "false"){
				alert(resp[1]);
			} else{
				alert(response);
			}
		}
	});
}

function renderStaffList(data){
    var lists = JSON.parse(data);
    var markUp = '<table id="table" class="table table-striped table-bordered table-sm">\
                        <thead>\
                            <tr>\
                                <th>ID</th>\
                                <th>Name</th>\
                                <th>Position</th>\
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
                        <td>'+positionList[list.saccess]+'</td>\
                        <td>'+status+'</td>\
                        <td>'+button+'</td>\
                   </tr>';
    })
    markUp += '</tbody></table>';
    $("#table-container").html(markUp);
    $("#table").DataTable();
}

function add(){
    staffIdx = "";
    $("#staff-image").attr("src", "../../../../system/images/no-image-available.jpg");
    $("#add-edit-modal").modal("show");
    $("#add-edit-modal-title").text("Add Staff");
    $("#add-edit-modal-error").text("");
}

function save(){
    if(startCapture){
        return;
    }
    var image = $("#staff-image").attr("src");
    var id = $("#staff-id").val();
    var firstName = $("#staff-firstname").val();
    var middleName = $("#staff-middlename").val();
    var lastName = $("#staff-lastname").val();
    var position = $("#staff-position").val();
    var status = $("#staff-status").val();
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
    }else if(position == "" || position == undefined){
        error = "*Please select position.";
    }else{
        $.ajax({
            type: "POST",
            url: "save-staff.php",
            dataType: 'html',
            data: {
                idx:staffIdx,
                image: image,
                id: id,
                firstname:firstName,
                middlename: middleName,
                lastname: lastName,
                position: position,
                status:status
            },
            success: function(response){
                var resp = response.split("*_*");
                if(resp[0] == "true"){
                    $("#add-edit-modal").modal("hide");
                    getStaffList();
                }else if(resp[0] == "false"){
                    alert(resp[1]);
                } else{
                    alert(response);
                }
            }
        });
    }

    $("#add-edit-modal-error").text(error);
}

function edit(idx){
    staffIdx = idx;
    $.ajax({
        type: "POST",
        url: "get-staff-detail.php",
        dataType: 'html',
        data: {
            idx:staffIdx
        },
        success: function(response){
            var resp = response.split("*_*");
            if(resp[0] == "true"){
                renderEdit(resp[1]);
            }else if(resp[0] == "false"){
                alert(resp[1]);
            } else{
                alert(response);
            }
        }
    });
}

function renderEdit(data){
    var lists = JSON.parse(data);
    lists.forEach(function(list){
        image = list.image;
        if(image == ""){
            image = "../../../../system/images/no-image-available.jpg";
        }
        $("#staff-image").attr("src", image);
        $("#staff-id").val(list.id);
        $("#staff-firstname").val(list.firstname);
        $("#staff-middlename").val(list.middlename);
        $("#staff-lastname").val(list.lastname);
        $("#staff-position").val(list.saccess);
        $("#staff-status").val(list.status);
    })
    $("#add-edit-modal-error").text("");
    $("#add-edit-modal-title").text("Edit Staff Details");
    $("#add-edit-modal").modal("show");
}

function del(idx){
    if(confirm("Are you sure you want to delete this Staff?\nThis Action cannot be undone!")){
        $.ajax({
            type: "POST",
            url: "delete-staff.php",
            dataType: 'html',
            data: {
                idx:idx
            },
            success: function(response){
                var resp = response.split("*_*");
                if(resp[0] == "true"){
                    getStaffList();
                }else if(resp[0] == "false"){
                    alert(resp[1]);
                } else{
                    alert(response);
                }
            }
        });
    }
}

function getPositionList(){
    $.ajax({
		type: "POST",
		url: "get-position-list.php",
		dataType: 'html',
		data: {
			dummy:"dummy"
		},
		success: function(response){
			var resp = response.split("*_*");
			if(resp[0] == "true"){
				renderPositionList(resp[1]);
			}else if(resp[0] == "false"){
				alert(resp[1]);
			} else{
				alert(response);
			}
		}
	});
}

function renderPositionList(data){
    var lists = JSON.parse(data);
    var markUp = '<div class="form-group">\
                        <label for="staff-position" class="col-form-label">Position:</label>\
                        <select class="form-control" id="staff-position">';
    lists.forEach(function(list){
        markUp += '<option value="'+list.idx+'">'+list.name+'</option>';
        positionList[list.idx] = list.name;
    })
    markUp += '</select></div>';
    $("#position-select-container").html(markUp);
    getStaffList();
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
				$('#staff-image').attr('src', dataImg);
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
                $("#staff-id").val(cardId);
                startCapture = false;
			},200);
		}
        if(startCapture == true){
			cardId += String.fromCharCode(key);
		}
	});
});

