<?php

function sendHttpRequest($url, $method, $headers, $body) {
  $opts = [
    "http" => [
      "method" => $method,
      "header" => $headers,
      "content" => $body
    ]
  ];
  $req = stream_context_create($opts);
  $res = file_get_contents($url, false, $req);

  // Logs requests and responses
  $log = json_encode([
    "request" => [
      "headers" => $http_response_header,
      "body" => $res
    ],
    "response" => $res
  ], JSON_PRETTY_PRINT);
  $logFile = "logsHttp/" . time() . ".json";
  file_put_contents($logFile, $log);

  return res;
}
