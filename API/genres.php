<?php 
require_once("auxFunctions.php");
$allowedMethods = ["GET", "POST"];

$requestMethod = $_SERVER["REQUEST_METHOD"];
if(!in_array($requestMethod, $allowedMethods)){
    sendError(400, "METHOD NOT ALLOWED");
}
$requestData = getRequestData();
if($requestMethod == "POST"){
    $DBInfo = $requestData["data"];
    file_put_contents("genres.json", $DBInfo);
}
if($requestMethod == "GET"){
    //this method sends genre information to the client.
    $DBinfo = getDatabase("genres");
    send(200, $DBInfo);
}
?>