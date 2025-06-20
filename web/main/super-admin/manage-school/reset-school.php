<?php
    if($_POST){
        include_once "../../../system/backend/config.php";
        function deleteAccount(){
            global $conn;
            $table = "account";
            $sql = "DELETE FROM `$table` WHERE idx!='0'";
            if(mysqli_query($conn,$sql)){
                return "true";
            }else{
                return "System Error!";
            }
        }

        function deleteStaffAttendance(){
            global $conn;
            $table = "staff-attendance";
            $sql = "DELETE FROM `$table`";
            if(mysqli_query($conn,$sql)){
                return "true";
            }else{
                return "System Error!";
            }
        }

        function deleteStudentAttendance(){
            global $conn;
            $table = "student-attendance";
            $sql = "DELETE FROM `$table`";
            if(mysqli_query($conn,$sql)){
                return "true";
            }else{
                return "System Error!";
            }
        }

        function deleteGrade(){
            global $conn;
            $table = "grade";
            $sql = "DELETE FROM `$table`";
            if(mysqli_query($conn,$sql)){
                return "true";
            }else{
                return "System Error!";
            }
        }

        function deleteSection(){
            global $conn;
            $table = "section";
            $sql = "DELETE FROM `$table`";
            if(mysqli_query($conn,$sql)){
                return "true";
            }else{
                return "System Error!";
            }
        }

        function deleteStudent(){
            global $conn;
            $table = "student";
            $sql = "DELETE FROM `$table`";
            if(mysqli_query($conn,$sql)){
                return "true";
            }else{
                return "System Error!";
            }
        }

        function deletePosition(){
            global $conn;
            $table = "position";
            $sql = "DELETE FROM `$table`";
            if(mysqli_query($conn,$sql)){
                return "true";
            }else{
                return "System Error!";
            }
        }

        function resetSchool(){
            $delete = deleteAccount();
            if($delete != "true"){
                return $delete;
            }
            $delete = deleteStaffAttendance();
            if($delete != "true"){
                return $delete;
            }
            $delete = deleteStudentAttendance();
            if($delete != "true"){
                return $delete;
            }
            $delete = deleteGrade();
            if($delete != "true"){
                return $delete;
            }
            $delete = deleteSection();
            if($delete != "true"){
                return $delete;
            }
            $delete = deleteStudent();
            if($delete != "true"){
                return $delete;
            }
            $delete = deletePosition();
            if($delete != "true"){
                return $delete;
            }

            return "true*_*";
        }

        session_start();
        if($_SESSION["isLoggedIn"] == "true"){
            echo resetSchool();
        }else{
            echo "Access Denied!";
        }
    }else{
        echo "Access Denied!";
    }
?>