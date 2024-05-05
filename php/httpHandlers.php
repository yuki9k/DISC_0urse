<?php
require_once("timeHandlers.php");

function sendHttpRequest($url, $method, $headers, $body) {
  $unixTimestamp = getCurrentTimeStamp(true);
  $timestamp = getCurrentTimeStamp(false);

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
  if (!file_exists("logsHttp/{$timestamp}")) {
    mkdir("logsHttp/{$timestamp}");
  }

  $resJson = json_encode([
    "timestamp" => $unixTimestamp,
    "response" => [
      "headers" => $http_response_header,
      "body" => $resDecoded
    ]
  ], JSON_PRETTY_PRINT);

  $reqJson = json_encode([
    "timestamp" => $unixTimestamp,
    "request" => [$url, $opts]
  ], JSON_PRETTY_PRINT);

  $resLogFile = "logsHttp/{$timestamp}/{$unixTimestamp}_response.json";
  $reqLogFile = "logsHttp/{$timestamp}/{$unixTimestamp}_request.json";
  file_put_contents($resLogFile, $resJson);
  file_put_contents($reqLogFile, $reqJson);

  return $resDecoded;
}
