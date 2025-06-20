<?php
if($_POST){
    include_once "../../../../system/backend/config.php";

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

    function sendBroadcast($school,$message,$grade,$section){
        global $conn;
        $table = "student";
        $sql = "SELECT fnumber,mnumber,gnumber FROM `$table` WHERE school='$school' && grade='$grade' && section='$section' && status='active'";
        if($result=mysqli_query($conn,$sql)){
            if(mysqli_num_rows($result) > 0){
                while($row=mysqli_fetch_array($result)){
                    $fNumber = $row["fnumber"];
                    $mNumber = $row["mnumber"];
                    $gNumber = $row["gnumber"];

                    if($fNumber && strlen($fNumber) == 11){
                        $send = sendMessage($fNumber,$message);
                        if($send != "true"){
                            return $send;
                        }
                    }
                    if($mNumber && strlen($mNumber) == 11){
                        $send = sendMessage($mNumber,$message);
                        if($send != "true"){
                            return $send;
                        }
                    }
                    if($gNumber && strlen($gNumber) == 11){
                        $send = sendMessage($gNumber,$message);
                        if($send != "true"){
                            return $send;
                        }
                    }
                }
                return "true*_*Broadcast sent successfully!";
            }else{
                return "true*_*No recepient to send to!";
            }
        }else{
            return "System Error!";
        }
    }

    session_start();
    if($_SESSION["isLoggedIn"] == "true"){
        $school = $_SESSION["school"];
        $text = sanitize($_POST["text"]);
        $grade = sanitize($_POST["grade"]);
        $section = sanitize($_POST["section"]);
        if(!empty($text)&&!empty($grade)&&!empty($section)){
            echo sendBroadcast($school,$text,$grade,$section);
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