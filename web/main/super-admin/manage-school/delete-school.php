<?php
    if($_POST){
        include_once "../../../system/backend/config.php";
        function deleteAccount($schoolIdx){
            global $conn;
            $table = "account";
            $sql = "DELETE FROM `$table` WHERE school='$schoolIdx'";
            if(mysqli_query($conn,$sql)){
                return "true";
            }else{
                return "System Error!";
            }
        }

        function deleteAttendance($schoolIdx){
            global $conn;
            $table = "attendance";
            $sql = "DELETE FROM `$table` WHERE school='$schoolIdx'";
            if(mysqli_query($conn,$sql)){
                return "true";
            }else{
                return "System Error!";
            }
        }

        function deleteGrade($schoolIdx){
            global $conn;
            $table = "grade";
            $sql = "DELETE FROM `$table` WHERE school='$schoolIdx'";
            if(mysqli_query($conn,$sql)){
                return "true";
            }else{
                return "System Error!";
            }
        }

        function deleteSection($schoolIdx){
            global $conn;
            $table = "section";
            $sql = "DELETE FROM `$table` WHERE school='$schoolIdx'";
            if(mysqli_query($conn,$sql)){
                return "true";
            }else{
                return "System Error!";
            }
        }

        function deleteStudent($schoolIdx){
            global $conn;
            $table = "student";
            $sql = "DELETE FROM `$table` WHERE school='$schoolIdx'";
            if(mysqli_query($conn,$sql)){
                return "true";
            }else{
                return "System Error!";
            }
        }

        function deletePosition($schoolIdx){
            global $conn;
            $table = "position";
            $sql = "DELETE FROM `$table` WHERE school='$schoolIdx'";
            if(mysqli_query($conn,$sql)){
                return "true";
            }else{
                return "System Error!";
            }
        }

        function deleteSchool($idx){
            $delete = deleteAccount($idx);
            if($delete != "true"){
                return $delete;
            }
            $delete = deleteAttendance($idx);
            if($delete != "true"){
                return $delete;
            }
            $delete = deleteGrade($idx);
            if($delete != "true"){
                return $delete;
            }
            $delete = deleteSection($idx);
            if($delete != "true"){
                return $delete;
            }
            $delete = deleteStudent($idx);
            if($delete != "true"){
                return $delete;
            }
            $delete = deletePosition($idx);
            if($delete != "true"){
                return $delete;
            }
            global $conn;
            $table = "school";
            $sql = "DELETE FROM `$table` WHERE idx='$idx'";
            if(mysqli_query($conn,$sql)){
                return "true*_*";
            }else{
                return "System Failed!";
            }
        }

        session_start();
        if($_SESSION["isLoggedIn"] == "true"){
            $idx = sanitize($_POST["idx"]);
            echo deleteSchool($idx);
        }else{
            echo "Access Denied!";
        }
    }else{
        echo "Access Denied!";
    }
?>