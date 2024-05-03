<?php
require_once("auxFunctions.php");
$allowedMethods = ["GET", "POST", "PATCH", "DELETE"];


$requestMethod = $_SERVER["REQUEST_METHOD"];
if(!in_array($requestMethod, $allowedMethods)){
    sendError(400, "METHOD NOT ALLOWED");
}
$requestData = getRequestData();

if($requestMethod == "GET"){//Get posts
    //we find either a post based on room and user
    //token not required
    $posts = getDatabase("posts");
    if(isset($requestData["roomID"])){
        foreach($posts as $index => $post){
            if($post["roomID"] != $requestData["roomID"]){
                array_splice($posts, $index, 1);
            }
        }
    }
    if(isset($requestData["userID"])){
        foreach($posts as $index => $post){
            if($post["userID"] != $requestData["userID"]){
                array_splice($posts, $index, 1);
            }
        }
    }
    if(empty($posts)){
        sendError(400, "no games found");
    }
    send(200, $posts);
}
if($requestMethod == "POST"){//TOKEN REQUIRED
    if(empty($requestData)){
        sendError(400, "empty request");
    }
    $reqPostKeys = ["token", "roomID", "time", "content", "style"];
    if(requestContainsSomeKeys($requestData, $reqPostKeys) == false){
        send(400, "missing keys");
    }

    $user = getUserFromToken($requestData["token"]);
    if(!$user){
        sendError(404, "user not found");
    }
    $postKeys = ["userID", "roomID", "time", "content", "style", "likedBy", "dislikedBy"];
    $requestData["userID"] = $user["id"];
    $requestData["likedBy"] = [$user["id"]];
    $requestData["dislikedBy"] = [];
    $newPost = addItemByType("posts", $postKeys, $requestData);
    send(202, $newPost);
}
//POST HAS BEEN LIKED DISLIKED 
if($requestMethod == "PATCH"){
    //THIS METHOD SHOULD CHECK IF THE POST IS LIKED or DISLIKED
    //CHANGE IT DEPENDING
}
//POST HAS BEEN DELETED
if($requestMethod == "DELETE"){

}
?>