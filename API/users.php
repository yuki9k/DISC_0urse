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
//reg new user
if ($requestMethod == "GET") {
    $users = getDatabase("users");
    if (isset($requestData["id"]) || isset($requestData["token"])) {
        if (isset($requestData["token"])) {
            $tokenUser = getUserFromToken($requestData["token"]);
            unset($tokenUser["password"]);
            send(200, $tokenUser);
        }

        foreach ($responsUsers as $index => $user) {
            if ($user["id"] == $requestData["id"]) {
                $singleUser = $user;
                unset($singleUser["password"]);
                unset($singleUser["friends"]);
                send(200, $singleUser);
            }
        }
        send(404, "user not found");
    }

    $multipleUsers = [];
    foreach ($users as $user) {
        $singleUser = $user;
        unset($singleUser["password"]);
        unset($singleUser["friends"]);
        $multipleUsers[] = $singleUser;
    }
    send(200, $multipleUsers);

}
if ($requestMethod == "POST") {
    if (empty($requestData)) {
        sendError(400, "empty req");
    }
    $userPostKeys = ["name", "password"];
    if (requestContainsSomeKeys($requestData, $userPostKeys) == false) {
        sendError(400, "bad request missing keys");
    }

    $name = $requestData["name"];
    $user = findItemByKey("users", "name", $name);
    if ($user != false) {
        sendError(400, "Bad req, username taken");
    }
    $userKeys = ["name", "password", "profilePicture", "score", "friends", "status"];
    $userValues = ["name" => $name, "password" => $requestData["password"], "profilePicture" => "placeholder", "score" => 0, "friends" => [], "status" => ""];

    $newUser = addItemByType("users", $userKeys, $userValues);
    unset($newUser["password"]);
    send(201, $newUser);
}
if ($requestMethod == "DELETE") {
    if (empty($requestData)) {
        sendError(400, "empty req");
    }
    if (!isset($requestData["token"])) {
        sendError(400, "missing token");
    }

    $user = getUserFromToken($requestData["token"]);

    if (!$user) {
        sendError(400, "bad request(invalid token)");
    }
    //remove users posts??
    //how do we deal with deleted users?
    removeUserRoomsLikesPosts($user);
    $deletedUser = deleteItemByType("users", $user);
    unset($deletedUser["password"]);
    send(200, $deletedUser);
}
if ($requestMethod == "PATCH") {
    //method should handle, added friends, removed friends, change password, change profile picture, updatescore
    if (empty($requestData)) {
        sendError(400, "empty req");
    }
    if (!isset($requestData["token"])) {
        sendError(400, "missing token");
    }
    $user = getUserFromToken($requestData["token"]);

    if (!$user) {
        sendError("bad request(invalid token)");
    }
    if (isset($requestData["friendID"])) {
        //if friend ID is in friend array remove said friend
        if (in_array($user["friends"], $requestData["friendID"])) {
            foreach ($user["friends"] as $index => $id) {
                if ($id == $requestData["friendID"]) {
                    array_splice($user["friends"], $index, 1);
                }
            }
        } else { //ID not in friend array, add friend to array
            $user["friends"][] = $requestData["friendID"];
        }
    }
    if (isset($requestData["password"])) {
        //change password
        $user["password"] = $requestData["password"];
    }
    if (isset($requestData["name"])) {
        //change username
        $user["name"] = $requestData["name"];
    }
    if (isset($requestData["profilePicture"])) {
        $user["profilePicture"] = $requestData["profilePicture"];
    }
    if (isset($requestData["score"])) {
        $globalPosts = getDatabase("posts");
        $userPosts;
        foreach ($globalPosts as $index => $post) {
            if ($post["userID"] == $user["id"]) {
                $userPosts[] = $post;
            }
        }
        foreach ($userPosts as $index => $post) {
            $user["score"] + count($post["likedBy"]);
            $user["score"] - count($post["dislikedBy"]);
        }
    }
    if (isset($requestData["status"])) {
        $user["status"] = $requestData["status"];
    }
    updateItemByType("users", $user);
    unset($user["password"]);
    send(200, $user);
}
?>