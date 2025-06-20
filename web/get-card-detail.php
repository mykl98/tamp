<?php
if($_POST){
    include_once "../system/backend/config.php";

    $date = date("Y-m-d");
    $time = date("h:i:s a");
    $waitTime = 300; //300

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

    function sendNotif($studentIdx, $activity){
        global $conn, $date, $time;
        $table = "student";
        $sql = "SELECT firstname,fnumber,mnumber,gnumber FROM `$table` WHERE idx='$studentIdx'";
        if($result=mysqli_query($conn,$sql)){
            if(mysqli_num_rows($result) > 0){
                $row = mysqli_fetch_array($result);
                $firstName = $row["firstname"];
                if($activity == "logout"){
                    $message = "[".$date."] Your child ".$firstName." left school at ".$time;
                }else{
                    $message = "[".$date."]Your child ".$firstName." entered school at ".$time;
                }
                            
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
            return "true";
        }else{
            return "System Error!";
        }
    }

    function logStaffAttendance($schoolIdx, $staffIdx){
        global $conn,$date,$time,$waitTime;
        $activity = "login";
        $table = "staff-attendance";
        $sql = "SELECT * FROM `$table` WHERE date='$date' && staff_idx='$staffIdx' && school='$schoolIdx'";
        if($result=mysqli_query($conn,$sql)){
            if(mysqli_num_rows($result) > 0){
                $row = mysqli_fetch_array($result);
                $idx = $row["idx"];
                $in1 = $row["in1"];
                $out1 = $row["out1"];
                $in2 = $row["in2"];
                $out2 = $row["out2"];
                $in3 = $row["in3"];
                $out3 = $row["out3"];
                $in4 = $row["in4"];
                $out4 = $row["out4"];
                $in5 = $row["in5"];
                $out5 = $row["out5"];
                
                if(!$in1){
                    $sql = "UPDATE `$table` SET in1='$time' WHERE idx='$idx'";
                    $activity = "login";
                }else if(!$out1){
                    if((strtotime($time) - strtotime($in1)) < $waitTime){
                        return "You have just logged in.\nPlease wait a moment before logging out.";
                    }
                    $sql = "UPDATE `$table` SET out1='$time' WHERE idx='$idx'";
                    $activity = "logout";
                }else if(!$in2){
                    if((strtotime($time) - strtotime($out1)) < $waitTime){
                        return "You have just logged out.\nPlease wait a moment before logging in.";
                    }
                    $sql = "UPDATE `$table` SET in2='$time' WHERE idx='$idx'";
                    $activity = "login";
                }else if(!$out2){
                    if((strtotime($time) - strtotime($in2)) < $waitTime){
                        return "You have just logged in.\nPlease wait a moment before logging out.";
                    }
                    $sql = "UPDATE `$table` SET out2='$time' WHERE idx='$idx'";
                    $activity = "logout";
                }else if(!$in3){
                    if((strtotime($time) - strtotime($out2)) < $waitTime){
                        return "You have just logged out.\nPlease wait a moment before logging in.";
                    }
                    $sql = "UPDATE `$table` SET in3='$time' WHERE idx='$idx'";
                    $activity = "login";
                }else if(!$out3){
                    if((strtotime($time) - strtotime($in3)) < $waitTime){
                        return "You have just logged in.\nPlease wait a moment before logging out.";
                    }
                    $sql = "UPDATE `$table` SET out3='$time' WHERE idx='$idx'";
                    $activity = "logout";
                }else if(!$in4){
                    if((strtotime($time) - strtotime($out3)) < $waitTime){
                        return "You have just logged out.\nPlease wait a moment before logging in.";
                    }
                    $sql = "UPDATE `$table` SET in4='$time' WHERE idx='$idx'";
                    $activity = "login";
                }else if(!$out4){
                    if((strtotime($time) - strtotime($in4)) < $waitTime){
                        return "You have just logged in.\nPlease wait a moment before logging out.";
                    }
                    $sql = "UPDATE `$table` SET out4='$time' WHERE idx='$idx'";
                    $activity = "logout";
                }else if(!$in5){
                    if((strtotime($time) - strtotime($out4)) < $waitTime){
                        return "You have just logged out.\nPlease wait a moment before logging in.";
                    }
                    $sql = "UPDATE `$table` SET in5='$time' WHERE idx='$idx'";
                    $activity = "login";
                }else if(!$out5){
                    if((strtotime($time) - strtotime($in5)) < $waitTime){
                        return "You have just logged in.\nPlease wait a moment before logging out.";
                    }
                    $sql = "UPDATE `$table` SET out5='$time' WHERE idx='$idx'";
                    $activity = "logout";
                }else{
                    return "You have already logged in and logged out for the day!\nPlease come back again tomorrow.";
                }   
            }else{
                $sql = "INSERT INTO `$table` (date,staff_idx,in1,out1,in2,out2,in3,out3,in4,out4,in5,out5,school) VALUES ('$date','$staffIdx','$time','','','','','','','','','','$schoolIdx')";
                $activity = "login";
            }
            if(mysqli_query($conn,$sql)){
                return $activity;
            }else{
                return "System Error!";
            }
        }else{
            return "System Error!";
        }
    }

    function logStudentAttendance($schoolIdx, $studentIdx){
        global $conn,$date,$time,$waitTime;
        $activity = "login";
        $table = "student-attendance";
        $sql = "SELECT * FROM `$table` WHERE date='$date' && student_idx='$studentIdx' && school='$schoolIdx'";
        if($result=mysqli_query($conn,$sql)){
            if(mysqli_num_rows($result) > 0){
                $row = mysqli_fetch_array($result);
                $idx = $row["idx"];
                $in1 = $row["in1"];
                $out1 = $row["out1"];
                $in2 = $row["in2"];
                $out2 = $row["out2"];
                $in3 = $row["in3"];
                $out3 = $row["out3"];
                $in4 = $row["in4"];
                $out4 = $row["out4"];
                $in5 = $row["in5"];
                $out5 = $row["out5"];

                if(!$in1){
                    $sql = "UPDATE `$table` SET in1='$time' WHERE idx='$idx'";
                    $activity = "login";
                }else if(!$out1){
                    if((strtotime($time) - strtotime($in1)) < $waitTime){
                        return "You have just logged in.\nPlease wait a moment before logging out.";
                    }
                    $sql = "UPDATE `$table` SET out1='$time' WHERE idx='$idx'";
                    $activity = "logout";
                }else if(!$in2){
                    if((strtotime($time) - strtotime($out1)) < $waitTime){
                        return "You have just logged out.\nPlease wait a moment before logging in.";
                    }
                    $sql = "UPDATE `$table` SET in2='$time' WHERE idx='$idx'";
                    $activity = "login";
                }else if(!$out2){
                    if((strtotime($time) - strtotime($in2)) < $waitTime){
                        return "You have just logged in.\nPlease wait a moment before logging out.";
                    }
                    $sql = "UPDATE `$table` SET out2='$time' WHERE idx='$idx'";
                    $activity = "logout";
                }else if(!$in3){
                    if((strtotime($time) - strtotime($out2)) < $waitTime){
                        return "You have just logged out.\nPlease wait a moment before logging in.";
                    }
                    $sql = "UPDATE `$table` SET in3='$time' WHERE idx='$idx'";
                    $activity = "login";
                }else if(!$out3){
                    if((strtotime($time) - strtotime($in3)) < $waitTime){
                        return "You have just logged in.\nPlease wait a moment before logging out.";
                    }
                    $sql = "UPDATE `$table` SET out3='$time' WHERE idx='$idx'";
                    $activity = "logout";
                }else if(!$in4){
                    if((strtotime($time) - strtotime($out3)) < $waitTime){
                        return "You have just logged out.\nPlease wait a moment before logging in.";
                    }
                    $sql = "UPDATE `$table` SET in4='$time' WHERE idx='$idx'";
                    $activity = "login";
                }else if(!$out4){
                    if((strtotime($time) - strtotime($in4)) < $waitTime){
                        return "You have just logged in.\nPlease wait a moment before logging out.";
                    }
                    $sql = "UPDATE `$table` SET out4='$time' WHERE idx='$idx'";
                    $activity = "logout";
                }else if(!$in5){
                    if((strtotime($time) - strtotime($out4)) < $waitTime){
                        return "You have just logged out.\nPlease wait a moment before logging in.";
                    }
                    $sql = "UPDATE `$table` SET in5='$time' WHERE idx='$idx'";
                    $activity = "login";
                }else if(!$out5){
                    if((strtotime($time) - strtotime($in5)) < $waitTime){
                         return "You have just logged in.\nPlease wait a moment before logging out.";
                    }
                    $sql = "UPDATE `$table` SET out5='$time' WHERE idx='$idx'";
                    $activity = "logout";
                }else{
                    return "You have already logged in and logged out for the day!\nPlease come back again tomorrow.";
                }
            }else{
                $sql = "INSERT INTO `$table` (date,student_idx,in1,out1,in2,out2,in3,out3,in4,out4,in5,out5,school) VALUES ('$date','$studentIdx','$time','','','','','','','','','','$schoolIdx')";
                $activity = "login";
            }
            if(mysqli_query($conn,$sql)){
                return $activity;
            }else{
                return "System Error!";
            }
        }else{
            return "System Error!";
        }
    }

    function getCardDetail($cardId, $schoolIdx){
        global $conn;
        $data = array();
        $table = "account";
        $sql = "SELECT idx,image,firstname,lastname,saccess FROM `$table` WHERE id='$cardId' && school='$schoolIdx' && saccess!='accesscard' && status='active'";
        if($result=mysqli_query($conn, $sql)){
            if(mysqli_num_rows($result) > 0){
                $row = mysqli_fetch_array($result);
                $value = new \StdClass();
                $value -> image = $row["image"];
                $value -> firstname = $row["firstname"];
                $value -> lastname = $row["lastname"];
                $value -> saccess = $row["saccess"];
                $activity = logStaffAttendance($schoolIdx, $row["idx"]);
                if($activity != "login" && $activity != "logout"){
                    return $activity;
                }
                $value -> activity = $activity;
                $value -> type = "account";
                array_push($data, $value);
                $data = json_encode($data);
                return "true*_*" .  $data;
            }else{
                $table = "student";
                $sql = "SELECT idx,image,firstname,lastname,grade,section,test FROM `$table` WHERE id='$cardId' && school='$schoolIdx' && status='active'";
                if($result=mysqli_query($conn,$sql)){
                    if(mysqli_num_rows($result) > 0){
                        $row = mysqli_fetch_array($result);
                        $studentIdx = $row["idx"];
                        $activity = logStudentAttendance($schoolIdx, $studentIdx);
                        if($activity != "login" && $activity != "logout"){
                            return $activity;
                        }
                        $send = sendNotif($studentIdx, $activity);
                        if($send != "true"){
                            return $send;
                        }
                        $value = new \StdClass();
                        $value -> idx = $studentIdx;
                        $value -> image = $row["image"];
                        $value -> firstname = $row["firstname"];
                        $value -> lastname = $row["lastname"];
                        $value -> grade = $row["grade"];
                        $value -> section = $row["section"];
                        $value -> type = "student";
                        $value -> activity = $activity;
                        array_push($data, $value);
                        $data = json_encode($data);
                        return "true*_*" . $data;
                    }else{
                        return "Unauthorized RFID Card!";
                    }
                }else{
                    return "System Error!";
                }
            }
        }else{
            return "System Error!";
        }
    }

    session_start();
    $cardId = sanitize($_POST["cardid"]);
    $schoolIdx = sanitize($_SESSION["schoolidx"]);
    echo getCardDetail($cardId, $schoolIdx);

}else{
   echo "Access Denied!";
}

?>