$(document).ready(function() {
    setTimeout(function(){
        $("#manage-account-menu").attr("href","#");
        $("#manage-account-menu").addClass("active");
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

getAccountList();
getUserDetails();
var accountIdx;

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

function getAccountList(){
    processingModalShow();
    $.ajax({
		type: "POST",
		url: "get-account-list.php",
		dataType: 'html',
		data: {
			dummy:"dummy"
		},
		success: function(response){
            setTimeout(function(){
            }, 1000);
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
                                <th style="max-width:50px;min-width:50px;"></th>\
                            </tr>\
                        </thead>\
                        <tbody>';
    lists.forEach(function(list){
        var button = '<div class="dropdown">\
                        <button type="button" data-toggle="dropdown" class="btn btn-success btn-sm dropdown-toggle">More</button>\
                        <ul class="dropdown-menu">\
                            <li><a href="#" class="pl-2" onclick="editAccount('+list.idx+')"><i class="fa fa-pencil"></i> Edit</a></li>\
                            <div class="dropdown-divider"></div>\
                            <li><a href="#" class="pl-2" onclick="deleteAccount('+list.idx+')"><i class="fa fa-trash"></i> Delete</a></li>\
                        </ul>\
                      </div>';
        var status = list.status;
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
    processingModalHide();
}

function addAccount(){
    accountIdx = "";
    $("#add-edit-account-modal").modal("show");
    $("#save-account-error").text("");
}

function saveAccount(){
    var firstName = $("#account-firstname").val();
    var middleName = $("#account-middlename").val();
    var lastName = $("#account-lastname").val();
    var username = $("#account-username").val();
    var status = $("#account-status").val();

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
                firstname: firstName,
                middlename: middleName,
                lastname: lastName,
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

function editAccount(idx){
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
                renderEditAccount(resp[1]);
            }else if(resp[0] == "false"){
                alert(resp[1]);
            } else{
                alert(response);
            }
        }
    });
}

function renderEditAccount(data){
    var lists = JSON.parse(data);
    lists.forEach(function(list){
        $("#account-firstname").val(list.firstname);
        $("#account-middlename").val(list.middlename);
        $("#account-lastname").val(list.lastname);
        $("#account-username").val(list.username);
        $("#account-status").val(list.status);
    });
    $("#add-edit-account-modal-title").text("Edit Account Details");
    $("#save-account-error").text("");
    $("#add-edit-account-modal").modal("show");
}

function deleteAccount(idx,name){
    if(confirm("Are you sure you want to delete this Account?\nThis Action cannot be undone!")){
        $.ajax({
            type: "POST",
            url: "delete-account.php",
            dataType: 'html',
            data: {
                idx:idx,
                name:name
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

function processingModalShow(){
    $("#processing-screen-modal").show();
}

function processingModalHide(){
    $("#processing-screen-modal").hide();
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
