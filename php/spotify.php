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
  echo "Getting token for client_id: {$id} and client_secret: {$secret}\n";

  $url = "https://accounts.spotify.com/api/token";
  $method = "POST";
  $headers = ["Content-Type: application/x-www-form-urlencoded"];
  $body = "grant_type=client_credentials&client_id={$id}&client_secret={$secret}";

  [
    "token_type" => $tokenType,
    "access_token" => $accessToken
  ] = sendHttpRequest($url, $method, $headers, $body);

  echo "Token: {$tokenType} {$accessToken}\n";

  return "{$tokenType} {$accessToken}";
}

function spotifyGetAllGenreAlbums($auth){
  $token = spotifyGetToken($auth);
  $selectedGenreArtists = spotifyGetRandomArtists($token);
  $selectedGenreAlbums = spotifyGetArtistsRandomAlbum($token, $selectedGenreArtists);
  $selectedGenreAlbumsJson = json_encode($selectedGenreAlbums, JSON_PRETTY_PRINT);
  file_put_contents("selectedGenreAlbums.json", $selectedGenreAlbumsJson);
}

function spotifyGetRandomArtists($token) {
  $genres = ['Pop', 'Rock', 'Electronic', 'Hip Hop', 'Indie Pop'];
  $artistsArr = [];

  foreach($genres as $genre) {
    echo "Getting random artists for genre: {$genre}\n";
    $queryStr = generateRandomQueryStr();
    
    $urlQuery = http_build_query([
      "q" => "{$queryStr}%20genre:'{$genre}'",
      "type" => "artist",
      "limit" => 10
    ]);

    $url = "https://api.spotify.com/v1/search?{$urlQuery}";
    $method = "GET";
    $headers = ["Authorization: {$token}"];
    $body = "";

    // This is here because of reasons dont question it
    sleep(1);

    $artistsRes = sendHttpRequest($url, $method, $headers, $body);

    $validGenreArtists = [];

    foreach($artistsRes["artists"]["items"] as $key => $artist) {
      echo "Potential artist {$key}: {$artist['name']}\n";

      if (spotifyArtistHasAlbums($token, $artist["id"])) {
        echo "Albums found\n";
        array_push($validGenreArtists, $artist);
        continue;
      }

      echo "No albums found\n";
    }

    $randomIdx = random_int(0, count($validGenreArtists) - 1);
    $selectedGenreArtist = $validGenreArtists[$randomIdx];

    echo "Selected artist for {$genre}: {$selectedGenreArtist['name']}\n";


    ["id" => $artistId, "name" => $artistName] = $selectedGenreArtist;
    $artistsArr[$genre] = ["id" => $artistId, "name" => $artistName];
  }

  return $artistsArr;
}

function spotifyArtistHasAlbums($token, $artistId) {
  $url = "https://api.spotify.com/v1/artists/{$artistId}/albums?include_groups=album";
  $method = "GET";
  $headers = ["Authorization: {$token}"];
  $body = "";

 ["items" => $albumItems] = sendHttpRequest($url, $method, $headers, $body);

  if(count($albumItems) == 0) {
    return false;
  } else {
    
    return true;
  }
}

function spotifyGetArtistsRandomAlbum($token, $artistsArr) {
  $albumsArr = [];

  foreach ($artistsArr as $genre => $artist) {
    ["id" => $artistId, "name" => $artistName] = $artist;
    echo "Albums for artist: {$artistName} ({$genre})\n";

    $url = "https://api.spotify.com/v1/artists/{$artistId}/albums?include_groups=album";
    $method = "GET";
    $headers = ["Authorization: {$token}"];
    $body = "";

    // This is here because of reasons dont question it
    sleep(1);
 
    ["items" => $potentialAlbums] = sendHttpRequest($url, $method, $headers, $body);

    foreach($potentialAlbums as $potentialAlbum) {
      echo "Potential album: {$potentialAlbum['name']}\n";
    }

    $randomIdx = random_int(0, count($potentialAlbums) - 1);
    $selectedAlbum = $potentialAlbums[$randomIdx];
    
    echo "Selected album: {$selectedAlbum['name']}\n";

    $selectedAlbumDetailed = spotifyGetDetailedAlbum($token, $selectedAlbum["id"]);

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
    ] = $selectedAlbumDetailed;

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

spotifyGetAllGenreAlbums($demoAuth);
