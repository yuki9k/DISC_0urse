<?php
require_once("auxFunctions.php");

$requestMehod = $_SERVER["REQUEST_METHOD"];
if(!in_array($requestMethod, $allowedMethods)){
    sendError(400, "METHOD NOT ALLOWED");
}
$requestData = getRequestData();

//GET ROOMS, BASED ON HOSTID OR ALL ROOMS
if($requestMehod == "GET"){
    $rooms = getDatabase("privRooms");
    if(isset($requestData["hostID"])){
        foreach($rooms as $index => $room){
            if($room["hostID"] != $requestData["hostID"]){
                array_splice($rooms, $index, 1);
            }
        }
    }
    if(empty($rooms)){
        sendError(400, "no rooms found");
    }
    send(200, $rooms);
}
if($requestMehod == "POST"){
    if(empty($requestData)){
        sendError(400, "empty request");
    }
    $reqPostKeys = ["token", "style", "genre", "users"];
    if(requestContainsSomeKeys($requestData, $reqPostKeys) == false){
        send(400, "missing keys");
    }
    $user = getUserFromToken($requestData["token"]);
    if(!$user){
        sendError(404, "user not found");
    }
    $postKeys = ["hostID", "style", "genre", "users"];
    $requestData["hostID"] = $user["id"];
    unset($requestData["token"]);
    $newRoom = addItemByType("privRooms", $postKeys, $requestData);
    send(200, $newRoom);
}
//INVITE NEW MEMBERS, CHANGE STYLE, CHANGE ALBUM/GENRE??
if($requestMehod == "PATCH"){
    if (empty($requestData)) {
        sendError(400, "empty request");
    }
    $room = findItemByKey("privRooms", "id", $requestData["id"]);
    //add or remove user
    if(isset($requestData["userID"])){
        //user is in room so request is for the removal of user from room
        if(in_array($requestData["userID"], $room["users"])){
            foreach($room["users"] as $index => $user){
                if($user == $requestData["userID"]){
                    array_splice($room["users"], $index, 1);
                }
            }
        } else {
            $room["users"][] = $requestData["userID"];
        }
    }
    if(isset($requestData["style"])){
        $room["style"] = $requestData["style"];
    }
    if(isset($requestData["genre"])){
        $room["genre"] = $requestData["genre"];
        //make room get new album
    }
}
//DELETE ROOM
if($requestMehod == "DELETE"){
    if (empty($requestData)) {
        sendError(400, "empty request");
    }
    if(!isset($requestData["token"])){
        sendError(400, "bad request, need token to delete rooms");
    }
    $room = findItemByKey("privRooms", "id", $requestData["id"]);
    $user = getUserFromToken($requestData["token"]);
    if($room["hostID"] != $user["id"]){
        $deletedItem = deleteItemByType("privRooms", $room);
        send(200, $deletedItem);
    } else {
        sendError(400, "wrong userID, only the host of roomID_" . $room["id"]. " can delete");
    }
}
?>