<?php
if($_POST){
    include_once "system/backend/config.php";
    $username = sanitize($_POST["username"]);
    $password = sanitize($_POST["password"]);

    global $conn;
    $table = "account";
    $sql = "SELECT * FROM `$table` WHERE username='$username' && password='$password' && status='active'";
    if($result=mysqli_query($conn,$sql)){
        if(mysqli_num_rows($result) > 0){
            $row = mysqli_fetch_array($result);
            $idx = $row["idx"];
            $access = $row["access"];
            $saccess = $row["saccess"];
            $section = $row["section"];
            session_start();
            $_SESSION["isLoggedIn"] = "true";
            $_SESSION["access"] = $access;
            $_SESSION["saccess"] = $saccess;
            $_SESSION["loginidx"] = $idx;
            $_SESSION["section"] = $section;
            $error = "true";
        }else{
            $error = "*Username or Password is invalid!";
        }
    }else{
        $error = "*System Error!";
    }
    echo $error;
}
?>