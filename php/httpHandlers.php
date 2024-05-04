<?php
require_once("timeHandlers.php");

function sendHttpRequest($url, $method, $headers, $body) {
  $timestamp = getCurrentTimeStamp(true);
  $opts = [
    "http" => [
      "method" => $method,
      "header" => $headers,
      "content" => $body
    ]
  ];
  $req = stream_context_create($opts);
  $res = file_get_contents($url, false, $req);
  $resDecoded = json_decode($res, true);

  // Logs requests and responses
  if (!file_exists("logsHttp/" . getCurrentTimeStamp(false))) {
    mkdir("logsHttp/" . getCurrentTimeStamp(false));
  }

  $resJson = json_encode([
    "timestamp" => $timestamp,
    "response" => [
      "headers" => $http_response_header,
      "body" => $resDecoded
    ]
  ], JSON_PRETTY_PRINT);

  $reqJson = json_encode([
    "timestamp" => $timestamp,
    "request" => [$url, $opts]
  ], JSON_PRETTY_PRINT);

  $resLogFile = "logsHttp/" . getCurrentTimeStamp(false) . "/" .$timestamp . "_response.json";
  $reqLogFile = "logsHttp/" . getCurrentTimeStamp(false) . "/" .$timestamp . "_request.json";

  file_put_contents($resLogFile, $resJson);
  file_put_contents($reqLogFile, $reqJson);

  return $resDecoded;
}
