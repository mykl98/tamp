<?php
    if($_POST){
        include_once "../../../../system/backend/config.php";
        function getStaffList($school){
            global $conn;
            $data = array();
            $table = "account";
            $sql = "SELECT idx,firstname,middlename,lastname FROM `$table` WHERE saccess!='accesscard' && saccess!='admin' && school='$school' && status='active'";
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
            $data = json_encode($data);
            return $data;
        }

        function getStudentList($school){
            global $conn;
            $data = array();
            $table = "student";
            $sql = "SELECT idx,firstname,middlename,lastname,grade FROM `$table` WHERE school='$school' && status='active'";
            if($result=mysqli_query($conn,$sql)){
                if(mysqli_num_rows($result) > 0){
                    while($row=mysqli_fetch_array($result)){
                        $value = new \StdClass();
                        $value -> idx = $row["idx"];
                        $value -> firstname = $row["firstname"];
                        $value -> middlename = $row["middlename"];
                        $value -> lastname = $row["lastname"];
                        $value -> grade = $row["grade"];
                        array_push($data, $value);
                    }
                }
            }
            $data = json_encode($data);
            return $data;
        }

        function getStaffAttendance(){
            global $conn;
            $date = date("Y-m-d");
            $data = array();
            $table = "staff-attendance";
            $sql = "SELECT staff_idx FROM `$table` WHERE date='$date'";
            if($result=mysqli_query($conn,$sql)){
                if(mysqli_num_rows($result) > 0){
                    while($row=mysqli_fetch_array($result)){
                        $value = new \StdClass();
                        $value -> staffidx = $row["staff_idx"];
                        array_push($data, $value);
                    }
                }
            }
            return json_encode($data);
        }

        function getStudentAttendance(){
            global $conn;
            $date = date("Y-m-d");
            $data = array();
            $table = "student-attendance";
            $sql = "SELECT student_idx FROM `$table` WHERE date='$date'";
            if($result=mysqli_query($conn,$sql)){
                if(mysqli_num_rows($result) > 0){
                    while($row=mysqli_fetch_array($result)){
                        $value = new \StdClass();
                        $value -> studentidx = $row["student_idx"];
                        array_push($data, $value);
                    }
                }
            }
            return json_encode($data);
        }

        function getGradeList($school){
            global $conn;
            $data = array();
            $table = "grade";
            $sql = "SELECT idx,name FROM `$table` WHERE school='$school' && status='active'";
            if($result=mysqli_query($conn,$sql)){
                if(mysqli_num_rows($result) > 0){
                    while($row=mysqli_fetch_array($result)){
                        $value = new \StdClass();
                        $value -> idx = $row["idx"];
                        $value -> name = $row["name"];
                        array_push($data, $value);
                    }
                }
            }
            $data = json_encode($data);
            return $data;
        }

        function getDashboardDetails($school){
            $data = array();
            $value = new \StdClass();
            $value -> stafflist = getStaffList($school);
            $value -> studentlist = getStudentList($school);
            $value -> staffattendance = getStaffAttendance();
            $value -> studentattendance = getStudentAttendance();
            $value -> gradelist = getGradeList($school);
            array_push($data,$value);
            $data = json_encode($data);
            return "true*_*" . $data;
        }

        session_start();
        if($_SESSION["isLoggedIn"] == "true"){
            $school = $_SESSION["school"];
            echo getDashboardDetails($school);
        }else{
            echo "Access Denied!";
        }
    }else{
        echo "Access Denied!";
    }
?>