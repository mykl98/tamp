<?php
    if($_POST){
        include_once "../../../../system/backend/config.php";

        function deletePosition($idx){
            global $conn;
            $table = "position";
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
            echo deletePosition($idx);
        }else{
            echo "Access Denied!";
        }
    }else{
        echo "Access Denied!";
    }
?>