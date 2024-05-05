<?php
require_once("httpHandlers.php");

//REMOVE THIS, ONLY FOR DEMO TESTING
require_once("demoAuth.php");

function generateQueryStr() {
  $chars = str_split("abcdefghijklmnopqrstuvwxyz");
  $ranChar = $chars[random_int(0, count($chars) - 1)];

  switch(random_int(0,1)) {
    case 0:
      return "{$ranChar}%";
      break;
    case 1:
      return "%{$ranChar}";
      break;
  }
}

function spotifyGetToken($auth) {
  $id = $auth["id"];
  $secret = $auth["secret"];

  $tokenReq = [
    "url" => "https://accounts.spotify.com/api/token",
    "method" => "POST",
    "headers" => ["Content-Type: application/x-www-form-urlencoded"],
    "body" => "grant_type=client_credentials&client_id={$id}&client_secret={$secret}"
  ];

  [
    "url" => $url,
    "method" => $method,
    "headers" => $headers,
    "body" => $body
  ] = $tokenReq;

  $tokenRes = sendHttpRequest($url, $method, $headers, $body);

  [
    "token_type" => $tokenType,
    "access_token" => $accessToken
  ] = $tokenRes;

  $token = "{$tokenType} {$accessToken}";
  return $token;
}

function spotifyGetRandomAlbums($auth, $n) {
  // Request token
  $token = spotifyGetToken($auth);

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
    "url" => "https://api.spotify.com/v1/search?{$urlQuery}",
    "method" => "GET",
    "headers" => ["Authorization: {$token}"],
    "body" => ""
  ];

  [
    "url" => $url,
    "method" => $method,
    "headers" => $headers,
    "body" => $body
  ] = $albumsReq;

  // This is here because of reasons dont question it
  sleep(5);
  $albumsRes = sendHttpRequest($url, $method, $headers, $body);

  // Request detailed albums
  $albumsDetailed = [];
  $albumItems = $albumsRes["albums"]["items"];
  foreach($albumItems as $albumItem) {
    $albumDetailed = spotifyGetAlbumDetails($token, $albumItem["id"]);
    array_push($albumsDetailed, $albumDetailed);
  }

  // return $albumsRes;

  // Should we handle the saving or return?

  // $albumsJson = json_encode($albumsRes, JSON_PRETTY_PRINT);
  // file_put_contents("albums.json", $albumsJson);

  // return $albumsJson;
}


function spotifyGetAlbumDetails($token, $albumId) {
  $albumReq = [
    "url" => "https://api.spotify.com/v1/albums/{$albumId}",
    "method" => "GET",
    "headers" => ["Authorization: {$token}"],
    "body" => ""
  ];

  [
    "url" => $url,
    "method" => $method,
    "headers" => $headers,
    "body" => $body
  ] = $albumReq;

  $albumRes = sendHttpRequest($url, $method, $headers, $body);

  return $albumRes;
}

spotifyGetRandomAlbums($demoAuth, 5);
