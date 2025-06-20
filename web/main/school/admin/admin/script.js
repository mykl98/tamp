$(document).ready(function() {
    setTimeout(function(){
        $("#admin-menu").attr("href","#");
        $("#admin-menu").addClass("active");
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

getAccountList();
getUserDetails();

var accountIdx;
var attendanceName;

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

function getAccountList(){
    $.ajax({
		type: "POST",
		url: "get-account-list.php",
		dataType: 'html',
		data: {
			dummy:"dummy"
		},
		success: function(response){
			var resp = response.split("*_*");
			if(resp[0] == "true"){
				renderAccountList(resp[1]);
			}else if(resp[0] == "false"){
				alert(resp[1]);
			} else{
				alert(response);
			}
		}
	});
}

function renderAccountList(data){
    var lists = JSON.parse(data);
    var markUp = '<table id="manage-account-table" class="table table-striped table-bordered table-sm">\
                        <thead>\
                            <tr>\
                                <th>Name</th>\
                                <th>Username</th>\
                                <th>Status</th>\
                                <th style="max-width:40px;min-width:40px;width:40px;">Tools</th>\
                            </tr>\
                        </thead>\
                        <tbody>';
    lists.forEach(function(list){
        var status = list.status;
        var button = '<div class="dropdown">\
                        <button type="button" data-toggle="dropdown" class="btn btn-success btn-sm dropdown-toggle">More</button>\
                        <ul class="dropdown-menu">\
                            <li><a href="#" class="pl-2" onclick="edit('+list.idx+')"><i class="fa fa-pencil"></i> Edit</a></li>\
                            <div class="dropdown-divider"></div>\
                            <li><a href="#" class="pl-2" onclick="del('+list.idx+')"><i class="fa fa-trash"></i> Delete</a></li>\
                        </ul>\
                      </div>';

        if(status == "active"){
            status = '<span class="badge badge-success">Active</span>';
        }else if(status == "inactive"){
            status = '<span class="badge badge-danger">Inactive</span>';
        }
        var name = list.firstname + " " + list.middlename.charAt(0) + ". " + list.lastname;
        markUp += '<tr>\
                        <td>'+name+'</td>\
                        <td>'+list.username+'</td>\
                        <td>'+status+'</td>\
                        <td>'+button+'</td>\
                   </tr>';
    })
    markUp += '</tbody></table>';
    $("#manage-account-table-container").html(markUp);
    $("#manage-account-table").DataTable();
}

function add(){
    accountIdx = "";
    $("#account-image").attr("src", "../../../../system/images/no-image-available.jpg");
    $("#add-edit-account-modal").modal("show");
    $("#save-account-error").text("");
}

function save(){
    var image = $("#account-image").attr("src");
    var firstName = $("#account-firstname").val();
    var middleName = $("#account-middlename").val();
    var lastName = $("#account-lastname").val();
    var username = $("#account-username").val();
    var status = $("#account-status").val();

    if(!image.includes("data:image/png;base64")){
        image = "";
    }

    var error = "";
    if(firstName == "" || firstName == undefined){
        error = "*Firstname field should not be empty.";
    }else if(middleName == "" || middleName == undefined){
        error = "*Middlename field should not be empty.";
    }else if(lastName == "" || lastName == undefined){
        error = "*Lastname field should not be empty.";
    }else if(username == "" || username == undefined){
        error = "*Username field should not be empty.";
    }else{
        $.ajax({
            type: "POST",
            url: "save-account.php",
            dataType: 'html',
            data: {
                idx:accountIdx,
                image:image,
                firstname:firstName,
                middlename:middleName,
                lastname:lastName,
                username:username,
                status:status
            },
            success: function(response){
                var resp = response.split("*_*");
                if(resp[0] == "true"){
                    $("#add-edit-account-modal").modal("hide");
                    getAccountList();
                }else if(resp[0] == "false"){
                    alert(resp[1]);
                } else{
                    alert(response);
                }
            }
        });
    }

    $("#save-account-error").text(error);
}

function edit(idx){
    accountIdx = idx;
    $.ajax({
        type: "POST",
        url: "get-account-detail.php",
        dataType: 'html',
        data: {
            idx:idx
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
        var image = list.image;
        if(!image){
            image = "../../../../system/images/no-image-available.jpg";
        }
        $("#account-image").attr("src", image);
        $("#account-id").val(list.id);
        $("#account-firstname").val(list.firstname);
        $("#account-middlename").val(list.middlename);
        $("#account-lastname").val(list.lastname);
        $("#account-username").val(list.username);
        $("#account-status").val(list.status);
    })
    $("#add-edit-account-modal-title").text("Edit Account Details");
    $("#save-account-error").text("");
    $("#add-edit-account-modal").modal("show");
}

function del(idx){
    if(confirm("Are you sure you want to delete this Account?\nThis Action cannot be undone!")){
        $.ajax({
            type: "POST",
            url: "delete-account.php",
            dataType: 'html',
            data: {
                idx:idx
            },
            success: function(response){
                var resp = response.split("*_*");
                if(resp[0] == "true"){
                    getAccountList();
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
				$('#account-image').attr('src', dataImg);
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

