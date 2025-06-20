<?php
    if($_POST){
        include_once "../../../../system/backend/config.php";

        function saveProfileSettings($idx,$image,$firstName,$middleName,$lastName,$userName){
            global $conn;
            $table = "account";
            $sql = "UPDATE `$table` SET image='$image',firstname='$firstName',middlename='$middleName',lastname='$lastName',username='$userName' WHERE idx='$idx'";
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
            $firstName = sanitize($_POST["firstname"]);
            $middleName = sanitize($_POST["middlename"]);
            $lastName = sanitize($_POST["lastname"]);
            $userName = sanitize($_POST["username"]);
            if(!empty($image)&&!empty($firstName)&&!empty($middleName)&&!empty($lastName)&&!empty($userName)){
                echo "test";
                //echo saveProfileSettings($idx,$image,$firstName,$middleName,$lastName,$userName);
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