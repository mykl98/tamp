<?php
if($_SERVER['SERVER_ADDR'] == '127.0.0.1' || $_SERVER['SERVER_ADDR'] == '::1' || $_SERVER['SERVER_ADDR'] == "localhost"){
	$servername = "localhost";
	$username = "root";
	$password = "";
	$dbname = "dmdtech-offline";
	$conn = new mysqli($servername, $username, $password, $dbname);
	$baseUrl = "http://localhost/dmdtech_offline";
}else if($_SERVER['SERVER_ADDR'] == '192.168.0.100'){
	$servername = "localhost";
	$username = "root";
	$password = "Skooltech@123456";
	$dbname = "dmdtech-offline";
	$conn = new mysqli($servername, $username, $password, $dbname);
	$baseUrl = "http://".$_SERVER['SERVER_ADDR'];
}else{
	$servername = "localhost";
	$username = "u528264240_dmdtech";
	$password = "Skooltech@123456";
	$dbname = "u528264240_dmdtech";
	$conn = new mysqli($servername, $username, $password, $dbname);
	$baseUrl = "https://dmdtech.raptorapps.xyz";
}

$brand = "DMDTech Solutions";

date_default_timezone_set("Asia/Manila");

function sanitize($input){
	global $conn;
	$output = mysqli_real_escape_string($conn, $input);
	return $output;
}

function randomNumber($length){
	$characters = '0123456789';
	$charactersLength = strlen($characters);
	$randomString = '';
	for ($i = 0; $i < $length; $i++) {
		$randomString .= $characters[rand(0, $charactersLength - 1)];
	}
	return $randomString;
}

function generateCode($length){
	$characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	$charactersLength = strlen($characters);
	$randomString = '';
	for ($i = 0; $i < $length; $i++) {
		$randomString .= $characters[rand(0, $charactersLength - 1)];
	}
	return $randomString;
}

?>