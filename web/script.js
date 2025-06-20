var error;

function login(){
    var username = $("#username").val();
    var password = $("#password").val();
    error = "";

    if(username == "" || username == undefined){
        error = "*Username field should not be empty!";
    }else if(password == "" || password == undefined){
        error = "*Password field should not be empty!";
    }else{
        error = "Logging you in Please wait!...";
        $.ajax({
            type: "POST",
            url: "check-login.php",
            dataType: 'html',
            data: {
                username:username,
                password:password
            },
            success: function(response){
                console.log(response);
                if(response == "true"){
                    window.open("main/index.php","_self")
                }else{
                    $("#login-form-error").text(response);  
                }
            }
        });
    }
    if(error != ""){
        $("#login-form-error").text(error);   
    }
}

function onTyping(){
    if(error){
        $("#login-form-error").text("");   
    }
}

$(document).ready(function(){
    $('#checkbox').click(function(){
        $(this).is(':checked') ? $('#password').attr('type', 'text') : $('#password').attr('type', 'password');
    });

    setTimeout(function(){
        $("#splash-screen").addClass("d-none");
        $("#login-screen").removeClass("d-none");
    },3000);
});