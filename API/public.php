<?php
require_once("auxFunctions.php");
$allowedMethods = ["GET", "PATCH"];

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
//get ROOMS
if($requestMethod == "GET"){
    //maybe add getting rooms based on user memberships?
    $rooms =  getDatabase("pubRooms");
    if(empty($rooms)){
        sendError(400, "no rooms found, something wrong with DB");
    }
    send(200, $rooms);
}
if($requestMethod == "PATCH"){
    if(!isset($requestData["hostToken"])){
        sendError(450, "no access");
    }
    if(!isset($requestData["id"])){
        sendError(404, "missing key, ID");
    }
    $patchedRoom = findItemByKey("pubRooms", "id", $requestData["id"]);
    $patchedRoom["genre"] = $requestData["genre"];
    updateItemByType("pubRooms", $patchedRoom);
    send(200, $patchedRoom);
}
?>