<?php

require_once "demoAuth.php";
require_once "spotify.php";
require_once "apiCommunication.php";
require_once "timeHandlers.php";

// Initial fetch of albums here
echo "Fetch server started\nInitial fetch..\n";
$genresFile = spotifyGetAllGenreAlbums($demoAuth);
sendAlbumsToApi($genresFile);

while (true) {
  $timeLeftToMidnight = strtotime("tomorrow") - strtotime("now");
  $timestamp = secondsToTimestamp($timeLeftToMidnight);
  echo "Seconds left to midnight (+-1 minute): {$timestamp}\n";
  // If more than one minute to midnight, we wait that amount of time before next fetch.
  if ($timeLeftToMidnight > 60) {
    echo "Next fetch in {$timestamp} seconds..\n";
    sleep($timeLeftToMidnight);
  // If less than one minute to midnight, we wait 24h before subsequent fetch.
  } else {
    echo "Less than one minute to midnight. Next fetch in 24 hours..\n";
    sleep(24 * 60 * 60);
  }
  // Subsequent fetches
  echo "Next fetch:\n";
  $genresFile = spotifyGetAllGenreAlbums($demoAuth);
  sendAlbumsToApi($genresFile);
}
