<?php

date_default_timezone_set("Europe/Stockholm");

function getCurrentTimeStamp() {
  return date("d-m-y_H:i:s");
}

function fetchTimer() {
  // Initial fetch of albums here
  // $albums = getRandomAlbums();

  while (true) {
    $timeLeftToMidnight = strtotime("tomorrow") - strtotime("now");
    // If more than one minute to midnight, we wait that amount of time before next fetch.
    if ($timeLeftToMidnight > 60) {
      sleep($timeLeftToMidnight);
    // If less than one minute to midnight, we wait 24h before subsequent fetch.
    } else {
      sleep(24 * 60 * 60);
    }
    // Subsequent fetch
    // $albums = getRandomAlbums();
  }
}
