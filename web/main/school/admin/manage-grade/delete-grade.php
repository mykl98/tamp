<?php
    if($_POST){
        include_once "../../../../system/backend/config.php";

        function deleteSection($gradeIdx){
            global $conn;
            $table = "section";
            $sql = "DELETE FROM `$table` WHERE grade='$gradeIdx'";
            if(mysqli_query($conn,$sql)){
                return "true";
            }else{
                return "System Error!";
            }
        }

        function deleteGrade($idx){
            $delete = deleteSection($idx);
            if($delete != "true"){
                return $delete;
            }
            global $conn;
            $table = "grade";
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
            echo deleteGrade($idx);
        }else{
            echo "Access Denied!";
        }
    }else{
        echo "Access Denied!";
    }
?>