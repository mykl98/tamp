<?php
    if($_POST){
        include_once "../../../../system/backend/config.php";

        function getSectionList($grade){
            global $conn;
            $data = array();
            $table = "section";
            $sql = "SELECT * FROM `$table` WHERE status='active' && grade='$grade' ORDER by name";
            if($result=mysqli_query($conn,$sql)){
                if(mysqli_num_rows($result) > 0){
                    while($row=mysqli_fetch_array($result)){
                        $value = new \StdClass();
                        $value -> idx = $row["idx"];
                        $value -> name = $row["name"];
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
            $grade = sanitize($_POST["grade"]);
            echo getSectionList($grade);
        }else{
            echo "Access Denied!";
        }
    }else{
        echo "Access Denied!";
    }
?>