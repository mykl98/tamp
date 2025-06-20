<?php
    if($_POST){
        include_once "../../../../system/backend/config.php";

        function deleteStaff($idx){
            global $conn;
            $table = "account";
            $sql = "DELETE FROM `$table` WHERE idx='$idx'";
            if(mysqli_query($conn,$sql)){
                return "true*_*";
            }else{
                return "System Error!";
            }
        }

        session_start();
        if($_SESSION["isLoggedIn"] == "true"){
            $idx = sanitize($_POST["idx"]);
            echo deleteStaff($idx);
        }else{
            echo "Access Denied!";
        }
    }else{
        echo "Access Denied!";
    }
?>