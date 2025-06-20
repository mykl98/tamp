<?php
    if($_POST){
        include_once "../../../../system/backend/config.php";

        function getStudentAttendance($idx,$_from,$_to,$school){
            global $conn;
            $data = array();
            $table = "student-attendance";
            if($_from > $_to){
                $to = $_from;
                $from = $_to;
            }else{
                $to = $_to;
                $from = $_from;
            }
            $sql = "SELECT * FROM `$table` WHERE student_idx='$idx' AND date>='$from' && date<='$to' AND school='$school' ORDER by idx DESC LIMIT 1000";
            if($result=mysqli_query($conn,$sql)){
                if(mysqli_num_rows($result) > 0){
                    while($row=mysqli_fetch_array($result)){
                        if($row["idx"] != 0){
                            $value = new \StdClass();
                            $value -> date = $row["date"];
                            $value -> in1 = $row["in1"];
                            $value -> out1 = $row["out1"];
                            $value -> in2 = $row["in2"];
                            $value -> out2 = $row["out2"];
                            $value -> in3 = $row["in3"];
                            $value -> out3 = $row["out3"];
                            $value -> in4 = $row["in4"];
                            $value -> out4 = $row["out4"];
                            $value -> in5 = $row["in5"];
                            $value -> out5 = $row["out5"];
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
            $idx = sanitize($_POST["idx"]);
            $from = sanitize($_POST["from"]);
            $to = sanitize($_POST["to"]);
            $school = $_SESSION["school"];
            echo getStudentAttendance($idx,$from,$to,$school);
        }else{
            echo "Access Denied!";
        }
    }else{
        echo "Access Denied!";
    }
?>