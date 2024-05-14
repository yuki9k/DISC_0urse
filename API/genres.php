<?php 
require_once("auxFunctions.php");
require_once("../php/httpHandlers.php");

if ($_SERVER["REQUEST_METHOD"] == "OPTIONS") {
    header("Access-Control-Allow-Headers: *");
    header("Access-Control-Allow-Methods: *");
    header("Access-Control-Allow-Origin: *");
    exit();
} else {
    header("Access-Control-Allow-Origin: *");
}

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
    $genres =  json_decode($requestData);
    foreach($genre as $index => $genres){
        $image = file_get_contents($genre["albumImages"][0]["url"], false);
        file_put_contents("/albumPics/$index.jpeg", $image);
    }
}
if($requestMethod == "GET"){
    //this method sends genre information to the client.
    $DBInfo = getDatabase("genres");
    if(!$DBInfo){
        sendError("genre DB empty");
    }
    send(200, $DBInfo);
}
?>