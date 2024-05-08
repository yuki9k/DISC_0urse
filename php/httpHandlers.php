<?php
require_once("timeHandlers.php");

function sendHttpRequest($url, $method, $headers, $body) {
  $minTimestamp = getCurrentDateAndTime("min");
  $secTimestamp = getCurrentDateAndTime("sec");

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
  if (!file_exists("logsHttp")) {
    mkdir("logsHttp");
  }

  if (!file_exists("logsHttp/{$minTimestamp}")) {
    mkdir("logsHttp/{$minTimestamp}");
  }

  $resJson = json_encode([
    "timestamp" => $secTimestamp,
    "response" => [
      "headers" => $http_response_header,
      "body" => $resDecoded
    ]
  ], JSON_PRETTY_PRINT);

  $reqJson = json_encode([
    "timestamp" => $secTimestamp,
    "request" => [$url, $opts]
  ], JSON_PRETTY_PRINT);

  $uniqueId = uniqid('', true);

  $resLogFile = "logsHttp/{$minTimestamp}/{$secTimestamp}_response_{$uniqueId}.json";
  $reqLogFile = "logsHttp/{$minTimestamp}/{$secTimestamp}_request_{$uniqueId}.json";
  file_put_contents($resLogFile, $resJson);
  file_put_contents($reqLogFile, $reqJson);

  return $resDecoded;
}
