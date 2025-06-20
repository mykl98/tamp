<?php
    if($_POST){
        include_once "../../../../system/backend/config.php";
        function getAttendanceList($month){
            global $conn;
            $data = array();
            $table = "student-attendance";
            $from = $month . "-00";
            $to = $month . "-32";
            $date = date("Y-m-d");
            //$sql = "SELECT * FROM `$table` WHERE date>=$from && date<=$to";
            $sql = "SELECT * FROM `$table` WHERE date>='$from' && date<='$to'";
            if($result=mysqli_query($conn,$sql)){
                if(mysqli_num_rows($result) > 0){
                    while($row=mysqli_fetch_array($result)){
                        $value = new \StdClass();
                        $value = $row["student_idx"] . "_" . $row["date"];
                        array_push($data, $value);
                    }
                }
            }
            return json_encode($data);
        }

        function getStudentList($section){
            global $conn;
            $data = array();
            $table = "student";
            $sql = "SELECT idx,firstname, middlename, lastname FROM `$table` WHERE section='$section' && status='active'";
            if($result=mysqli_query($conn, $sql)){
                if(mysqli_num_rows($result) > 0){
                    while($row=mysqli_fetch_array($result)){
                        $middleName = $row["middlename"];
                        if($middleName != ""){
                            $middleName = $middleName[0];
                            $middleName = ucfirst($middleName) . ".";
                        }
                        $name = $row["firstname"] . " " . $middleName . " " . $row["lastname"];
                        $value = new \StdClass();
                        $value -> idx = $row["idx"];
                        $value -> name = $name;
                        array_push($data, $value);
                    }
                }
            }
            return json_encode($data);
        }

        function getData($month,$section){
            $data = array();
            $value = new \StdClass();
            $value -> attendancelist = getAttendanceList($month);
            $value -> studentlist = getStudentList($section);
            array_push($data, $value);
            return "true*_*" . json_encode($data);
        }

        session_start();
        if($_SESSION["isLoggedIn"] == "true"){
            $month = sanitize($_POST["month"]);
            $section = sanitize($_POST["section"]);
            echo getData($month,$section);
        }else{
            echo "Access Denied!";
        }
    }else{
        echo "Access Denied!";
    }
?>