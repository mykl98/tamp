<?php
    if($_POST){
        include_once "../../../../system/backend/config.php";
        $currentDate = date("Y-m-d");

        function getAttendanceList($month){
            global $conn;
            $data = array();
            $table = "staff-attendance";
            $from = $month . "-00";
            $to = $month . "-32";
            $sql = "SELECT staff_idx,date FROM `$table` WHERE date>='$from' && date<='$to'";
            if($result=mysqli_query($conn,$sql)){
                if(mysqli_num_rows($result) > 0){
                    while($row=mysqli_fetch_array($result)){
                        $value = $row["staff_idx"] . "_" . $row["date"];
                        array_push($data, $value);
                    }
                }
            }
            return json_encode($data);
        }

        function getAccountList(){
            global $conn;
            $data = array();
            $table = "account";
            $sql = "SELECT * FROM `$table` WHERE saccess!='admin' && saccess!='accesscard'";
            if($result=mysqli_query($conn, $sql)){
                if(mysqli_num_rows($result) > 0){
                    while($row=mysqli_fetch_array($result)){
                        $value = new \StdClass();
                        $value -> idx = $row["idx"];
                        $value -> firstname = $row["firstname"];
                        $value -> middlename = $row["middlename"];
                        $value -> lastname = $row["lastname"];
                        array_push($data, $value);
                    }
                }
            }
            return json_encode($data);
        }

        function getData($month){
            $data = array();
            $value = new \StdClass();
            $value -> attendance = getAttendanceList($month);
            $value -> account = getAccountList();
            array_push($data, $value);
            return "true*_*" . json_encode($data);
        }

        session_start();
        if($_SESSION["isLoggedIn"] == "true"){
            $month = sanitize($_POST["month"]);
            echo getData($month);
        }else{
            echo "Access Denied!";
        }
    }else{
        echo "Access Denied!";
    }
?>