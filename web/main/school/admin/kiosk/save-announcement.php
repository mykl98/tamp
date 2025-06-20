<?php
if($_POST){
    include_once "../../../../system/backend/config.php";

    function saveAnnouncement($idx,$school,$text,$status){
        //return $idx;
        global $conn;
        $table = "announcement";
        if($idx == ""){
            $sql = "INSERT INTO `$table` (school,announcement,status) VALUES ('$school','$text','$status')";
        }else{
            $sql = "UPDATE `$table` SET announcement='$text',status='$status' WHERE idx='$idx'";
        }
        if(mysqli_query($conn,$sql)){
            return "true*_*";
        }else{
            return "System Error!";
        }
    }

    session_start();
    if($_SESSION["isLoggedIn"] == "true"){
        $school = $_SESSION["school"];
        $idx = sanitize($_POST["idx"]);
        $text = sanitize($_POST["text"]);
        $status = sanitize($_POST["status"]);
        if(!empty($text)&&!empty($status)){
            echo saveAnnouncement($idx,$school,$text,$status);
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