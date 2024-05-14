<?php 
require_once("auxFunctions.php");

$requestMethod = $_SERVER["REQUEST_METHOD"];
if($requestMethod != "POST"){
    sendError(400, "METHOD NOT ALLOWED");
}
$requestData = getRequestData();
$dir = "./profilePictures/";
//req token!!
if($requestMethod == "POST"){
    $pfp = $_FILES["pfp"];
    $user = getUserFromToken($requestData["token"]);
    $destination = $dir . $user["name"] . "_pfp.jpg";
    $source = $pfp["tmp_name"];
    move_uploaded_file($source, $destination);
    send(200, $destination);
}
?>