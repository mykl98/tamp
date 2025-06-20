$(document).ready(function() {
    setTimeout(function(){
        $("#manage-position-menu").attr("href","#");
        $("#manage-position-menu").addClass("active");
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

getPositionList();
getUserDetails();
var positionIdx;

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
    var markUp = '<table id="position-table" class="table table-striped table-bordered table-sm">\
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
                            <li><a href="#" class="pl-2" onclick="editPosition('+list.idx+')"><i class="fa fa-pencil"></i> Edit</a></li>\
                            <div class="dropdown-divider"></div>\
                            <li><a href="#" class="pl-2" onclick="deletePosition('+list.idx+')"><i class="fa fa-trash"></i> Delete</a></li>\
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
    $("#position-table-container").html(markUp);
    $("#position-table").DataTable();
}

function addPosition(){
    positionIdx = "";
    $("#add-edit-position-modal").modal("show");
    $("#add-edit-position-modal-title").text("Add New Position");
    $("#add-edit-position-modal-error").text("");
}

function savePosition(){
    var name = $("#position-name").val();
    var status = $("#position-status").val();
    var error = "";
    if(name == "" || name == undefined){
        error = "*Name field should not be empty.";
    }else{
        $.ajax({
            type: "POST",
            url: "save-position.php",
            dataType: 'html',
            data: {
                idx:positionIdx,
                name:name,
                status:status
            },
            success: function(response){
                var resp = response.split("*_*");
                if(resp[0] == "true"){
                    $("#add-edit-position-modal").modal("hide");
                    getPositionList();
                }else if(resp[0] == "false"){
                    alert(resp[1]);
                } else{
                    alert(response);
                }
            }
        });
    }

    $("#add-edit-position-modal-error").text(error);
}

function editPosition(idx){
    positionIdx = idx;
    $.ajax({
        type: "POST",
        url: "get-position-detail.php",
        dataType: 'html',
        data: {
            idx:positionIdx
        },
        success: function(response){
            var resp = response.split("*_*");
            if(resp[0] == "true"){
                renderEditPosition(resp[1]);
            }else if(resp[0] == "false"){
                alert(resp[1]);
            } else{
                alert(response);
            }
        }
    });
}

function renderEditPosition(data){
    var lists = JSON.parse(data);
    lists.forEach(function(list){
        $("#position-name").val(list.name);
        $("#position-status").val(list.status);
    })
    $("#add-edit-position-modal-error").text("");
    $("#add-edit-position-modal-title").text("Edit Position Details");
    $("#add-edit-position-modal").modal("show");
}

function deletePosition(idx){
    if(confirm("Are you sure you want to delete this Position?\nThis Action cannot be undone!")){
        $.ajax({
            type: "POST",
            url: "delete-position.php",
            dataType: 'html',
            data: {
                idx:idx
            },
            success: function(response){
                var resp = response.split("*_*");
                if(resp[0] == "true"){
                    getPositionList();
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

