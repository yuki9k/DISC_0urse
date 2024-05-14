<?php

require_once "timeHandlers.php";

function sendAlbumsToApi($fileJson)
{
    $url = "http://localhost:8080/genres.php";
    $method = "POST";
    $headers = ["Content-Type: application/json"];
    $body = $fileJson;

    $opts = [
        "http" => [
            "method" => $method,
            "header" => $headers,
            "content" => $body,
        ],
    ];

    $req = stream_context_create($opts);
    $res = file_get_contents($url, false, $req);

    echo "Sent request to API at {$url}\n";
    return $res;
}
