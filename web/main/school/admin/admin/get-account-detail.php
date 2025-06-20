<?php
    if($_POST){
        include_once "../../../../system/backend/config.php";

        function getAccountDetail($idx){
            global $conn;
            $data = array();
            $table = "account";
            $sql = "SELECT * FROM `$table` WHERE idx='$idx'";
            if($result=mysqli_query($conn,$sql)){
                if(mysqli_num_rows($result) > 0){
                    $row = mysqli_fetch_array($result);
                    $value = new \StdClass();
                    $value -> idx = $row["idx"];
                    $value -> image = $row["image"];
                    $value -> id = $row["id"];
                    $value -> firstname = $row["firstname"];
                    $value -> middlename = $row["middlename"];
                    $value -> lastname = $row["lastname"];
                    $value -> username = $row["username"];
                    $value -> saccess = $row["saccess"];
                    $value -> status = $row["status"];
                    array_push($data,$value);
                }
                $data = json_encode($data);
                return "true*_*" . $data;
            }else{
                return "System Failed!";
            }
        }

        session_start();
        if($_SESSION["isLoggedIn"] == "true"){
            $idx = sanitize($_POST["idx"]);
            echo getAccountDetail($idx);
        }else{
            echo "Access Denied";
        }
    }else{
        echo "Access Denied!";
    }
?>