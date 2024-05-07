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
    $userPostKeys = ["name", "password"];
    if(requestContainsSomeKeys($requestData, $userPostKeys) == false){
        sendError(400, "bad request missing keys");
    }

    $name = $requestData["name"];
    $user = findItemByKey("users", "name", $name);
    if($user != false){
        sendError(400, "Bad req, username taken");
    }

    $newUser = addItemByType("users", $userPostKeys, $requestData);
    unset($newUser["password"]);
    send(201, $newUser);
}
if($requestMehod == "DELETE"){
    if(empty($requestData)){
        sendError(400, "empty req");
    }
    if(!isset($requestData["token"])){
        sendError(400, "missing token");
    }

    $user = getUserFromToken($requestData["token"]);

    if(!$user){
        sendError("bad request(invalid token)");
    }

    //remove users posts??
    //how do we deal with deleted users?

    $deletedUser = deleteItemByType("users", $user);
    unset($deletedUser["password"]);
    send(200, $deletedUser);
}
?>