<?php 
require_once("auxFunctions.php");
$allowedMethods = ["GET", "POST", "PATCH", "DELETE"];

if ($_SERVER["REQUEST_METHOD"] == "OPTIONS") {
    header("Access-Control-Allow-Headers: *");
    header("Access-Control-Allow-Methods: *");
    header("Access-Control-Allow-Origin: *");
    exit();
} else {
    header("Access-Control-Allow-Origin: *");
}

$requestMethod = $_SERVER["REQUEST_METHOD"];
if(!in_array($requestMethod, $allowedMethods)){
    sendError(400, "METHOD NOT ALLOWED");
}
$requestData = getRequestData();
//login as new user
if($requestMethod == "POST"){
    if(empty($requestData)){
        sendError(400, "empty req");
    }
    
    $reqLoginKeys = ["name", "password"];
    if(requestContainsSomeKeys($requestData, $reqLoginKeys) == false){
        sendError(400, "bad request missing keys");
    }
    $name = $requestData["name"];
    $password = $requestData["password"];
    $user = findItemByKey("users", "name", $name);

    if($user == false){
        sendError(404, "user not found");
    }
    if($user["password"] != $password){
        sendError(400, "invalid password");
    }
    $token = ["token" => sha1("$name$password")];
    send(200, $token);
}
?>
