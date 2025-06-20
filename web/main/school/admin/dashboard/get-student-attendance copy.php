<?php
    if($_POST){
        include_once "../../../../system/backend/config.php";

        $attendancePresent = array();
        $gradeNames = array();
        $sectionNames = array();
        
        function getPresentInAttendance($school){
            global $conn, $attendancePresent;
            $date = date("Y-m-d");
            //$date = "2023-02-08";
            $table = "attendance";
            $sql = "SELECT student FROM `$table` WHERE school='$school' && date='$date'";
            if($result=mysqli_query($conn,$sql)){
                if(mysqli_num_rows($result) > 0){
                    while($row=mysqli_fetch_array($result)){
                        array_push($attendancePresent, $row["student"]);
                    }
                }
            }
        }

        function checkIfPresent($idx){
            global $attendancePresent;
            if(in_array($idx, $attendancePresent)){
                return "true";
            }else{
                return "false";
            }
        }

        function getGradeName(){
            global $conn, $gradeNames;
            $table = "grade";
            $sql = "SELECT idx,name FROM `$table`";
            if($result=mysqli_query($conn,$sql)){
                if(mysqli_num_rows($result)>0){
                    while($row=mysqli_fetch_array($result)){
                        $gradeNames[$row['idx']] = $row['name'];
                    }
                }
            }
        }

        function getSectionName(){
            global $conn, $sectionNames;
            $table = "section";
            $sql = "SELECT idx,name FROM `$table`";
            if($result=mysqli_query($conn,$sql)){
                if(mysqli_num_rows($result)>0){
                    while($row=mysqli_fetch_array($result)){
                        $sectionNames[$row['idx']] = $row['name'];
                    }
                }
            }
        }

        function getStudentAttendance($school){
            global $conn, $gradeNames, $sectionNames;
            $data = array();
            $table = "student";
            $sql = "SELECT *  FROM `$table` WHERE school='$school'";
            if($result=mysqli_query($conn,$sql)){
                if(mysqli_num_rows($result) > 0){
                    while($row=mysqli_fetch_array($result)){
                        $idx = $row["idx"];
                        $check = checkIfPresent($idx);
                        $value = new \StdClass();
                        $value -> name = $row["firstname"] . " " . $row["lastname"];
                        $value -> grade = $gradeNames[$row["grade"]];
                        $value -> section = $sectionNames[$row["section"]];
                        $value -> status = $check;
                        array_push($data,$value);
                    }
                }
                $data = json_encode($data);
                return "true*_*" . $data;
            }else{
                return "System Error!";
            }
        }

        session_start();
        if($_SESSION["isLoggedIn"] == "true"){
            $school = $_SESSION["school"];
            getPresentInAttendance($school);
            getGradeName();
            getSectionName();
            echo getStudentAttendance($school);
        }else{
            echo "Access Denied!";
        }
    }else{
        echo "Access Denied!";
    }
?>