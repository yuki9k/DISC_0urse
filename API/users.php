<?php 
require_once("auxFunctions.php");
$allowedMethods = ["GET", "POST", "PATCH", "DELETE"];

$requestMethod = $_SERVER["REQUEST_METHOD"];
if(!in_array($requestMethod, $allowedMethods)){
    sendError(400, "METHOD NOT ALLOWED");
}
$requestData = getRequestData();
//reg new user
if($requestMethod == "POST"){
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
    $userKeys = ["name", "password", "profilePicture", "score", "friends"];
    $userValues = ["name" => $name, "password" => $requestData["password"], "profilePicture" => "placeholder", "score" => 0, "friends" => []];

    $newUser = addItemByType("users", $userKeys, $userValues);
    unset($newUser["password"]);
    send(201, $newUser);
}
if($requestMethod == "DELETE"){
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