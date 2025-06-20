<?php
$servername = "127.0.0.1";
$username = "root";
$password = "Skooltech@123456";
$dbname = "dmdtech-offline-v3";
$conn = new mysqli($servername, $username, $password, $dbname);
$baseUrl = "http://".$_SERVER['SERVER_ADDR'] . ":8080";

$brand = "DMDTech Solutions";
$brandColor = "#000000";

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