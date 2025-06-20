<?php
    include_once "../system/backend/config.php";
    session_start();

    $table = "school";
    $sql = "SELECT * FROM `$table` WHERE status='active'";
    if($result=mysqli_query($conn, $sql)){
        if(mysqli_num_rows($result) > 0){
            $row = mysqli_fetch_array($result);
            $schoolImage = $row["image"];
            $schoolName = $row["name"];
            $schoolAddress = $row["address"];
            $schoolColor = $row["color"];
            if(!str_contains($schoolImage, "data:image/png;base64")){
                $schoolImage = "../system/images/no-image-available.jpg";
            }
        }else{
            session_destroy();
            header("location:../system-disabled.html");
            exit();
        }
    }else{
        session_destroy();
        header("location:../system-disabled.html");
        exit();
    }
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title><?php echo $schoolName;?> | Kiosk</title>
    <link rel="icon" type="image/x-icon" href="../system/images/favicon.ico">
    <link rel="icon" type="image/x-icon" href="../../../system/images/favicon.ico">
    <!-- Tell the browser to be responsive to screen width -->
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="<?php echo $baseUrl?>/system/plugin/fontawesome/css/fontawesome-all.min.css">
    <link rel="stylesheet" href="<?php echo $baseUrl?>/system/plugin/fontawesome/css/fontawesome.css">
    <!-- Page level CSS -->
    <link href="style.css" rel="stylesheet">
</head>
<body>
    <div id="login-page" align="center" class="bg-black w-100 h-100">
        <img src="../system/images/logo.png" style="width:300px;margin-top:150px;">
        <p style="font-size:20px;" class="text-white">( Scan card to login )</p>
    </div>

    <div id="main-page" class="d-none">
        <div id="header" style="background-color:<?php echo $schoolColor;?>">
            <div class="d-inline va-top">
                <img src="<?php echo $schoolImage;?>" style="width:60px;border:solid 1px white;margin:8px 0 8px 10px">
                <p id="school-idx" class="d-none"><?php echo $school;?></p>
            </div>
            <div class="d-inline va-top mt-5" style="">
                <h2 class="font-weight-bold m-0 ml-2 p-0 text-white" style="line-height:18px;"><?php echo $schoolName?><br><span class="font-weight-normal" style="font-size:14px;" ><?php echo $schoolAddress;?></span></h2>
            </div>
            <div class="d-inline va-top ha-right mr-4 m-0">
                <div class="row">
                    <div class="col border-2 mt-2">
                        <p class="text-white m-0 text-right"><span id="date" style="font-size:16px;"></span><br><span id="clock" class="font-weight-bold" style="font-size:50px;line-height:50px;"></span></p>
                    </div>
                </div>
            </div>
            <div class="d-inline va-top ha-right mr-4 m-0">
                <div class="loader mt-4" id="spinner" style="display:none;"></div>
            </div>
        </div>
        <div style="margin:0 auto;">
            <div id="detected-student-container"></div>
        </div>
        <div id="footer">
            <div class="ticker mx-3 mb-1"> 
                <div class="title">
                    <h5 class="font-weight-bold text-white">Announcement</h5>
                </div> 
                <div class="news" style="background-color:<?php echo $schoolColor;?>"> 
                    <marquee behavior="scroll" scrollamount="1" direction="left"> 
                        <div id="announcement-container"></div>
                    </marquee> 
                </div> 
            </div>    
        </div>
    </div>

<!-- jQuery -->
<script src="<?php echo $baseUrl;?>/system/plugin/jquery/js/jquery.min.js"></script>

<!-- Page Level Script -->
<script src="script.js"></script>
</body>
</html>
