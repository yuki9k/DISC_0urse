<?php
require_once "httpHandlers.php";
require_once "getTopHexColors.php";
require_once "demoAuth.php";

function generateRandomQueryStr()
{
    $chars = str_split("abcdefghijklmnopqrstuvwxyz");
    $ranChar = $chars[random_int(0, count($chars) - 1)];

    return $ranChar;
}

function spotifyGetToken($auth)
{
    ["id" => $id, "secret" => $secret] = $auth;
    echo "Getting token for client_id: {$id} and client_secret: {$secret}\n";

    $url = "https://accounts.spotify.com/api/token";
    $method = "POST";
    $headers = ["Content-Type: application/x-www-form-urlencoded"];
    $body = "grant_type=client_credentials&client_id={$id}&client_secret={$secret}";

    [
        "token_type" => $tokenType,
        "access_token" => $accessToken,
    ] = sendHttpRequest($url, $method, $headers, $body);

    echo "Token: {$tokenType} {$accessToken}\n";

    return "{$tokenType} {$accessToken}";
}

function spotifyGetAllGenreAlbums($auth)
{
    $token = spotifyGetToken($auth);
    $selectedArtists = spotifyGetRandomArtists($token);
    $selectedAlbums = spotifyGetArtistsRandomAlbum($token, $selectedArtists);
    $selectedAlbumsJson = json_encode(
        $selectedAlbums,
        JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT
    );
    file_put_contents("res/genres.json", $selectedAlbumsJson);
    return $selectedAlbumsJson;
}

function spotifyGetRandomArtists($token)
{
    $genres = [
        "Indie Pop",
        "Indie Rock",
        "Indie Singer-songwriter",
        "Indie Folk",
        "Indie R&b",
        "Indie Post-punk",
    ];
    // $genres = ['Pop', 'Rock', 'Singer-songwriter', 'Folk', 'R&b', 'Electronic'];
    $artistsArr = [];

    foreach ($genres as $genre) {
        echo "Getting random artists for genre: {$genre}\n";
        $queryStr = generateRandomQueryStr();

        // artist%3A
        $urlQuery = http_build_query([
            "q" => "{$queryStr}%20genre%3A{$genre}",
            "type" => "artist",
            "limit" => 10,
            "offset" => random_int(10, 40),
        ]);

        $url = "https://api.spotify.com/v1/search?{$urlQuery}";
        $method = "GET";
        $headers = ["Authorization: {$token}"];
        $body = "";

        echo "Query URL: {$url}\n";
        // This is here because of reasons dont question it
        sleep(2);

        ["artists" => $artistsRes] = sendHttpRequest(
            $url,
            $method,
            $headers,
            $body
        );

        $validGenreArtists = [];

        echo "Potential artists:\n";
        foreach ($artistsRes["items"] as $key => $artist) {
            echo "{$key}: {$artist["name"]} ";

            if (
                str_contains($artist["name"], $genre) ||
                str_contains($artist["name"], "Indie") ||
                !spotifyArtistHasAlbums($token, $artist["id"])
            ) {
                echo "SKIPPING\n";
                continue;
            }

            echo "VALID\n";
            array_push($validGenreArtists, $artist);
        }

        // This is shit code
        if (!count($validGenreArtists)) {
            echo "Skipping genre: {$genre}\n";
            continue;
        }

        $randomIdx = random_int(0, count($validGenreArtists) - 1);
        $selectedGenreArtist = $validGenreArtists[$randomIdx];

        echo "Selected artist for {$genre}: {$selectedGenreArtist["name"]}\n";

        ["id" => $artistId, "name" => $artistName] = $selectedGenreArtist;
        $artistsArr[$genre] = ["id" => $artistId, "name" => $artistName];
    }

    return $artistsArr;
}

function spotifyArtistHasAlbums($token, $artistId)
{
    $url = "https://api.spotify.com/v1/artists/{$artistId}/albums?include_groups=album";
    $method = "GET";
    $headers = ["Authorization: {$token}"];
    $body = "";

    ["items" => $albumItems] = sendHttpRequest($url, $method, $headers, $body);

    if (count($albumItems) == 0) {
        return false;
    } else {
        return true;
    }
}

function spotifyGetArtistsRandomAlbum($token, $artistsArr)
{
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

        ["items" => $potentialAlbums] = sendHttpRequest(
            $url,
            $method,
            $headers,
            $body
        );

        echo "Potential albums:\n";
        foreach ($potentialAlbums as $key => $potentialAlbum) {
            echo "{$key}: {$potentialAlbum["name"]}\n";
        }

        $randomIdx = random_int(0, count($potentialAlbums) - 1);
        $selectedAlbum = $potentialAlbums[$randomIdx];

        echo "Selected album: {$selectedAlbum["name"]}\n";

        $selectedAlbumDetailed = spotifyGetDetailedAlbum(
            $token,
            $selectedAlbum["id"]
        );

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
            // Album images are fetched from the internal API when it receives the POST request
            "images" => $albumImages,
            "tracks" => $tempAlbumTracks,
            "popularity" => $albumPopularity,
        ] = $selectedAlbumDetailed;

        ["url" => $albumImageUrl] = $albumImages[0];

        $albumImageFile = file_get_contents($albumImageUrl, false);
        $albumImageFilename =
            "res/albumCovers/" .
            str_replace(" ", "_", strtolower($genre)) .
            ".jpeg";

        file_put_contents($albumImageFilename, $albumImageFile);

        $albumImageHexColors = getTopHexColors($albumImageFilename, 5);

        echo "Album image: {$albumImageUrl}\n";
        echo "Album image hex colors:\n";

        foreach ($albumImageHexColors as $key => $albumImageHexColor) {
            echo "{$key}: {$albumImageHexColor}\n";
        }

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
                "uri" => $trackUri,
            ] = $tempAlbumTrackItem;

            $albumTrack = [
                "trackId" => $trackId,
                "trackName" => $trackName,
                "trackArtists" => $trackArtists,
                "trackDurationMs" => $trackDurationMs,
                "trackNumber" => $trackNumber,
                "trackUrls" => $trackUrls,
                "trackPreviewUrl" => $trackPreviewUrl,
                "trackUri" => $trackUri,
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
            "albumPopularity" => $albumPopularity,
            "albumImageHexColors" => $albumImageHexColors,
        ];
    }

    return $albumsArr;
}

function spotifyGetDetailedAlbum($token, $albumId)
{
    $url = "https://api.spotify.com/v1/albums/{$albumId}";
    $method = "GET";
    $headers = ["Authorization: {$token}"];
    $body = "";

    return sendHttpRequest($url, $method, $headers, $body);
}
