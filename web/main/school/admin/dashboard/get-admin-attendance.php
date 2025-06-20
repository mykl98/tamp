<?php
    if($_POST){
        include_once "../../../../system/backend/config.php";

        function getAttendanceList($school){
            global $conn;
            $date = date("Y-m-d");
            //$date = "2024-08-22";
            
            $table = "attendance";
            $data = array();
            $sql = "SELECT student,time,activity FROM `$table` WHERE school='$school' && date='$date' ORDER BY idx DESC";
            if($result=mysqli_query($conn,$sql)){
                if(mysqli_num_rows($result) > 0){
                    while($row=mysqli_fetch_array($result)){
                        $value = new \StdClass();
                        $value -> student = $row["student"];
                        $value -> time = $row["time"];
                        $value -> activity = $row["activity"];
                        array_push($data, $value);
                    }
                }
            }
            $data = json_encode($data);
            return $data;
        }

        function getLateTime($school){
            global $conn;
            $lateTime = "";
            $table = "school";
            $sql = "SELECT latetime FROM `$table` WHERE idx='$school'";
            if($result=mysqli_query($conn,$sql)){
                if(mysqli_num_rows($result) > 0){
                    $row = mysqli_fetch_array($result);
                    $lateTime = $row["latetime"];
                }
            }
            return $lateTime;
        }

        function getAccountList($school){
            global $conn;
            $table = "account";
            $data = array();
            $sql = "SELECT idx,name,firstname,middlename,lastname FROM `$table` WHERE school='$school' && status='active'";
            if($result=mysqli_query($conn,$sql)){
                if(mysqli_num_rows($result) > 0){
                    while($row=mysqli_fetch_array($result)){
                        $value = new \StdClass();
                        $value -> idx = $row["idx"];
                        $value -> name = $row["name"];
                        $value -> firstname = $row["firstname"];
                        $value -> middlename = $row["middlename"];
                        $value -> lastname = $row["lastname"];
                        array_push($data, $value);
                    }
                }
            }
            $data = json_encode($data);
            return $data;
        }

        function getAdminAttendance($school){
            $data = array();
            $value = new \StdClass();
            $value -> accountlist = getAccountList($school);
            $value -> attendancelist = getAttendanceList($school);
            $value -> latetime = getLateTime($school);
            array_push($data, $value);
            $data = json_encode($data);
            return "true*_*" . $data;
        }

        session_start();
        if($_SESSION["isLoggedIn"] == "true"){
            $school = $_SESSION["school"];
            echo getAdminAttendance($school);
        }else{
            echo "Access Denied!";
        }
    }else{
        echo "Access Denied!";
    }
?>