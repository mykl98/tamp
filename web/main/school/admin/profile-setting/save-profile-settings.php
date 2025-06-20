<?php
    if($_POST){
        include_once "../../../../system/backend/config.php";

        function saveProfileSettings($idx,$image,$firstname,$middlename,$lastname,$username){
            global $conn;
            $table = "account";
            $sql = "UPDATE `$table` SET image='$image',firstname='$firstname',middlename='$middlename',lastname='$lastname',username='$username' WHERE idx='$idx'";
            if(mysqli_query($conn,$sql)){
                return "true*_*Successfully updated your profile.";
            }else{
                return "System Error!";
            }
        }

        session_start();
        if($_SESSION["isLoggedIn"] == "true"){
            $idx = $_SESSION["loginidx"];
            $image = sanitize($_POST["image"]);
            $firstname = sanitize($_POST["firstname"]);
            $middlename = sanitize($_POST["middlename"]);
            $lastname = sanitize($_POST["lastname"]);
            $username = sanitize($_POST["username"]);
            if(!empty($image)&&!empty($firstname)&&!empty($middlename)&&!empty($lastname)&&!empty($username)){
                echo saveProfileSettings($idx,$image,$firstname,$middlename,$lastname,$username);
            }else{
                echo "Some required fields are missing!";
            }
        }else{
            echo "Access Denied!";
        }
    }else{
        echo "Access Denied!";
    }
?>