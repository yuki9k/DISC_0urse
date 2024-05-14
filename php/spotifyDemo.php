<?php

require_once "spotify.php";
require_once "demoAuth.php";
require_once "apiCommunication.php";

// echo var_dump($genresFile);
// spotifyGetAllGenreAlbums($demoAuth);
$genresFile = file_get_contents("genres.json");
$resJson = sendAlbumsToApi($genresFile);
$res = json_decode($resJson, false);
echo $resJson;
