<?php
function send($status = 200, $data = []){
    header("Content-Type: application/json");
    http_response_code($status);
    echo json_encode($data);
    exit();
}
function sendError($status = 400, $message = ""){
    send($status, ["error" => $message]);
}
function getRequestData(){

    if($_SERVER["REQUEST_METHOD"] == "GET"){
        return $_GET;
    }

    if($_SERVER["CONTENT_TYPE"] != "application/json"){
        //SEND ERROR
    }

    $json = file_get_contents("php://input");
    return json_decode($json, true);
}
function getDatabase($type){

    $DB = "DB/$type.json";
    if(file_exists($DB) == false){
        //DB NOT REAL BAD STUFF
    }

    $returnContent =  file_get_contents($DB);
    $returnData = json_decode($returnContent, true);
    return $returnData;
}
function findItemByKey($type, $key, $value){

    $DB = getDatabase($type);
    foreach($DB as $d){
        if(isset($d[$key]) && $d[$key] == $value){
            return $d;
        }
    }
    return false;
}
function addItemByType($type, $keys, $data){
    $DB = getDatabase($type);
    $newItem = [];
    foreach($keys as $key){
        $newItem[$key] = $data[$key];
    }
    $id = 0;
    foreach ($DB as $item){
        if(isset($item["id"]) && $item["id"] > $id){
            $id = $item["id"];
        }
    }
    $newItem["id"] = $id + 1;
    $DB[] = $newItem;
    $json = json_encode($DB, JSON_PRETTY_PRINT);
    file_put_contents("DB/$type.json", $json);
    return $newItem;
    //add keys
    //add ID
    //DB[] = $newItem;
    //JSONencode + fileputcontents
    //return newitem
}
function requestContainsAllKeys($data, $keys) {
    foreach ($keys as $key) {
        if (isset($data[$key]) == false) {
            return false;
        }
    }
    return true;
}
function updateItemByType($type, $updatedItem){
    $DB = getDatabase($type);
    //for loop finding updated item and then setting that index to the updated item
    foreach($DB as $index => $item){
        if(isset($item["id"]) && $item["id"] == $updatedItem["id"]){
            $DB[$index] = $updatedItem;
        }
    }
    $json = json_encode($DB, JSON_PRETTY_PRINT);
    file_put_contents("DB/$type.json", $json);
    return $updatedItem;
}
function deleteItemByType($type, $itemToDelete){
    $DB = getDatabase($type);
    foreach($DB as $index => $item){
        if(isset($item["id"]) && $item["id"] == $itemToDelete["id"]){
            array_splice($DB, $index, 1);
        }
    }
    $json = json_encode($DB, JSON_PRETTY_PRINT);
    file_put_contents("DB/$type.json", $json);
    return $itemToDelete;
}
function requestContainsSomeKeys($data, $keys)
{
    foreach ($keys as $key) {
        if (isset($data[$key])) {
            return true;
        }
    }

    return false;
}
function getUserFromToken($token){
    $users =  getDatabase("users");
    foreach($users as $user){
        if(isset($user["name"], $user["password"])){
            $name = $user["name"];
            $password = $user["password"];
            $userToken = sha1("$name$password");

            if($token == $userToken){
                return $user;
            }
        }
    }
}
function removeRoomPosts($room){
    $posts = getDatabase("posts");
    foreach($posts as $index => $post){
        if($post["roomID"] == $room["id"]){
            array_splice($posts, $index, 1);
        }
    }
    $jsonPosts = json_encode($posts, JSON_PRETTY_PRINT);
    file_put_contents("DB/posts.json", $jsonPosts);
}
function removeUserRoomsLikesPosts($user){
    $privateRooms = getDatabase("privRooms");
    $posts = getDatabase("posts");
    $userID = $user["id"];
    //delete users hosted room
    foreach($privateRooms as $index => $room){
        if($room["hostID"] == $userID){
            //remove all posts in the room
            foreach($posts as $j_index => $post){
                if($post["roomID"] == $room["id"]){
                    array_splice($posts, $j_index, 1);
                }
            }
            //remove the room
            array_splice($privateRooms, $index, 1);
        }
    }
    //delete users posted posts and likes/dislikes to posts
    foreach($posts as $index => $post){
        if($post["userID"] == $userID){
            array_splice($posts, $index, 1);
        } else {
            foreach($post["likedBy"] as $j_index => $id){
                if($id == $userID){
                    array_splice($post["likedBy"], $j_index, 1);
                }
            }
            foreach($post["dislikedBy"] as $j_index => $id){
                if($id == $userID){
                    array_splice($post["dislikedBy"], $j_index, 1);
                }
            }
        }
    }

    $jsonPosts = json_encode($posts, JSON_PRETTY_PRINT);
    file_put_contents("DB/posts.json", $jsonPosts);
    $jsonRooms = json_encode($provateRooms, JSON_PRETTY_PRINT);
    file_put_contents("DB/privRooms.json", $jsonRooms);
}
?>