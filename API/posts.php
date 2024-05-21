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
        sendError(400, "no posts found");
    }
    send(200, $posts);
}
if($requestMethod == "POST"){//TOKEN REQUIRED
    if(empty($requestData)){
        sendError(400, "empty request");
    }
    $reqPostKeys = ["token", "roomID", "time", "content"];
    if(requestContainsAllKeys($requestData, $reqPostKeys) == false){
        send(400, "missing keys");
    }

    $user = getUserFromToken($requestData["token"]);
    if(!$user){
        sendError(404, "user not found");
    }
    $postKeys = ["userID", "roomID", "time", "content", "likedBy", "dislikedBy"];
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
    if(empty($requestData)){
        sendError(400, "empty request");
    }
    $post;
    //id, token, likedBy
    $user = getUserFromToken($requestData["token"]);
    if(!$user){
        sendError(404, "no user found");
    }
    if(isset($requestData["id"]) && isset($requestData["token"])){
        $post = findItemByKey("posts", "id", $requestData["id"]);
        if($post == false){
            sendError(404, "post not found");
        }
    }
    else{sendError(400, "missing token or id of post");}

    if(in_array($user["id"], $post["likedBy"])){
        //remove like
        foreach($post["likedBy"] as $index => $like){
            if($like == $user["id"]){
                array_splice($post["likedBy"], $index, 1);
            }
        }
    } else if(in_array($user["id"], $post["dislikedBy"])){
        //remove dislike
        foreach($post["dislikedBy"] as $index => $like){
            if($like == $user["id"]){
                array_splice($post["dislikedBy"], $index, 1);
            }
        }
    }
    if(isset($requestData["like"])){
        $post["likedBy"][] = $user["id"];
    } else if (isset($requestData["dislike"])){
        $post["dislikedBy"][] = $user["id"];
    }
    updateItemByType("posts", $post);
    send(201, $post);
}
//POST HAS BEEN DELETED
if($requestMethod == "DELETE"){
    $deleteKeys = ["id", "token"];
    if(isset($requestData["adminToken"])){
        //add delete possibilties for admins?
    }
    if(!isset($requestData["id"]) || !isset($requestData["token"])){
        sendError(400, "missing keys");
    }
    $user = getUserFromToken($requestData["token"]);
    $post = findItemByKey("posts", "id", $requestData["id"]);
    if($user["id"] != $requestData["id"]){
        sendError(400, "only post owner can delete post");
    }
    $return = deleteItemByType("posts", $post);
    send(200, $return);
}
?>