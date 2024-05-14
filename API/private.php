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

//GET ROOMS, BASED ON HOSTID OR ALL ROOMS
if($requestMethod == "GET"){
    $rooms = getDatabase("privRooms");
    if(isset($requestData["hostID"])){
        foreach($rooms as $index => $room){
            if($room["hostID"] != $requestData["hostID"]){
                array_splice($rooms, $index, 1);
            }
        }
    }
    if(empty($rooms)){
        sendError(404, "no rooms found");
    }
    send(200, $rooms);
}
if($requestMethod == "POST"){
    if(empty($requestData)){
        sendError(400, "empty request");
    }
    $reqPostKeys = ["token", "style", "genre", "users"];
    if(requestContainsAllKeys($requestData, $reqPostKeys) == false){
        send(400, "missing keys");
    }
    $user = getUserFromToken($requestData["token"]);
    if(!$user){
        sendError(404, "user not found");
    }
    $postKeys = ["hostID", "style", "genre", "users"];
    $requestData["hostID"] = $user["id"];
    $requestData["users"][] = $requestData["hostID"];
    unset($requestData["token"]);
    $newRoom = addItemByType("privRooms", $postKeys, $requestData);
    send(200, $newRoom);
}
//INVITE NEW MEMBERS, CHANGE STYLE, CHANGE ALBUM/GENRE??
if($requestMethod == "PATCH"){
    if (empty($requestData)) {
        sendError(400, "empty request");
    }
    if(!isset($requestData["token"]) || !isset($requestData["id"])){
        sendError(400, "bad request, missing keys");
    }
    $room = findItemByKey("privRooms", "id", $requestData["id"]);
    $user = getUserFromToken($requestData["token"]);
    if($user["id"] != $room["hostID"]){
        sendError(402, "invalid token, not host");
    }
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
    updateItemByType("privRooms", $room);
    send(201, $room);
}
//DELETE ROOM
if($requestMethod == "DELETE"){
    if (empty($requestData)) {
        sendError(400, "empty request");
    }
    if(!isset($requestData["token"])){
        sendError(400, "bad request, need token to delete rooms");
    }
    $room = findItemByKey("privRooms", "id", $requestData["id"]);
    $user = getUserFromToken($requestData["token"]);
    if($room["hostID"] != $user["id"]){
        removeRoomPosts($room);
        $deletedItem = deleteItemByType("privRooms", $room);
        send(200, $deletedItem);
    } else {
        sendError(400, "wrong userID, only the host of roomID_" . $room["id"]. " can delete");
    }
}
?>
