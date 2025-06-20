var updateProfileSettingsFlag = false;
var profileSettingsIdx;

$(document).ready(function(){
    getProfileSettings();
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

function getProfileSettings(){
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
                renderProfileSettings(resp[1]);
            }else if(resp[0] == "false"){
                alert(resp[1]);
            } else{
                alert(response);
            }
        }
    });
}

function renderProfileSettings(data){
    var lists = JSON.parse(data);
    lists.forEach(function(list){
        if(list.image != "" && list.image != null){
            $("#profile-settings-picture").attr("src", list.image);
            $("#global-user-image").attr("src", list.image);
        }
        $("#profile-settings-firstname").val(list.firstname);
        $("#profile-settings-middlename").val(list.middlename);
        $("#profile-settings-lastname").val(list.lastname);
        $("#profile-settings-username").val(list.username);
        var name = list.firstname + " " + list.middlename[0] + ". " + list.lastname;
        $("#global-user-name").text(name);
    })
}

function saveProfileSettings(){
    userImage = $("#profile-settings-picture").attr("src");
    firstName = $("#profile-settings-firstname").val();
    middleName = $("#profile-settings-middlename").val();
    lastName = $("#profile-settings-lastname").val();
    userUsername = $("#profile-settings-username").val();

    var error = "";
    if(firstName == "" || firstName == undefined){
        error = "*Firstname field should not be empty.";
    }else if(middleName == "" || middleName == undefined){
        error = "*Middlename field should not be empty.";
    }else if(lastName == "" || lastName == undefined){
        error = "*Lastname field should not be empty.";
    }else if(userUsername == "" || userUsername == undefined){
        error = "*Username field should not be empty.";
    }else{
        $.ajax({
            type: "POST",
            url: "save-profile-settings.php",
            dataType: 'html',
            data: {
                image: userImage,
                firstname: firstName,
                middlename: middleName,
                lastname: lastName,
                username: userUsername
            },
            success: function(response){
                var resp = response.split("*_*");
                if(resp[0] == "true"){
                    alert(resp[1]);
                    getProfileSettings();
                }else if(resp[0] == "false"){
                    alert(resp[1]);
                } else{
                    alert(response);
                }
            }
        });
    }
}

function profileChangePassword(){
    $("#change-password-modal").modal("show");
}

function clearChangePasswordModal(){
    $("#profile-setting-old-password").val("");
    $("#profile-setting-new-password").val("");
    $("#profile-setting-retype-password").val("");
}

function savePassword(){
    var error = "";
    var oldPassword = $("#profile-setting-old-password").val();
    var newPassword = $("#profile-setting-new-password").val();
    var retypePassword = $("#profile-setting-retype-password").val();

    if(oldPassword == "" || oldPassword == undefined){
        error = "*Old Password field should not be empty!";
    }else if(newPassword == "" || newPassword == undefined){
        error = "*New Password field should not be empty!";
    }else if(retypePassword == "" || retypePassword == undefined){
        error = "*Retype Password field should not be empty!";
    }else if(newPassword != retypePassword){
        error = "*New Password and Retype Password does not match, Please check!";
    }else{
        error = "";
        $.ajax({
            type: "POST",
            url: "change-password.php",
            dataType: 'html',
            data: {
                idx:profileSettingsIdx,
                old: oldPassword,
                new: newPassword,
                retype: retypePassword
            },
            success: function(response){
                clearChangePasswordModal();
                var resp = response.split("*_*");
                if(resp[0] == "true"){
                    alert(resp[1]);
                }else if(resp[0] == "false"){
                    alert(resp[1]);
                } else{
                    alert(response);
                }
            }
        });
    }

    $("#change-password-modal-error").text(error);
}

var profileImage;
var loadProfileImage= function(event){
	var reader = new FileReader();
	reader.onload = function(e) {
		$('#profile-image-editor-buffer').attr('src', e.target.result);

        if(profileImage){
            profileImage.destroy();
        }

		profileImage = new Croppie($('#profile-image-editor-buffer')[0], {
			viewport: { width: 300, height: 300,type:'square'},
			boundary: { width: 400, height: 400 },
            enableOrientation: true
		});

        $('#profile-image-editor-modal').modal('show');
		$('#profile-image-editor-ok-btn').on('click', function() {
			profileImage.result('base64').then(function(dataImg) {
				var data = [{ image: dataImg }, { name: 'myimage.jpg' }];
				$('#profile-settings-picture').attr('src', dataImg);
			});
		});
	}
	reader.readAsDataURL(event.target.files[0]);
}

function profileImageEditorCancel(){
	if(profileImage){
		profileImage.destroy();
    }
}

function profileImageEditorRotate(){
	profileImage.rotate(-90);
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