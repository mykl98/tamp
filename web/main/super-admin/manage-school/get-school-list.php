<?php
    if($_POST){
        include_once "../../../system/backend/config.php";

        function getSchoolList(){
            global $conn;
            $data = array();
            $table = "school";
            $sql = "SELECT * FROM `$table` ORDER by idx DESC";
            if($result=mysqli_query($conn,$sql)){
                if(mysqli_num_rows($result) > 0){
                    while($row=mysqli_fetch_array($result)){
                        if($row["idx"] != 0){
                            $value = new \StdClass();
                            $value -> idx = $row["idx"];
                            $value -> id = $row["id"];
                            $value -> name = $row["name"];
                            $value -> address = $row["address"];
                            $value -> color = $row["color"];
                            $value -> status = $row["status"];
                            array_push($data,$value);
                        }
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
            echo getSchoolList();
        }else{
            echo "Access Denied!";
        }
    }else{
        echo "Access Denied!";
    }
?>