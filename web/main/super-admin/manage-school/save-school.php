<?php
if($_POST){
    include_once "../../../system/backend/config.php";

    function saveSchool($idx,$image,$name,$address,$color,$status){
        global $conn;
        $table = "school";
        if($idx == ""){
            $id = generateCode(10);
            $sql = "INSERT INTO `$table` (id,image,name,address,color,status) VALUES ('$id','$image','$name','$address','$color','$status')";
        }else{
            $sql = "UPDATE `$table` SET image='$image',name='$name',address='$address',color='$color',status='$status' WHERE idx='$idx'";
        }
        if(mysqli_query($conn,$sql)){
            return "true*_*";
        }else{
            return "System Failed!";
        }
    }

    session_start();
    if($_SESSION["isLoggedIn"] == "true"){
        $idx = sanitize($_POST["idx"]);
        $image = sanitize($_POST["image"]);
        $name = sanitize($_POST["name"]);
        $address = sanitize($_POST["address"]);
        $color = sanitize($_POST["color"]);
        $status = sanitize($_POST["status"]);
        if(!empty($name)&&!empty($address)&&!empty($color)&&!empty($status)){
            echo saveSchool($idx,$image,$name,$address,$color,$status);
        }else{
            echo "Some required fields are blank!";
        }
    }else{
        echo "Access Denied!";
    }
}else{
    echo "Access Denied!";
}
?>