<?php
require_once("httpHandlers.php");
require_once("demoAuth.php"); // <-- REMOVE THIS LATER, ONLY FOR DEV TESTING

function generateRandomQueryStr() {
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
  ["id" => $id, "secret" => $secret] = $auth;

  $url = "https://accounts.spotify.com/api/token";
  $method = "POST";
  $headers = ["Content-Type: application/x-www-form-urlencoded"];
  $body = "grant_type=client_credentials&client_id={$id}&client_secret={$secret}";

  [
    "token_type" => $tokenType,
    "access_token" => $accessToken
  ] = sendHttpRequest($url, $method, $headers, $body);

  return "{$tokenType} {$accessToken}";
}

function spotifyGetRandomArtists($auth) {
  $token = spotifyGetToken($auth);
  $genres = ['Pop', 'Rock', 'Electronic', 'Hip Hop', 'Indie Pop'];
  $artistsArr = [];

  foreach($genres as $genre) {
    $queryStr = generateRandomQueryStr();
    
    $urlQuery = http_build_query([
      "q" => "{$queryStr}%20genre:'{$genre}'",
      "type" => "artist",
      "limit" => 5
    ]);

    $url = "https://api.spotify.com/v1/search?{$urlQuery}";
    $method = "GET";
    $headers = ["Authorization: {$token}"];
    $body = "";

    // This is here because of reasons dont question it
    sleep(1);

    $artistsRes = sendHttpRequest($url, $method, $headers, $body);
    $randomIdx = random_int(0,4);
    $artistItem = $artistsRes["artists"]["items"][$randomIdx];

    ["id" => $artistId, "name" => $artistName] = $artistItem;

    echo "artist id: {$artistId}\nartist name: {$artistName}\n";

    $artistsArr[$genre] = ["id" => $artistId, "name" => $artistName];
  }

  return $artistsArr;
}

function spotifyGetArtistsRandomAlbum($token, $artistsArr) {
  $albumsArr = [];

  foreach ($artistsArr as $genre => $artist) {
    ["id" => $artistId] = $artist;

    $url = "https://api.spotify.com/v1/artists/{$artistId}/albums?include_groups=album";
    $method = "GET";
    $headers = ["Authorization: {$token}"];
    $body = "";

    // This is here because of reasons dont question it
    sleep(1);
 
    $albumsRes = sendHttpRequest($url, $method, $headers, $body);
    $albumItem = $albumsRes["items"][random_int(0, count($albumsRes["items"]) - 1)];

    ["id" => $tempAlbumId] = $albumItem;

    $detailedAlbumItem = spotifyGetDetailedAlbum($token, $tempAlbumId);

    [
      "id" => $albumId,
      "label" => $albumLabel,
      "name" => $albumName,
      "external_urls" => $albumUrls,
      "uri" => $albumUri,
      "release_date" => $albumReleaseDate,
      "genres" => $albumGenres,
      "artists" => $albumArtists,
      "total_tracks" => $albumTotalTracks,
      // Should we maybe fetch the image files here as well instead of just having them linked?
      "images" => $albumImages,
      "tracks" => $tempAlbumTracks,
      "popularity" => $albumPopularity
    ] = $detailedAlbumItem;

    $albumTracks = [];

    ["items" => $tempAlbumTrackItems] = $tempAlbumTracks;

    foreach ($tempAlbumTrackItems as $tempAlbumTrackItem) {
      [
        "id" => $trackId,
        "name" => $trackName,
        "artists" => $trackArtists,
        "duration_ms" => $trackDurationMs,
        "track_number" => $trackNumber,
        "external_urls" => $trackUrls,
        "preview_url" => $trackPreviewUrl,
        "uri" => $trackUri
      ] = $tempAlbumTrackItem;

      $albumTrack = [
        "trackId" => $trackId,
        "trackName" => $trackName,
        "trackArtists" => $trackArtists,
        "trackDurationMs" => $trackDurationMs,
        "trackNumber" => $trackNumber,
        "trackUrls" => $trackUrls,
        "trackPreviewUrl" => $trackPreviewUrl,
        "trackUri" => $trackUri
      ];

      array_push($albumTracks, $albumTrack);
    }

    $albumsArr[$genre] = [
      "albumId" => $albumId,
      "albumLabel" => $albumLabel,
      "albumName" => $albumName,
      "albumUrls" => $albumUrls,
      "albumUri" => $albumUri,
      "albumReleaseDate" => $albumReleaseDate,
      "albumGenres" => $albumGenres,
      "albumArtists" => $albumArtists,
      "albumTotalTracks" => $albumTotalTracks,
      "albumImages" => $albumImages,
      "albumTracks" => $albumTracks,
      "albumPopularity" => $albumPopularity
    ];
  }

  return $albumsArr;
}

function spotifyGetDetailedAlbum($token, $albumId) {
  $url = "https://api.spotify.com/v1/albums/{$albumId}";
  $method = "GET";
  $headers = ["Authorization: {$token}"];
  $body = "";

  return sendHttpRequest($url, $method, $headers, $body);
}
