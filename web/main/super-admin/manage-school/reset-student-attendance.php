<?php
    if($_POST){
        include_once "../../../system/backend/config.php";

        function deleteAttendance($school,$studentIdx){
            global $conn;
            $table = "attendance";
            $sql = "DELETE FROM `$table` WHERE school='$school' AND student='$studentIdx'";
            if(mysqli_query($conn,$sql)){
                return "true";
            }else{
                return "System Error!";
            }
        }

        function resetStudentAttendance($idx){
            global $conn;
            $table = "student";
            $sql = "SELECT idx FROM `$table` WHERE school='$idx'";
            if($result=mysqli_query($conn,$sql)){
                if(mysqli_num_rows($result) > 0){
                    while($row=mysqli_fetch_array($result)){
                        $studentIdx = $row["idx"];
                        $delete = deleteAttendance($idx,$studentIdx);
                        if($delete != "true"){
                            return $delete;
                        }
                    }
                    return "true*_*";
                }
            }else{
                return "System Error!";
            }
        }

        session_start();
        if($_SESSION["isLoggedIn"] == "true"){
            $idx = sanitize($_POST["idx"]);
            echo resetStudentAttendance($idx);
        }else{
            echo "Access Denied!";
        }
    }else{
        echo "Access Denied!";
    }
?>