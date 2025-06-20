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
    

    function sendNotif1Activity($school,$student,$activity){
        global $conn;
        $table = "student";
        $sql = "SELECT firstname,fnumber,mnumber,gnumber FROM `$table` WHERE idx='$student'";
        if($result=mysqli_query($conn,$sql)){
            if(mysqli_num_rows($result) > 0){
                $row = mysqli_fetch_array($result);
                $firstName = $row["firstname"];
                $time = date("g:i:s a");
                $date = date("Y-m-d");
                if($activity == "logout"){
                    $message = "[SYSTEM][Test LOGOUT Notification][".$date."] Your child ".$firstName." left school at ".$time;
                }else{
                    $message = "[SYSTEM][Test LOGIN Notification][".$date."]Your child ".$firstName." entered school at ".$time;
                }
                            
                $fNumber = $row["fnumber"];
                $mNumber = $row["mnumber"];
                $gNumber = $row["gnumber"];
                $flag = false;
                if($fNumber && strlen($fNumber) == 11){
                    $send = sendMessage($fNumber,$message);
                    if($send != "true"){
                        return $send;
                    }
                    $flag = true;
                }
                if($mNumber && strlen($mNumber) == 11){
                    $send = sendMessage($mNumber,$message);
                    if($send != "true"){
                        return $send;
                    }
                    $flag = true;
                }
                if($gNumber && strlen($gNumber) == 11){
                    $send = sendMessage($gNumber,$message);
                    if($send != "true"){
                        return $send;
                    }
                    $flag = true;
                }
                if($flag){
                    return "true*_*";
                }else{
                    return "No registered phone number to send to!";
                }
            }else{
                return "No registered phone number to send to!";
            }
        }else{
            return "System Error!";
        }
    }

    session_start();
    if($_SESSION["isLoggedIn"] == "true"){
        $school = sanitize($_POST["school"]);
        $student = sanitize($_POST["student"]);
        $activity = sanitize($_POST["activity"]);
        if(!empty($school)&&!empty($student)&&!empty($activity)){
            echo sendNotif1Activity($school,$student,$activity);
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