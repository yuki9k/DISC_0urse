<?php

require_once "spotify.php";
require_once "demoAuth.php";
require_once "apiCommunication.php";

// echo var_dump($genresFile);
// $genresFile = spotifyGetAllGenreAlbums($demoAuth);
$genresFile = file_get_contents("genres.json");
sendAlbumsToApi($genresFile);
