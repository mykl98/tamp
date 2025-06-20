<?php
    include_once "../../../../system/backend/config.php";
    $schoolImage = "";
    $schoolName = "";
    $schoolAddress = "";
    function getSchoolDetail($schoolIdx){
        global $conn,$schoolImage,$schoolName,$schoolAddress;
        $table = "school";
        $sql = "SELECT * FROM `$table` WHERE idx='$schoolIdx'";
        if($result=mysqli_query($conn,$sql)){
            if(mysqli_num_rows($result) > 0){
                $row = mysqli_fetch_array($result);
                $schoolImage = $row["image"];
                $schoolName = $row["name"];
                $schoolAddress = $row["address"];
                if(!str_contains($schoolImage, "data:image/png;base64")){
                    $schoolImage = "../../../../system/images/no-image-available.jpg";
                }
            }
        }
    }
    
    session_start();
    if($_SESSION["isLoggedIn"] == "true" && $_SESSION["access"] == "school" && $_SESSION["saccess"] == "faculty"){
        $school = $_SESSION["school"];
        getSchoolDetail($school);
    }else{
        session_destroy();
        header("location:".$baseUrl."/index.php");
        exit();
    }
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title><?php echo $schoolName;?> | Dashboard</title>
    <link rel="icon" type="image/x-icon" href="<?php echo $baseUrl?>/system/images/favicon.ico">
    <!-- Tell the browser to be responsive to screen width -->
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="<?php echo $baseUrl?>/system/plugin/fontawesome/css/fontawesome-all.min.css">
    <link rel="stylesheet" href="<?php echo $baseUrl?>/system/plugin/fontawesome/css/fontawesome.css">
    <!--Bootstrap CSS-->
    <link rel="stylesheet" href="<?php echo $baseUrl?>/system/plugin/bootstrap/css/bootstrap.min.css">
    <!--Datatable-->
    <link rel="stylesheet" href="<?php echo $baseUrl;?>/system/plugin/datatables/css/dataTables.bootstrap4.min.css">
    <!-- Theme style -->
    <link rel="stylesheet" href="<?php echo $baseUrl;?>/system/plugin/adminlte/css/adminlte.min.css">
    <!-- overlayScrollbars -->
    <link rel="stylesheet" href="<?php echo $baseUrl;?>/system/plugin/overlayScrollbars/css/OverlayScrollbars.min.css">
    <!-- Google Font: Source Sans Pro -->
    <link href="<?php echo $baseUrl;?>/system/plugin/googlefont/css/googlefont.min.css" rel="stylesheet">
