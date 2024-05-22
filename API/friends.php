<?php
require_once ("auxFunctions.php");
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
if (!in_array($requestMethod, $allowedMethods)) {
    sendError(400, "METHOD NOT ALLOWED");
}
$requestData = getRequestData();
//NEW FRIEND REQEST
if($requestMethod == "POST"){
    $requiredKeys = ["name", "token"];
    if(!requestContainsAllKeys($requestData, $requiredKeys)){
        sendError(400, "missing keys");
    }
    $user = getUserFromToken($requestData["token"]);
    $friend = findItemByKey("users", "name", $requestData["name"]);
    if(in_array($user["id"], $friend["friendRequests"])){
        //user ID already in this users requests, duplicate request
        sendError(401, "this user already has a pending request");
    } else if (in_array($friend["id"], $user["friendRequests"])){
        //both users have requested eachother
        $user["friends"][] = $friend["id"];
        $friend["friends"][] = $user["id"];
        foreach($user["friendRequests"] as $index => $id){
            if($friend["id"] == $id){
                array_splice($user["friendRequests"], $index, 1);
            }
        }
        foreach($friend["friendRequests"] as $index => $id){
            if($user["id"] == $id){
                array_splice($user["friendRequests"], $index, 1);
            }
        }
        updateItemByType("users", $user);
        updateItemByType("users", $friend);
        unset($user["password"]);
        send(200, $user);
    } else {
        //new friend request add the request
        $friend["friendRequests"][] = $user["id"];
        updateItemByType("users", $friend);
        unset($friend["password"]);
        send(200, $friend);
    }
}


?>