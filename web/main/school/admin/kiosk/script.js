$(document).ready(function() {
    setTimeout(function(){
        $("#kiosk-menu").attr("href","#");
        $("#kiosk-menu").addClass("active");
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

getAnnouncementList();
getUserDetails();

var announcementIdx;

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

function getAnnouncementList(){
    $.ajax({
		type: "POST",
		url: "get-announcement-list.php",
		dataType: 'html',
		data: {
			dummy:"dummy"
		},
		success: function(response){
			var resp = response.split("*_*");
			if(resp[0] == "true"){
				renderAnnouncementList(resp[1]);
			}else if(resp[0] == "false"){
				alert(resp[1]);
			} else{
				alert(response);
			}
		}
	});
}

function renderAnnouncementList(data){
    var lists = JSON.parse(data);
    var markUp = '<table id="announcement-table" class="table table-striped table-bordered table-sm">\
                        <thead>\
                            <tr>\
                                <th>Announcement</th>\
                                <th>Status</th>\
                                <th style="max-width:50px;min-width:50px;"></th>\
                            </tr>\
                        </thead>\
                        <tbody>';
    lists.forEach(function(list){
        var status = list.status;
        var button = '<div class="dropdown">\
                        <button type="button" data-toggle="dropdown" class="btn btn-success btn-sm dropdown-toggle">More</button>\
                        <ul class="dropdown-menu">\
                            <li><a href="#" class="pl-2" onclick="editAnnouncement('+list.idx+')"><i class="fa fa-pencil"></i> Edit</a></li>\
                            <div class="dropdown-divider"></div>\
                            <li><a href="#" class="pl-2" onclick="deleteAnnouncement('+list.idx+')"><i class="fa fa-trash"></i> Delete</a></li>\
                        </ul>\
                      </div>';
        if(status == "active"){
            status = '<span class="badge badge-success">Active</span>';
        }else if(status == "inactive"){
            status = '<span class="badge badge-danger">Inactive</span>';
        }
        markUp += '<tr>\
                        <td>'+list.announcement+'</td>\
                        <td>'+status+'</td>\
                        <td>'+button+'</td>\
                   </tr>';
    })
    markUp += '</tbody></table>';
    $("#announcement-table-container").html(markUp);
    $("#announcement-table").DataTable();
}

function addAnnouncement(){
    announcementIdx = "";
    $("#add-edit-announcement-modal-title").text("Add New Announcement");
    $("#add-edit-announcement-modal").modal("show");
    $("#save-announcement-error").text("");
}

function saveAnnouncement(){
    var text = $("#announcement-text").val();
    var status = $("#announcement-status").val();

    var error = "";
    if(text == "" || text == undefined){
        error = "*Announcement field should not be empty!";
    }else{
        $.ajax({
            type: "POST",
            url: "save-announcement.php",
            dataType: 'html',
            data: {
                idx:announcementIdx,
                text:text,
                status:status
            },
            success: function(response){
                var resp = response.split("*_*");
                if(resp[0] == "true"){
                    $("#add-edit-announcement-modal").modal("hide");
                    getAnnouncementList();
                }else if(resp[0] == "false"){
                    alert(resp[1]);
                } else{
                    alert(response);
                }
            }
        });
    }

    $("#save-announcement-error").text(error);
}

function editAnnouncement(idx){
    announcementIdx = idx;
    $.ajax({
        type: "POST",
        url: "get-announcement-detail.php",
        dataType: 'html',
        data: {
            idx:announcementIdx
        },
        success: function(response){
            var resp = response.split("*_*");
            if(resp[0] == "true"){
                renderEditAnnouncement(resp[1]);
            }else if(resp[0] == "false"){
                alert(resp[1]);
            } else{
                alert(response);
            }
        }
    });
}

function renderEditAnnouncement(data){
    var lists = JSON.parse(data);

    lists.forEach(function(list){
        $("#announcement-text").val(list.text);
        $("#announcement-status").val(list.status);
    })
    $("#add-edit-announcement-modal-title").text("Edit Announcement Details");
    $("#save-announcement-error").text("");
    $("#add-edit-announcement-modal").modal("show");
}

function deleteAnnouncement(idx){
    if(confirm("Are you sure you want to delete this Announcement?\nThis Action cannot be undone!")){
        $.ajax({
            type: "POST",
            url: "delete-announcement.php",
            dataType: 'html',
            data: {
                idx:idx
            },
            success: function(response){
                var resp = response.split("*_*");
                if(resp[0] == "true"){
                    getAnnouncementList();
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