</head>
<body class="hold-transition sidebar-mini layout-fixed">
    <div class="wrapper">
        <!-- Top Navbar -->
        <nav class="main-header navbar navbar-expand navbar-white navbar-light">
            <!-- Left navbar links -->
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
                </li>
            </ul>

            <!-- Right navbar links -->
            <ul class="navbar-nav ml-auto">
                <li class="nav-item">
                    <p id="global-user-name" class="mr-2 mt-2">Michael Martin G. Abellana</p>
                    <p id="base-url" class="d-none"><?php echo $baseUrl;?></p>
                </li>
                <li class="nav-item">
                    <a class="" data-toggle="dropdown" href="#">
                        <img id="global-user-image" class="rounded-circle" src="<?php echo $baseUrl;?>/system/images/blank-profile.png" width="40px" height="40px">
                    </a>
                    <div class="dropdown-menu dropdown-menu-right mt-13" aria-labelledby="dropdownMenuLink">
                        <a class="dropdown-item" href="../profile-setting"><i class="fa fa-user pr-2"></i> Profile</a>
                            <div class="dropdown-divider"></div>
                        <a class="dropdown-item" href="#" onclick="$('#logout-modal').modal('show');"><i class="fa fa-power-off pr-2"></i> Logout</a>
                    </div>
                </li>
            </ul>
        </nav>
        <!-- /Top Navbar -->

        <!-- Main Sidebar Container -->
        <aside class="main-sidebar sidebar-dark-primary elevation-4" style="background-color:<?php echo $brandColor;?>">
            <!-- Brand Logo -->
            <a href="#" class="brand-link text-center pb-0">
                <img id="global-client-logo" src="<?php echo $schoolImage;?>" class="rounded mb-2 w-50">
                <p id="global-department-name" class="text-wrap"><?php echo $schoolName;?><br>Faculty</p>
            </a>
            <?php include "../side-nav-bar.html"?>
        </aside>
        <!-- Content Wrapper. Contains page content -->
        <div class="content-wrapper">
            <!-- Content Header (Page header) -->
            <div class="content-header">
                <div class="container-fluid">
                    <div class="row mb-2">
                        <div class="col-sm-6">
                            <h1 class="m-0 text-dark">Dashboard</h1>
                        </div><!-- /.col -->
                        <div class="col-sm-6">
                            <ol class="breadcrumb float-sm-right">
                                <li class="breadcrumb-item"><a href="<?php echo $baseUrl;?>">Home</a></li>
                                <li class="breadcrumb-item active">Dashboard</li>
                            </ol>
                        </div><!-- /.col -->
                    </div><!-- /.row -->
                </div><!-- /.container-fluid -->
            </div><!-- /.content-header -->
            <!-- Main content -->
            <section class="content">
                <div class="container-fluid">
                     <!-- Small boxes (Stat box) -->
                    <div class="row">
                        <div class="col-lg-3 col-6">
                            <!-- small box -->
                            <div class="small-box bg-info">
                                <div class="inner">
                                    <h3 id="student-count">0</h3>
                                    <p>Student Count</p>
                                </div>
                                <div class="icon">
                                    <i class="fas fa-graduation-cap"></i>
                                </div>
                                <a href="#" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                        <div class="col-lg-3 col-6">
                            <!-- small box -->
                            <div class="small-box bg-success">
                                <div class="inner">
                                    <h3 id="student-present">0</h3>
                                    <p>Present Students</p>
                                </div>
                                <div class="icon">
                                    <i class="fas fa-check"></i>
                                </div>
                                <a href="../student-attendance" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                        <div class="col-lg-3 col-6">
                            <!-- small box -->
                            <div class="small-box bg-danger">
                                <div class="inner">
                                    <h3 id="student-absent">0</h3>
                                    <p>Absent Students</p>
                                </div>
                                <div class="icon">
                                    <i class="fas fa-window-close"></i>
                                </div>
                                <a href="../student-attendance" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                    </div>
                    <dic class="row">
                        <div class="col">
                            <div class="card">
                                <div class="card-header">
                                    <h3 class="card-title">Student List</h3>
                                </div>
                                <div class="card-body">
                                    <div id="table-container"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div><!-- /.container-fluid -->
            </section><!-- /.content -->
        </div><!-- /.content-wrapper -->
        <footer class="main-footer">
            <strong>Copyright &copy; 2022 <a href="#"><?php echo $brand;?></a>.</strong>
                All rights reserved.
            <div class="float-right d-none d-sm-inline-block">
                <b>Version</b> 1.0.0
            </div>
        </footer>
    </div>
    <!-- ./wrapper -->

    <!-- Logout Modal -->
    <div class="modal fade" id="logout-modal" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog modal-dialog-centered modal-sm" role="document">
            <div class="modal-content">
                <div class="modal-header bg-danger p-2">
                    <h5 class="modal-title">Logout</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true" class="text-white">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <p>Do you want to logout?</p>
                </div>
                <div class="modal-footer p-2">
                    <button type="button" class="btn btn-danger w-50 btn-sm" data-dismiss="modal" onclick="logout()">Yes</button>
                </div>
            </div>
        </div>
    </div>

<!-- jQuery -->
<script src="<?php echo $baseUrl;?>/system/plugin/jquery/js/jquery.min.js"></script>
<script src="<?php echo $baseUrl;?>/system/plugin/jquery/js/jquery.dataTables.min.js"></script>
<!--Popper JS-->
<script src="<?php echo $baseUrl;?>/system/plugin/popper/js/popper.min.js"></script>
<!--Bootstrap-->
<script src="<?php echo $baseUrl;?>/system/plugin/bootstrap/js/bootstrap.min.js"></script>
<!-- Admin LTE -->
<script src="<?php echo $baseUrl;?>/system/plugin/adminlte/js/adminlte.js"></script>
<!-- overlayScrollbars -->
<script src="<?php echo $baseUrl;?>/system/plugin/overlayScrollbars/js/jquery.overlayScrollbars.min.js"></script>
<!--Datatables-->
<script src="<?php echo $baseUrl;?>/system/plugin/datatables/js/dataTables.bootstrap4.min.js"></script>

<!-- Page Level Script -->
<script src="script.js"></script>
</body>
</html>
