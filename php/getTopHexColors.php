<?php 
// https://github.com/thephpleague/color-extractor

require_once(__DIR__."/../vendor/autoload.php");

use League\ColorExtractor\Color;
use League\ColorExtractor\ColorExtractor;
use League\ColorExtractor\Palette;

function getTopHexColors($imgFilePath, $n) {
  if (!file_exists($imgFilePath)) {
    return [];
  }

  if (is_null($n)){
    $n = 5;
  }

  $palette = Palette::fromFilename($imgFilePath);
  $exctractor = new ColorExtractor($palette);
  $topColors = $exctractor->extract(n);
  foreach($topColors as &$color) {
    $color = Color::fromIntToHex($color);
  }
  return $topColors;
}

// getTopFiveHexColors('./php/520012.jpg');
