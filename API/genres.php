<?php 
require_once("auxFunctions.php");
$allowedMethods = ["GET", "POST"];

$requestMethod = $_SERVER["REQUEST_METHOD"];
if(!in_array($requestMethod, $allowedMethods)){
    sendError(400, "METHOD NOT ALLOWED");
}
$requestData = getRequestData();
if($requestMethod == "POST"){
    if(empty($requestData)){
        sendError(400, "bad request");
    }
    file_put_contents("genres.json", $requestData);
}
if($requestMethod == "GET"){
    //this method sends genre information to the client.
    $DBinfo = getDatabase("genres");
    if(!$DBInfo){
        sendError("genre DB empty");
    }
    send(200, $DBInfo);
}
?>