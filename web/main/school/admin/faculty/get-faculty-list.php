<?php
    if($_POST){
        include_once "../../../../system/backend/config.php";

        function getFacultyList($school){
            global $conn;
            $data = array();
            $table = "account";
            $sql = "SELECT * FROM `$table` WHERE saccess='faculty' && school='$school' ORDER by idx DESC";
            if($result=mysqli_query($conn,$sql)){
                if(mysqli_num_rows($result) > 0){
                    while($row=mysqli_fetch_array($result)){
                        $value = new \StdClass();
                        $value -> idx = $row["idx"];
                        $value -> id = $row["id"];
                        $value -> firstname = $row["firstname"];
                        $value -> middlename = $row["middlename"];
                        $value -> lastname = $row["lastname"];
                        $value -> username = $row["username"];
                        $value -> grade = $row["grade"];
                        $value -> section = $row["section"];
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
            echo getFacultyList($school);
        }else{
            echo "Access Denied!";
        }
    }else{
        echo "Access Denied!";
    }
?>