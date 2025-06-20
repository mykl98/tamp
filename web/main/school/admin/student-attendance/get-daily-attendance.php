<?php
    if($_POST){
        include_once "../../../../system/backend/config.php";

        function getAttendance($idx, $date){
            global $conn;
            $data = array();
            $table = "student-attendance";
            $sql = "SELECT * FROM `$table` WHERE student_idx='$idx' && date='$date'";
            if($result=mysqli_query($conn,$sql)){
                if(mysqli_num_rows($result) > 0){
                    $row = mysqli_fetch_array($result);
                    $value = new \StdClass();
                    $value -> date = $row["date"];
                    $value -> in1 = $row["in1"];
                    $value -> out1 = $row["out1"];
                    $value -> in2 = $row["in2"];
                    $value -> out2 = $row["out2"];
                    $value -> in3 = $row["in3"];
                    $value -> out3 = $row["out3"];
                    $value -> in4 = $row["in4"];
                    $value -> out4 = $row["out4"];
                    $value -> in5 = $row["in5"];
                    $value -> out5 = $row["out5"];
                    array_push($data, $value);
                }
            }
            return json_encode($data);
        }

        function getDailyAttendance($school, $date){
            global $conn;
            $data = array();
            $table = "student";
            $sql = "SELECT idx,firstname,middlename,lastname FROM `$table` WHERE school='$school' && status='active'";
            if($result=mysqli_query($conn, $sql)){
                if(mysqli_num_rows($result) > 0){
                    while($row=mysqli_fetch_array($result)){
                        $value = new \StdClass();
                        $value -> firstname = $row["firstname"];
                        $value -> middlename = $row["middlename"];
                        $value -> lastname = $row["lastname"];
                        $value -> attendance = getAttendance($row["idx"], $date);
                        array_push($data, $value);
                    }
                }
            }else{
                return "System Error!";
            }

            return "true*_*" . json_encode($data);
        }

        session_start();
        if($_SESSION["isLoggedIn"] == "true"){
            $school = $_SESSION["school"];
            $date = sanitize($_POST["date"]);
            echo getDailyAttendance($school, $date);
        }else{
            echo "Access Denied!";
        }
    }else{
        echo "Access Denied!";
    }
?>