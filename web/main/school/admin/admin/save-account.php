<?php
if($_POST){
    include_once "../../../../system/backend/config.php";
    function getOldUserName($idx){
        global $conn;
        $username = "";
        $table = "account";
        $sql = "SELECT username FROM `$table` WHERE idx='$idx'";
        if($result=mysqli_query($conn,$sql)){
            if(mysqli_num_rows($result) > 0){
                $row = mysqli_fetch_array($result);
                $username = $row["username"];
            }
        }
        return $username;
    }

    function checkIfUserNameExist($username){
        global $conn;
        $table = "account";
        $sql = "SELECT idx FROM `$table` WHERE username='$username'";
        if($result=mysqli_query($conn,$sql)){
            if(mysqli_num_rows($result) > 0){
                return "Username already exist!";
            }else{
                return "true";
            }
        }else{
            return "System Error!1";
        }
    }

    function saveAccount($image,$idx,$firstName,$middleName,$lastName,$username,$school,$status){
        global $conn;
        $table = "account";
        if($idx == ""){
            $check = checkIfUserNameExist($username);
            if($check != "true"){
                return $check;
            }
            $sql = "INSERT INTO `$table` (image,firstname,middlename,lastname,username,password,access,saccess,school,status) VALUES ('$image','$firstName','$middleName','$lastName','$username','123456','school','admin','$school','$status')";
        }else{
            $oldUsername = getOldUserName($idx);
            if($oldUsername == ""){
                return "System Error!";
            }
            if($oldUsername != $username){
                $check = checkIfUserNameExist($username);
                if($check != "true"){
                    return $check;
                }
            }
            $sql = "UPDATE `$table` SET image='$image', firstname='$firstName',middlename='$middleName',lastname='$lastName',username='$username',status='$status' WHERE idx='$idx'";
        }
        if(mysqli_query($conn,$sql)){
            return "true*_*";
        }else{
            return "System Error!";
        }
    }

    session_start();
    if($_SESSION["isLoggedIn"] == "true"){
        $idx = sanitize($_POST["idx"]);
        $image = sanitize($_POST["image"]);
        $firstName = sanitize($_POST["firstname"]);
        $middleName = sanitize($_POST["middlename"]);
        $lastName = sanitize($_POST["lastname"]);
        $username = sanitize($_POST["username"]);
        $school = $_SESSION["school"];
        $status = sanitize($_POST["status"]);
        if(!empty($firstName)&&!empty($middleName)&&!empty($lastName)&&!empty($username)){
            echo saveAccount($image,$idx,$firstName,$middleName,$lastName,$username,$school,$status);
        }else{
            echo "Some required fields are blank!";
        }
    }else{
        echo "Access Denied!";
    }
}else{
    echo "Access Denied!";
}
?>