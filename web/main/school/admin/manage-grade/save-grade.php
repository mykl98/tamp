<?php
if($_POST){
    include_once "../../../../system/backend/config.php";

    function saveGrade($idx,$name,$status,$school){
        //return $school;
        global $conn;
        $table = "grade";
        if($idx == ""){
            $sql = "INSERT INTO `$table` (name,school,status) VALUES ('$name','$school','$status')";
        }else{
            $sql = "UPDATE `$table` SET name='$name',status='$status' WHERE idx='$idx'";
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
        $name = sanitize($_POST["name"]);
        $status = sanitize($_POST["status"]);
        $school = $_SESSION["school"];
        if(!empty($name)&&!empty($status)){
            echo saveGrade($idx,$name,$status,$school);
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