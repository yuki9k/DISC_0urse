<?php
require_once("auxFunctions.php");

$requestMehod = $_SERVER["REQUEST_METHOD"];
if(!in_array($requestMethod, $allowedMethods)){
    sendError(400, "METHOD NOT ALLOWED");
}
$requestData = getRequestData();
//get ROOMS
if($requestMethod == "GET"){
    //if(!isset($requestData["id"])){
    //    sendError(400, "missing so")
    //}
    $rooms =  getDatabase("pubRooms");
    if(empty($rooms)){
        sendError(400, "no rooms found, something wrong with DB");
    }
    send(200, $rooms);
}
//ROOM has ["id", "genre", "album"]
//can patch album??
if($requestMehod == "PATCH"){
    if(!isset($requestData["hostToken"])){
        sendError(450, "no access");
    }
    if(!isset($requestData["id"])){
        sendError(404, "missing key, ID");
    }
    $patchedRoom = findItemByKey("pubRooms", "id", $requestData["id"]);
    $patchedRoom["genre"] = $requestData["genre"];
    send(200, $patchedRoom);
}
?>