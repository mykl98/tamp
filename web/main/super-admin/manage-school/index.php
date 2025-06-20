<?php
    include_once "../../../system/backend/config.php";
    session_start();
    $idx = $_SESSION["loginidx"];

    if($_SESSION["isLoggedIn"] == "true" && $_SESSION["access"] == "super-admin"){
    
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
    <title>Super Admin | Manage Schools</title>
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
    <!--Croppie-->
    <link rel="stylesheet" href="<?php echo $baseUrl;?>/system/plugin/croppie/css/croppie.css">
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
                <img id="global-client-logo" src="<?php echo $baseUrl;?>/system/images/logo.png" class="rounded mb-2" width="100px">
                <p id="global-department-name" class="">Super Admin</p>
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
                            <h1 class="m-0 text-dark">Manage Schools</h1>
                        </div><!-- /.col -->
                        <div class="col-sm-6">
                            <ol class="breadcrumb float-sm-right">
                                <li class="breadcrumb-item"><a href="#">Home</a></li>
                                <li class="breadcrumb-item active">Manage Schools</li>
                            </ol>
                        </div><!-- /.col -->
                    </div><!-- /.row -->
                </div><!-- /.container-fluid -->
            </div><!-- /.content-header -->
            <!-- Main content -->
            <section class="content">
                <div class="row">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-header">
                                <button class="btn btn-sm bg-success" onclick="addSchool()"><span class="fa fa-plus"></span> New</button>
                            </div>
                            <div class="card-body">
                                <div id="school-table-container"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section><!-- /.content -->
        </div><!-- /.content-wrapper -->
        <footer class="main-footer">
            <strong>Copyright &copy; <?php echo date("Y");?> <a href="#"><?php echo $brand;?></a>.</strong>
                All rights reserved.
            <div class="float-right d-none d-sm-inline-block">
                <b>Version</b> 1.0.0
            </div>
        </footer>
    </div>
    <!-- ./wrapper -->

    <!-- Modals -->
    <div class="modal fade" id="add-edit-school-modal" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="add-edit-school-modal-title">Create New School</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="row">
                            <div class="col">
                                <div class="form-group text-center">
                                    <input type="file" accept="image/*" onchange="loadImage(event)" style="display:none;" id="load-image-btn">
                                    <img id="school-image" src="<?php echo $baseUrl;?>/system/images/no-image-available.jpg" onclick="$('#load-image-btn').click()" class="w-100">
                                </div>
                                <div class="form-group">
                                    <label for="school-id" class="col-form-label">ID:</label>
                                    <input type="text" class="form-control form-control-sm" id="school-id" placeholder="Automatically Generated" readonly>
                                </div>
                            </div>
                            <div class="col">
                                <p class="bg-secondary px-2">School Details</p>
                                <div class="form-group">
                                    <label for="school-name" class="col-form-label">Name:</label>
                                    <input type="text" class="form-control form-control-sm" id="school-name">
                                </div>
                                <div class="form-group">
                                    <label for="school-address" class="col-form-label">Address:</label>
                                    <textarea class="form-control form-control-sm" id="school-address"></textarea>
                                </div>
                                <div class="form-group">
                                    <label for="school-color" class="col-form-label">Color:</label>
                                    <input type="color" class="form-control form-control-sm" id="school-color">
                                </div>
                                <div class="form-group">
                                    <label for="school-status" class="col-form-label">Status:</label>
                                    <select class="form-control form-control-sm" id="school-status">
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <p id="add-edit-school-modal-error" class="text-danger font-italic small"></p>
                    <button type="button" class="btn btn-success w-25" onclick="saveSchool()">Save</button>
                </div>
            </div>
        </div>
    </div>

     <!-- Profile Image Editor Modal -->
     <div class="modal" id="image-editor-modal" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-secondary"><strong>Image Editor</strong></h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close" onclick="imageEditorCancel()">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <img id="image-editor-buffer">
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary w-25" onclick="imageEditorRotate()">Rotate</button>
                    <button type="button" class="btn btn-info w-25" data-dismiss="modal" id="image-editor-ok-btn">Ok</button>
                </div>
            </div>
        </div>
    </div>

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

    <!-- Processing Modal -->
    <div class="modal" id="processing-screen-modal" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog modal-sm modal-centered">
            <div class="modal-content">
                <div class="modal-body text-center">
                    <div class="spinner-grow text-primary" role="status"></div>
                    <div class="spinner-grow text-danger" role="status"></div>
                    <div class="spinner-grow text-success" role="status"></div>
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
<!-- overlayScrollbars -->
<script src="<?php echo $baseUrl;?>/system/plugin/overlayScrollbars/js/jquery.overlayScrollbars.min.js"></script>
<!--Datatables-->
<script src="<?php echo $baseUrl;?>/system/plugin/datatables/js/dataTables.bootstrap4.min.js"></script>
<!--Croppie-->
<script src="<?php echo $baseUrl;?>/system/plugin/croppie/js/croppie.js"></script>

<!-- Page Level Script -->
<script src="script.js"></script>
</body>
</html>
