<?php
if($_POST){
    include_once "../../../../system/backend/config.php";

    function getOldId($idx){
        global $conn;
        $id = "";
        $table = "student";
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

    function saveStudent($idx,$id,$image,$firstname,$middlename,$lastname,$fNumber,$mNumber,$gNumber,$grade,$section,$status,$school){
        global $conn;
        $table = "student";
        if($idx == ""){
            $check = checkIdIfUsed($id);
            if($check != "true"){
                return $check;
            }
            $sql = "INSERT INTO `$table` (id,image,firstname,middlename,lastname,school,grade,section,fnumber,mnumber,gnumber,status) VALUES ('$id','$image','$firstname','$middlename','$lastname','$school','$grade','$section','$fNumber','$mNumber','$gNumber','$status')";
        }else{
            $oldId = getOldId($idx);
            if($oldId != $id){
                $check = checkIdIfUsed($id);
                if($check != "true"){
                    return $check;
                }
            }
            $sql = "UPDATE `$table` SET id='$id',image='$image',firstname='$firstname',middlename='$middlename',lastname='$lastname',grade='$grade',section='$section',fnumber='$fNumber',mnumber='$mNumber',gnumber='$gNumber',status='$status' WHERE idx='$idx'";
        }

        if(mysqli_query($conn,$sql)){
            return "true*_*";
        }else{
            return "System Error!";
        }
    }

    session_start();
    if($_SESSION["isLoggedIn"] == "true"){
        $image = sanitize($_POST["image"]);
        $idx = sanitize($_POST["idx"]);
        $id = sanitize($_POST["id"]);
        $firstname = sanitize($_POST["firstname"]);
        $middlename = sanitize($_POST["middlename"]);
        $lastname = sanitize($_POST["lastname"]);
        $fNumber = sanitize($_POST["fnumber"]);
        $mNumber = sanitize($_POST["mnumber"]);
        $gNumber = sanitize($_POST["gnumber"]);
        $grade = sanitize($_POST["grade"]);
        $section = sanitize($_POST["section"]);
        $status = sanitize($_POST["status"]);
        $school = $_SESSION["school"];
        if(!empty($id)&&!empty($firstname)&&!empty($middlename)&&!empty($lastname)&&!empty($fNumber)&&!empty($grade)&&!empty($section)&&!empty($status)){
            echo saveStudent($idx,$id,$image,$firstname,$middlename,$lastname,$fNumber,$mNumber,$gNumber,$grade,$section,$status,$school);
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