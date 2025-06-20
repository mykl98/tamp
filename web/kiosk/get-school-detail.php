<?php
if($_POST){
    include_once "../system/backend/config.php";
    function getPositionList($school){
        global $conn;
        $data = array();
        $table = "position";
        $sql = "SELECT * FROM `$table` WHERE school='$school'";
        if($result=mysqli_query($conn,$sql)){
            if(mysqli_num_rows($result) > 0){
                while($row=mysqli_fetch_array($result)){
                    $value = new \StdClass();
                    $value -> idx = $row["idx"];
                    $value -> name = $row["name"];
                    array_push($data, $value);
                }
            }
        }
        return json_encode($data);
    }

    function getGradeList($school){
        global $conn;
        $data = array();
        $table = "grade";
        $sql = "SELECT * FROM `$table` WHERE school='$school'";
        if($result=mysqli_query($conn,$sql)){
            if(mysqli_num_rows($result) > 0){
                while($row=mysqli_fetch_array($result)){
                    $value = new \StdClass();
                    $value -> idx = $row["idx"];
                    $value -> name = $row["name"];
                    array_push($data, $value);
                }
            }
        }
        return json_encode($data);
    }

    function getSectionList($school){
        global $conn;
        $data = array();
        $table = "section";
        $sql = "SELECT * FROM `$table` WHERE school='$school'";
        if($result=mysqli_query($conn,$sql)){
            if(mysqli_num_rows($result) > 0){
                while($row=mysqli_fetch_array($result)){
                    $value = new \StdClass();
                    $value -> idx = $row["idx"];
                    $value -> name = $row["name"];
                    array_push($data, $value);
                }
            }
        }
        return json_encode($data);
    }

    function getSchoolDetail($school){
        $data = array();
        $value = new \StdClass();
        $value -> positionlist = getPositionList($school);
        $value -> gradelist = getGradeList($school);
        $value -> sectionlist = getSectionList($school);
        array_push($data, $value);
        return "true*_*" . json_encode($data);
    }

    session_start();
    $school = $_SESSION["schoolidx"];
    echo getSchoolDetail($school);

}else{
   echo "Access Denied!";
}

?>