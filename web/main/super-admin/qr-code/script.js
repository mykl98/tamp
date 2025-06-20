$(document).ready(function() {
    setTimeout(function(){
        $("#qr-code-menu").attr("href","#");
        $("#qr-code-menu").addClass("active");
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

getUserDetails();

var keyIdx;
var qr;

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

function generateQR(){
    var qrText = $("#qr-text").val();
    var error = "";

    if(qrText == "" || qrText == undefined){
        error = "*QR text field should not be empty!";
    }else{
        qr = new QRious({
            element: document.getElementById('qr-container-canvas'),
            size: 300,
            padding:3,
            value: qrText
        });
    }

    $("#qr-gen-error").text(error);
}

function downloadQR(){
    var error = "";
    if(qr == null || qr == undefined){
        error = "*No QR Code to download!";
    }else{
        var qrText = $("#qr-text").val();
        var qrPng = qr.toDataURL().split(',')[1];

        var a = document.createElement("a"); //Create <a>
        a.href = "data:image/png;base64," + qrPng; //Image Base64 Goes here
        a.download = qrText+".png"; //File name Here
        a.click(); //Downloaded file
    }

    $("#qr-gen-error").text(error);
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
