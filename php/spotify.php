<?php
require_once("httpHandlers.php");

function generateQueryStr() {
  $chars = str_split("abcdefghijklmnopqrstuvwxyz");
  $ranChar = $chars[random_int(0, count($chars) - 1)];
  $queryStr = "";

  switch(random_int(0,1)) {
    case 0:
      $queryStr = $ranChar . "%";
      break;
    case 1:
      $queryStr = "%" . $ranChar;
      break;
  }

  return $queryStr;
}

function getRandomSpotifyAlbums($auth, $n) {
  // Request token
  $id = $auth["id"];
  $secret = $auth["secret"];
  $tokenReq = [
    "url" => "https://accounts.spotify.com/api/token",
    "method" => "POST",
    "headers" => ["Content-Type: application/x-www-form-urlencoded"],
    "body" => "grant_type=client_credentials&client_id=$id&client_secret=$secret"
  ];

  $tokenRes = sendHttpRequest($tokenReq["url"], $tokenReq["method"], $tokenReq["headers"], $tokenReq["body"]);
  $token = $tokenRes["access_token"];
  $type = $tokenRes["token_type"];

  // Request albums
  $queryStr = generateQueryStr();
  $randomOffset = random_int(0, 1000);
  $urlQuery = http_build_query([
    "q" => $queryStr,
    "type" => "album",
    "offset" => $randomOffset,
    "limit" => $n
  ]);
  $albumsReq = [
    "url" => "https://api.spotify.com/v1/search?" . $urlQuery,
    "method" => "GET",
    "headers" => ["Authorization: $type $token"],
    "body" => ""
  ];

  // This is here because of reasons dont question it
  sleep(5);
  $albumsRes = sendHttpRequest($albumsReq["url"], $albumsReq["method"], $albumsReq["headers"], $albumsReq["body"]);

  // Should we handle the saving or return?

  // $albumsJson = json_encode($albumsRes, JSON_PRETTY_PRINT);
  // file_put_contents("albums.json", $albumsJson);

  // return $albumsJson;
}
