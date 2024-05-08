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
    $reqPostKeys = ["token", "roomID", "time", "content"];
    if(requestContainsSomeKeys($requestData, $reqPostKeys) == false){
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
    if(in_array(["id"], $requestData) && in_array(["userID"])){
        if(in_array(["likedBy"]) || in_array(["dislikedBy"])){
            $post = findItemByKey("posts", "id", $requestData["id"]);
        }else{sendError(400, "no patchable data");}
    }
    else{sendError(400, "missing userID or id of post");}
    if(in_array($requestData["id"], $post["likedBy"])){
        //dislike and remove like
        foreach($like as $index => $post["likedBy"]){
            if($like == $ $requestData["id"]){
                array_splice($post["likedBy"], $index, 1);
            }
        }
        $post["dislikedBy"][] = $requestData["id"];
    } else if(in_array($requestData["id"], $post["dislikedBy"])){
        //like and remove dislike
        foreach($like as $index => $post["dislikedBy"]){
            if($like == $ $requestData["id"]){
                array_splice($post["dislikedBy"], $index, 1);
            }
        }
        $post["likedBy"][] = $requestData["id"];
    }
    updateItemByType("posts", $post);
    send(201, $post);
}
//POST HAS BEEN DELETED
if($requestMethod == "DELETE"){
    $deleteKeys = ["id"];

    $post = findItemByKey("posts", "id", $requestData["id"]);
    $return = deleteItemByType("posts", $post);
    send(200, $return);
}
?>