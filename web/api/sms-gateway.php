<?php
    if($_POST){
        include_once "../system/backend/config.php";

        function deleteSMS($idx){
            global $conn;
            $table = "sms";
            $sql = "DELETE FROM `$table` WHERE idx='$idx'";
            if(mysqli_query($conn, $sql)){
                return "true";
            }else{
                return "System Error!";
            }
        }

        function getSMS(){
            global $conn;
            $table = "sms";
            $data = array();
            $sql = "SELECT * FROM `$table` LIMIT 10";
            if($result=mysqli_query($conn, $sql)){
                if(mysqli_num_rows($result) > 0){
                    while($row=mysqli_fetch_array($result)){
                        $idx = $row["idx"];
                        $delete = deleteSMS($idx);
                        if($delete != "true"){
                            return $delete;
                        }
                        $value = new \StdClass();
                        $value -> message = $row["message"];
                        $value -> number = $row["number"];
                        array_push($data, $value);
                    }
                }
                $data = json_encode($data);
                return $data;
            }else{
                return "System Error!";
            }
        }

        function getNumStudent(){
            global $conn;
            $count = 0;
            $table = "student";
            $sql = "SELECT idx FROM `$table`";
            if($result=mysqli_query($conn,$sql)){
                $count = mysqli_num_rows($result);
            }
            return $count;
        }

        function disableSchool(){
            global $conn;
            $table = "school";
            $sql = "UPDATE `$table` SET status='inactive'";
            if(mysqli_query($conn,$sql)){
                return "Disabled Successfully";
            }else{
                return "System Error!";
            }
        }

        function enableSchool(){
            global $conn;
            $table = "school";
            $sql = "UPDATE `$table` SET status='active'";
            if(mysqli_query($conn,$sql)){
                return "Enabled Successfully";
            }else{
                return "System Error!";
            }
        }

        $activity = sanitize($_POST["activity"]);

        switch($activity){
            case "get-sms":
                echo getSMS();
                break;
            case "get-num-student":
                echo getNumStudent();
                break;
            case "disable-school":
                echo disableSchool();
                break;
            case "enable-school":
                echo enableSchool();
                break;
            default:
                echo "System Error!";
                break;
        }
    }else{
        echo "Access Denied!";
    }
?>