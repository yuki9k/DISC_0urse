<?php 
require_once("auxFunctions.php");

$requestMehod = $_SERVER["REQUEST_METHOD"];
if(!in_array($requestMethod, $allowedMethods)){
    sendError(400, "METHOD NOT ALLOWED");
}
$requestData = getRequestData();
//reg new user
if($requestMehod == "POST"){
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