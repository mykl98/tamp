<?php
    if($_POST){
        include_once "../../../../system/backend/config.php";

        function getSectionDetail($idx){
            global $conn;
            $data = array();
            $table = "section";
            $sql = "SELECT * FROM `$table` WHERE idx='$idx'";
            if($result=mysqli_query($conn,$sql)){
                if(mysqli_num_rows($result) > 0){
                    $row = mysqli_fetch_array($result);
                    $value = new \StdClass();
                    $value -> idx = $row["idx"];
                    $value -> name = $row["name"];
                    $value -> grade = $row["grade"];
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
            echo getSectionDetail($idx);
        }else{
            echo "Access Denied";
        }
    }else{
        echo "Access Denied!";
    }
?>