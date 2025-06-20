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
    

    function sendNotif2Activity($number,$activity){
        $firstName = "Test Student";
        $time = date("g:i:s a");
        $date = date("Y-m-d");
        if($activity == "logout"){
            $message = "[SYSTEM][Test LOGOUT Notification][".$date."] Your child ".$firstName." left school at ".$time;
        }else{
            $message = "[SYSTEM][Test LOGIN Notification][".$date."]Your child ".$firstName." entered school at ".$time;
        }

        return sendMessage($number,$message);
    }

    session_start();
    if($_SESSION["isLoggedIn"] == "true"){
        $number = sanitize($_POST["number"]);
        $activity = sanitize($_POST["activity"]);
        if(!empty($number)&&!empty($activity)){
            echo sendNotif2Activity($number,$activity);
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