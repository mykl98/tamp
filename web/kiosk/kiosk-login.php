<?php
    if($_POST){
        include_once "../system/backend/config.php";

        function login($cardId){
            global $conn;
            $table = "account";
            $sql = "SELECT access,saccess,school FROM `$table` WHERE id='$cardId' && status='active' && saccess='accesscard'";
            if($result=mysqli_query($conn,$sql)){
                if(mysqli_num_rows($result) > 0){
                    $row = mysqli_fetch_array($result);
                    session_start();
                    $school = $row["school"];
                    $_SESSION["isLoggedIn"] = "true";
                    $_SESSION["schoolidx"] = $school;

                    return "true";
                }else{
                    return "Invalid or unauthorized ID card!";
                }
            }else{
                return "System Error!";
            }
        }

        $cardId = sanitize($_POST["cardid"]);
        echo login($cardId);
    }else{
        echo "Access Denied!";
    }
?>