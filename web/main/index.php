<?php
include_once "../system/backend/config.php";
    session_start();
    if($_SESSION["isLoggedIn"] == "true"){
        $access = $_SESSION["access"];
        switch ($access){
            case "super-admin":
                header("location:super-admin/dashboard");
                exit();
                break;
            case "admin":
                header("location:admin/dashboard");
                exit();
                break;
            case "supervisor":
                header("location:supervisor/dashboard");
                exit();
                break;
            case "school":
                $sAccess = $_SESSION["saccess"];
                if($sAccess == "admin"){
                    header("location:school/admin/dashboard");
                    exit();
                }if($sAccess == "faculty"){
                    header("location:school/faculty/dashboard");
                    exit();
                }else{
                    session_destroy();
                    header("location:../index.php");
                    exit();
                }
                break;
            default:
                session_destroy();
                header("location:../index.php");
                exit();
                break;
        }
    }else{
        session_destroy();
        header("location:../index.php");
        exit();
    }
?>