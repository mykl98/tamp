<?php
    if($_POST){
        include_once "../../../../system/backend/config.php";
        function getStudentList($school,$grade,$section){
            global $conn;
            $data = array();
            $table = "student";
            if($grade == "all"){
                if($section == "all" || $section == ""){
                    $sql = "SELECT * FROM `$table` WHERE school='$school' ORDER by lastname";
                }else{
                    $sql = "SELECT * FROM `$table` WHERE school='$school' && section='$section' ORDER by lastname";
                }
            }else{
                if($section == "all"){
                    $sql = "SELECT * FROM `$table` WHERE school='$school' && grade='$grade' ORDER by lastname";
                }else{
                    $sql = "SELECT * FROM `$table` WHERE school='$school' && grade='$grade' && section='$section' ORDER by lastname";
                }
            }
            if($result=mysqli_query($conn,$sql)){
                if(mysqli_num_rows($result) > 0){
                    while($row=mysqli_fetch_array($result)){
                        if($row["idx"] != 0){
                            $value = new \StdClass();
                            $value -> idx = $row["idx"];
                            $value -> id = $row["id"];
                            $value -> firstname = $row["firstname"];
                            $value -> middlename = $row["middlename"];
                            $value -> lastname = $row["lastname"];
                            $value -> grade = $row["grade"];
                            $value -> section = $row["section"];
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
            $grade = sanitize($_POST["grade"]);
            $section = sanitize($_POST["section"]);
            $school = $_SESSION["school"];
            echo getStudentList($school,$grade,$section);
        }else{
            echo "Access Denied!";
        }
    }else{
        echo "Access Denied!";
    }
?>