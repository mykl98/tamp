<?php
    if($_POST){
        include_once "../../../system/backend/config.php";

        function getSchoolDetail($idx){
            global $conn;
            $data = array();
            $table = "school";
            $sql = "SELECT * FROM `$table` WHERE idx='$idx'";
            if($result=mysqli_query($conn,$sql)){
                if(mysqli_num_rows($result) > 0){
                    $row = mysqli_fetch_array($result);
                    $value = new \StdClass();
                    $value -> id = $row["id"];
                    $value -> image = $row["image"];
                    $value -> name = $row["name"];
                    $value -> address = $row["address"];
                    $value -> color = $row["color"];
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
            echo getSchoolDetail($idx);
        }else{
            echo "Access Denied";
        }
    }else{
        echo "Access Denied!";
    }
?>