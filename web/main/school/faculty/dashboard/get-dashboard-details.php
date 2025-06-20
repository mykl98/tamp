<?php
    if($_POST){
        include_once "../../../../system/backend/config.php";

        function getAttendance($school){
            global $conn;
            $date = date("Y-m-d");
            $data = array();
            $table = "student-attendance";
            $sql = "SELECT idx, student_idx FROM `$table` WHERE date='$date'";
            if($result=mysqli_query($conn,$sql)){
                if(mysqli_num_rows($result) > 0){
                    while($row=mysqli_fetch_array($result)){
                        $value = new \StdClass();
                        $value -> idx = $row["idx"];
                        $value -> student = $row["student_idx"];
                        array_push($data, $value);
                    }
                }
            }
            return json_encode($data);
        }

        function getStudentList($section,$school){
            global $conn;
            $table = "student";
            $data = array();
            $sql = "SELECT idx,firstname,middlename,lastname FROM `$table` WHERE school='$school'";
            if($result=mysqli_query($conn,$sql)){
                if(mysqli_num_rows($result) > 0){
                    while($row=mysqli_fetch_array($result)){
                        $value = new \StdClass();
                        $value -> idx = $row["idx"];
                        $value -> firstname = $row["firstname"];
                        $value -> middlename = $row["middlename"];
                        $value -> lastname = $row["lastname"];
                        array_push($data, $value);
                    }
                }
            }
            return json_encode($data);
        }

        function getDashboardDetails($section,$school){
            $data = array();
            $value = new \StdClass();
            $value -> studentlist = getStudentList($section,$school);
            $value -> attendance = getAttendance($school);
            array_push($data,$value);
            $data = json_encode($data);
            return "true*_*" . $data;
        }

        session_start();
        if($_SESSION["isLoggedIn"] == "true"){
            $section = $_SESSION["section"];
            $school = $_SESSION["school"];
            echo getDashboardDetails($section, $school);
        }else{
            echo "Access Denied!";
        }
    }else{
        echo "Access Denied!";
    }
?>