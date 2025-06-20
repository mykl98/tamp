<?php
    if($_POST){
        include_once "../../../system/backend/config.php";

        function getStudentList($school){
            global $conn;
            $data = array();
            $table = "student";
            $sql = "SELECT idx, firstname, lastname FROM `$table` WHERE school='$school' AND status='active'";
            if($result=mysqli_query($conn,$sql)){
                if(mysqli_num_rows($result) > 0){
                    while($row=mysqli_fetch_array($result)){
                        $value = new \StdClass();
                        $value -> idx = $row["idx"];
                        $value -> name = $row["firstname"] . " " . $row["lastname"];
                        array_push($data,$value);
                    }
                }
                $data = json_encode($data);
                return "true*_*".$data;
            }else{
                return "System Error!";
            }
        }

        session_start();
        if($_SESSION["isLoggedIn"] == "true"){
            $school = sanitize($_POST["school"]);
            echo getStudentList($school);
        }else{
            echo "Access Denied!";
        }
    }else{
        echo "Access Denied!";
    }
?>