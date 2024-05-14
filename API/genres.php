<?php
require_once "auxFunctions.php";
require_once "../php/httpHandlers.php";
$allowedMethods = ["GET", "POST"];

$requestMethod = $_SERVER["REQUEST_METHOD"];
if (!in_array($requestMethod, $allowedMethods)) {
    sendError(400, "METHOD NOT ALLOWED");
}
$requestData = getRequestData();
if ($requestMethod == "POST") {
    if (empty($requestData)) {
        sendError(400, "bad request");
    }
    $encoded = json_encode(
        $requestData,
        JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT
    );
    file_put_contents("db/genres.json", $encoded);
    foreach ($requestData as $genreName => $genreObject) {
        $albumImageFile = file_get_contents(
            $genreObject["albumImages"][0]["url"],
            false
        );
        file_put_contents("db/albumPics/{$genreName}.jpeg", $albumImageFile);
    }
}
if ($requestMethod == "GET") {
    //this method sends genre information to the client.
    $DBinfo = getDatabase("genres");
    if (!$DBInfo) {
        sendError("genre DB empty");
    }
    send(200, $DBInfo);
}
?>
