<?php
    if($_POST){
        include_once "../../../../system/backend/config.php";

        function getStudentDetail($idx){
            global $conn;
            $data = array();
            $table = "student";
            $sql = "SELECT * FROM `$table` WHERE idx='$idx'";
            if($result=mysqli_query($conn,$sql)){
                if(mysqli_num_rows($result) > 0){
                    $row = mysqli_fetch_array($result);
                    $value = new \StdClass();
                    $value -> id = $row["id"];
                    $value -> image = $row["image"];
                    $value -> firstname = $row["firstname"];
                    $value -> middlename = $row["middlename"];
                    $value -> lastname = $row["lastname"];
                    $value -> grade = $row["grade"];
                    $value -> section = $row["section"];
                    $value -> fnumber = $row["fnumber"];
                    $value -> mnumber = $row["mnumber"];
                    $value -> gnumber = $row["gnumber"];
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
            echo getStudentDetail($idx);
        }else{
            echo "Access Denied";
        }
    }else{
        echo "Access Denied!";
    }
?>