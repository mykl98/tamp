<?php
if($_POST){
    include_once "../../../system/backend/config.php";
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
            return "System Error!";
        }
    }

    function getOldId($idx){
        global $conn;
        $id = "";
        $table = "account";
        $sql = "SELECT id FROM `$table` WHERE idx='$idx'";
        if($result=mysqli_query($conn,$sql)){
            if(mysqli_num_rows($result) > 0){
                $row = mysqli_fetch_array($result);
                $id = $row["id"];
            }
        }
        return $id;
    }

    function checkIdIfUsed($id){
        global $conn;
        $table = "account";
        $sql = "SELECT idx FROM `$table` WHERE id='$id'";
        if($result=mysqli_query($conn,$sql)){
            if(mysqli_num_rows($result) > 0){
                return "This RFID card is already been used in the system!";
            }else{
                $table = "student";
                $sql = "SELECT idx FROM `$table` WHERE id='$id'";
                if($result=mysqli_query($conn,$sql)){
                    if(mysqli_num_rows($result) > 0){
                        return "This RFID card is already been used in the system!";
                    }else{
                        return "true";
                    }
                }else{
                    return "System Error!";
                }
            }
        }else{
            return "System Error!";
        }
    }

    function saveAccount($idx,$firstName,$middleName,$lastName,$username,$status){
        global $conn;
        $table = "account";

        if($idx == ""){
            $check = checkIfUserNameExist($username);
            if($check != "true"){
                return $check;
            }
            $sql = "INSERT INTO `$table` (firstname,middlename,lastname,username,password,access,saccess,status) VALUES ('$firstName','$middleName','$lastName','$username','123456','school','admin','$status')";
            
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
            $sql = "UPDATE `$table` SET firstname='$firstName',middlename='$middleName',lastname='$lastName',username='$username',access='school',saccess='admin',status='$status' WHERE idx='$idx'";
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
        $firstName = sanitize($_POST["firstname"]);
        $middleName = sanitize($_POST["middlename"]);
        $lastName = sanitize($_POST["lastname"]);
        $username = sanitize($_POST["username"]);
        $status = sanitize($_POST["status"]);
        
        if(!empty($firstName)&&!empty($middleName)&&!empty($lastName)&&!empty($username)&&!empty($status)){
            echo saveAccount($idx,$firstName,$middleName,$lastName,$username,$status);
        }else{
            echo "Network Error!";
        }
    }else{
        echo "Access Denied!";
    }
}else{
    echo "Access Denied!";
}
?>