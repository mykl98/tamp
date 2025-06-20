<?php
    if($_POST){
        include_once "../../../../system/backend/config.php";

        function getAnnouncementList($school){
            global $conn;
            $data = array();
            $table = "announcement";
            $sql = "SELECT * FROM `$table` WHERE school='$school' ORDER by idx DESC";
            if($result=mysqli_query($conn,$sql)){
                if(mysqli_num_rows($result) > 0){
                    while($row=mysqli_fetch_array($result)){
                        $value = new \StdClass();
                        $value -> idx = $row["idx"];
                        $value -> announcement = $row["announcement"];
                        $value -> status = $row["status"];
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
            $school = $_SESSION["school"];
            echo getAnnouncementList($school);
        }else{
            echo "Access Denied!";
        }
    }else{
        echo "Access Denied!";
    }
?>