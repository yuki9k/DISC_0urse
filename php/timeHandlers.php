<?php

date_default_timezone_set("Europe/Stockholm");

function msToSeconds($ms) {
  return floor($ms / 1000);
}

function secondsToTimestamp($seconds) {
  $minutes = (floor($seconds / 60) < 1) ? 0 : floor($seconds / 60);
  $seconds = $seconds % 60;

  return ($seconds < 10) ? "{$minutes}:0{$seconds}" : "{$minutes}:$seconds";
}

function getCurrentDateAndTime($spec) {
  $dateStr = "d-m-y_";

  switch ($spec) {
    case "h":
      $dateStr .= "H";
      break;

    case "min":
      $dateStr .= "H-i";
      break;

    case "sec":
      $dateStr .= "H-i-s";
      break;

    case "ms":
      $dateStr .= "H-i-s-v";
      break;
  }

  return date($dateStr);
}
