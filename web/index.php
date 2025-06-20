<?php
    include_once "system/backend/config.php";
    
    $table = "school";
    $sql = "SELECT status FROM `$table` WHERE status='inactive'";
    if($result=mysqli_query($conn, $sql)){
        if(mysqli_num_rows($result) > 0){
            session_start();
            session_destroy();
            header("location: system-disabled.html");
            exit();
        }
    }
?>

<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="description" content="">
    <meta name="author" content="">
    <meta name="keywords" content="">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">

    <!--Meta Responsive tag-->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!--Bootstrap CSS-->
    <link rel="stylesheet" href="system/plugin/bootstrap/css/bootstrap.min.css">

    <title>DMDTech Offline RFID Security System</title>
    <link rel="icon" type="image/x-icon" href="system/images/favicon.ico">

    <style>
        .full-screen-image {
            height: 100vh;
            width: 100vw;
            object-fit: cover; /* crops image to fit */
            object-position: top; /* centers the cropped image */
        }
        .splash{
            object-position: center;
        }
        .overlay-content {
            position: absolute;
            top: 50%;
            left: 20%;
            transform: translate(-20%, -50%);
            color: white;
            z-index: 2;
        }
        .dmdtech{
            background-color:#000000;
            color: white;
        }
    </style>
  </head>

  <body class="m-0 p-0">
    
    <!-- Splash Screen -->
    <div id="splash-screen">
        <img src="system/images/splash-screen.png" class="full-screen-image splash"/>
    </div>

    <!-- Login Screen -->
    <div id="login-screen" class="d-none">
        <img src="system/images/login-screen.png" class="full-screen-image"/>

        <div class="overlay-content">
            <div class="bg-secondary p-4 rounded">
                <h3 class="mb-2">Login</h3>
                <small>Sign in with your credentials</small>
                <div class="input-group my-2">
                    <div class="input-group-prepend">
                        <span class="input-group-text">🧑‍💼</span>
                    </div>
                    <input type="text" id="username" class="form-control mt-0" placeholder="Username" onKeyUp="onTyping()">
                </div>

                <div class="input-group mb-3">
                    <div class="input-group-prepend">
                        <span class="input-group-text">🔒</span>
                    </div>
                    <input type="password" id="password" class="form-control mt-0" placeholder="Password" onKeyUp="onTyping()">
                </div>

                <div class="input-group mb-3">
                    <input type="checkbox" id="checkbox"> &nbsp; Show Password?
                </div>

                <div class="form-group">
                    <small class="text-danger font-italic" id="login-form-error"></small>
                    <button class="btn dmdtech w-100" type="submit" onclick="login()">Login</button>
                </div>
            </div>
        </div>
    </div>

    <!--Login Wrapper-->

    <!-- Page JavaScript Files-->
    <script src="system/plugin/jquery/js/jquery.min.js"></script>
    <!--Popper JS-->
    <script src="system/plugin/popper/js/popper.min.js"></script>
    <!--Bootstrap-->
    <script src="system/plugin/bootstrap/js/bootstrap.min.js"></script>

    <!--Custom Js Script-->
    <script src="script.js"></script>
    <!--Custom Js Script-->
  </body>
</html>