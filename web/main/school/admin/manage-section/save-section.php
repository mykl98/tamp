<?php
if($_POST){
    include_once "../../../../system/backend/config.php";

    function saveSection($idx,$name,$grade,$status,$school){
        //return $school;
        global $conn;
        $table = "section";
        if($idx == ""){
            $sql = "INSERT INTO `$table` (name,grade,school,status) VALUES ('$name','$grade','$school','$status')";
        }else{
            $sql = "UPDATE `$table` SET name='$name',grade='$grade',status='$status' WHERE idx='$idx'";
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
        $grade = sanitize($_POST["grade"]);
        $status = sanitize($_POST["status"]);
        $school = $_SESSION["school"];
        if(!empty($name)&&!empty($grade)&&!empty($status)){
            echo saveSection($idx,$name,$grade,$status,$school);
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