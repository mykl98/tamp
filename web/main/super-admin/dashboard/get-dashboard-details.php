<?php
    if($_POST){
        include_once "../../../system/backend/config.php";

        function getAdminCount(){
            global $conn;
            $count = 0;
            $table = "account";
            $sql = "SELECT idx FROM `$table` WHERE access='admin'";
            if($result=mysqli_query($conn,$sql)){
                $count = mysqli_num_rows($result);
            }
            return $count;
        }

        function getStudentCount(){
            global $conn;
            $table = "student";
            $count = 0;
            $sql = "SELECT idx FROM `$table`";
            if($result=mysqli_query($conn,$sql)){
                $count = mysqli_num_rows($result);
            }
            return $count;
        }

        function getSchoolList(){
            global $conn;
            $data = array();
            $table = "school";
            $sql = "SELECT * FROM `$table`";
            if($result=mysqli_query($conn,$sql)){
                if(mysqli_num_rows($result) > 0){
                    while($row=mysqli_fetch_array($result)){
                        $value = new \StdClass();
                        $value -> name = $row["name"];
                        $value -> status = $row["status"];
                        $value -> studentcount = getStudentCount();
                        array_push($data, $value);
                    }
                }
            }
            $data = json_encode($data);
            return $data;
        }


        function getDashboardDetails(){
            $data = array();
            $value = new \StdClass();
            $value -> schoollist = getSchoolList();
            $value -> admincount = getAdminCount();
            array_push($data,$value);
            $data = json_encode($data);
            return "true*_*" . $data;
        }

        session_start();
        if($_SESSION["isLoggedIn"] == "true"){
            echo getDashboardDetails();
        }else{
            echo "Access Denied!";
        }
    }else{
        echo "Access Denied!";
    }
?>