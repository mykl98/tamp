<?php
if($_POST){
    include_once "../../../system/backend/config.php";
    function sendMessage($number,$message){
        global $conn;
        $table = "sms";
        $sql = "INSERT INTO `$table` (number,message) VALUES ('$number','$message')";
        if(mysqli_query($conn,$sql)){
            return "true";
        }else{
            return "System Error!";
        }
    }

    function sendNotif2($number,$message){
        return sendMessage($number,$message);
    }

    session_start();
    if($_SESSION["isLoggedIn"] == "true"){
        $number = sanitize($_POST["number"]);
        $message = sanitize($_POST["message"]);
        if(!empty($number)&&!empty($message)){
            echo sendNotif2($number,$message);
        }else{
            echo "Some required fields are empty!";
        }
    }else{
        echo "Access Denied!";
    }
}else{
    echo "Access Denied!";
}
?>