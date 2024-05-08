<?php

require_once("httpHandlers.php");

function sendAlbumsToApi($filepath) {
  $genresJson = file_get_contents($filepath);
  $url = "localhost:8080/api/genres.json";
  $method = "POST";
  $headers = ["Content-Type: application/json"];
  $body = $genresJson;

  $res = sendHttpRequest($url, $method, $headers, $body);

  return;
}
