<?php
if($_POST){
    include_once "../../../../system/backend/config.php";

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

    function saveStaff($idx,$image,$id,$firstName,$middleName,$lastName,$position,$status,$school){
        global $conn;
        $table = "account";
        if($idx == ""){
            $check = checkIfIdExist($id);
            if($check != "true"){
                return $check;
            }
            $sql = "INSERT INTO `$table` (image,id,firstname,middlename,lastname,status,access,saccess,school) VALUES ('$image','$id','$firstName','$middleName','$lastName','$status','school','$position','$school')";
        }else{
            $oldId = getOldId($idx);
            if($oldId != $id){
                $check = checkIfIdExist($id);
                if($check != "true"){
                    return $check;
                }
            }
            $sql = "UPDATE `$table` SET image='$image',id='$id',firstname='$firstName',middlename='$middleName',lastname='$lastName',saccess='$position',status='$status' WHERE idx='$idx'";
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
        $id = sanitize($_POST["id"]);
        $image = sanitize($_POST["image"]);
        $firstName = sanitize($_POST["firstname"]);
        $middleName = sanitize($_POST["middlename"]);
        $lastName = sanitize($_POST["lastname"]);
        $position = sanitize($_POST["position"]);
        $status = sanitize($_POST["status"]);
        $school = $_SESSION["school"];
        if(!empty($id)&&!empty($firstName)&&!empty($middleName)&&!empty($lastName)&&!empty($position)){
            echo saveStaff($idx,$image,$id,$firstName,$middleName,$lastName,$position,$status,$school);
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