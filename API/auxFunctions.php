<?php
function send($status = 200, $data = []){
    header("Content-Type: application/json");
    http_response_code($status);
    echo json_encode($data);
    exit();
}
function getRequestData(){

    if($_SERVER["REQUEST_METHOD"] == ["GET"]){
        return $_GET;
    }

    if($_SERVER["CONTENT_TYPE"] != "application/json"){
        //SEND ERROR
    }

    $json = file_get_contents("php://input");
    return json_decode($json, true);
}
function getDatabase($type){

    $DB = "$type.json";
    if(file_exists($DB) == false){
        //DB NOT REAL BAD STUFF
    }

    $returnContent =  file_get_contents($DB);
    $returnData = json_decode($returnContent);
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
    
}
?>