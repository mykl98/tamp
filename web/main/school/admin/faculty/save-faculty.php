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

    function checkIfIdExist($id){
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

    function saveFaculty($idx,$image,$id,$firstName,$middleName,$lastName,$userName,$grade,$section,$status,$school){
        global $conn;
        $table = "account";
        if($idx == ""){
            $check = checkIfIdExist($id);
            if($check != "true"){
                return $check;
            }
            $check = checkIfUserNameExist($userName);
            if($check != "true"){
                return $check;
            }
            $sql = "INSERT INTO `$table` (image,id,firstname,middlename,lastname,username,password,grade,section,status,access,saccess,school) VALUES ('$image','$id','$firstName','$middleName','$lastName','$userName','123456','$grade','$section','$status','school','faculty','$school')";
        }else{
            $oldId = getOldId($idx);
            if($oldId != $id){
                $check = checkIfIdExist($id);
                if($check != "true"){
                    return $check;
                }
            }
            $oldUsername = getOldUserName($idx);
            if($oldUsername != $userName){
                $check = checkIfUserNameExist($userName);
                if($check != "true"){
                    return $check;
                }
            }
            $sql = "UPDATE `$table` SET image='$image',id='$id',firstname='$firstName',middlename='$middleName',lastname='$lastName',username='$userName',grade='$grade',section='$section',status='$status' WHERE idx='$idx'";
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
        $id = sanitize($_POST["id"]);
        $firstName = sanitize($_POST["firstname"]);
        $middleName = sanitize($_POST["middlename"]);
        $lastName = sanitize($_POST["lastname"]);
        $userName = sanitize($_POST["username"]);
        $grade = sanitize($_POST["grade"]);
        $section = sanitize($_POST["section"]);
        $status = sanitize($_POST["status"]);
        $school = $_SESSION["school"];
        if(!empty($id)&&!empty($firstName)&&!empty($middleName)&&!empty($lastName)&&!empty($userName)&&!empty($grade)&&!empty($section)){
            echo saveFaculty($idx,$image,$id,$firstName,$middleName,$lastName,$userName,$grade,$section,$status,$school);
        }else{
            echo "Some or all of the required fields are messing!";
        }
    }else{
        echo "Access Denied!";
    }
}else{
    echo "Access Denied!";
}
?>