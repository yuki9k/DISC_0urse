import * as addedFriends from "../friendsIncluded/friendsIncluded.js";
import { PubSub } from "../../../logic/PubSub.js";

PubSub.subscribe({
  event: "renderCreateRoom",
  listener: (event) => {
    renderCreate();
  },
});

function renderCreate() {
  let wrapper = document.querySelector("#wrapper");
  let main = document.createElement("main");
  main.className = "main_container_create_room";
  wrapper.innerHTML = "";
  wrapper.appendChild(main);

  main.innerHTML = `
        <div class="container_main">
            <h2 class="create_room_title">Create new room</h2>
            <div class="room_name_container">
                <p class="room_name_text">Room name</p>
                <input type="text" placeholder="Enter room name here" class="input_room_name">
            </div>
            <div class="bottom">
                <div class="genre_theme_container">
                    <p class="room_genre">Genre</p>
                        <select class="choose_genre">  
                            <option value="0">Choose genre</option>
                            <option value="1">Indie Pop</option>  
                            <option value="2">Indie Rock</option>  
                            <option value="3">Indie Singer & Songwriter</option>  
                            <option value="4">Indie Folk</option>  
                            <option value="5">Indie R&B</option>  
                            <option value="6">Indie Post Punk</option>  
                        </select> 
                    <p class="room_theme">Theme</p>
                        <select class="choose_theme">  
                            <option>Choose theme</option>  
                            <option value="one">Theme One</option>  
                            <option value="two">Theme Two</option>  
                            <option value="three">Theme Three</option>  
                            <option value="four">Theme Four</option>  
                            <option value="five">Theme Five</option>  
                            <option value="six">Theme Six</option>  
                        </select> 
                </div>
                <div class="placeholders">
                    <div class="create_room_album_cover"></div>
                    <div class="two">
                        <p class="album_title_in_div">Album here:</p>
                    </div>
                    <div class="create_room_album_info">
                      <div class="album_info_title">Songs in the album:</div>
                      <div class="album_information_create"></div>
                    </div>
                </div>
            </div>
            <div class="underline"></div>
        </div>
    `;

  const genre = document.querySelector(".choose_genre");
  genre.addEventListener("click", (e) => {
    const genrePlaceholder = document.querySelector(".album_title_in_div");
    const albumCover = document.querySelector(".create_room_album_cover");
    const albumInfo = document.querySelector(".album_information_create");
    const number = Number(genre.value);

    if(number === 1) {
      albumCover.style.backgroundImage = "url(./api/db/albumPics/indie_pop.jpeg)";
      albumCover.style.backgroundSize = "contain";
    } else if (number === 2) {
      albumCover.style.backgroundImage = "url(./api/db/albumPics/indie_rock.jpeg)";
      albumCover.style.backgroundSize = "contain";
    } else if (number === 3) {
      albumCover.style.backgroundImage = "url(./api/db/albumPics/indie_singer-songwriter.jpeg)";
      albumCover.style.backgroundSize = "contain";
    } else if (number === 4) {
      albumCover.style.backgroundImage = "url(./api/db/albumPics/indie_folk.jpeg)";
      albumCover.style.backgroundSize = "contain";
    } else if (number === 5) {
      albumCover.style.backgroundImage = "url(./api/db/albumPics/indie_r&b.jpeg)";
      albumCover.style.backgroundSize = "contain";
    } else if (number === 6) {
      albumCover.style.backgroundImage = "url(./api/db/albumPics/indie_post-punk.jpeg)";
      albumCover.style.backgroundSize = "contain";
    } else {
      albumCover.style.backgroundImage = "";
    }

    PubSub.publish({
      event: "getAlbumInfo",
      details: number
    });

    PubSub.subscribe({
        event: "foundAlbumInfo",
        listener: (details) => {
          console.log(details);
          albumInfo.innerHTML = "";
          genrePlaceholder.textContent = details.albumLabel;
          const songs = details.albumTracks;

          for (let song of songs) {
            const infoDom = document.createElement("div");
            infoDom.className = "info_container";
            albumInfo.appendChild(infoDom);
            infoDom.textContent = song.trackName;
          }
        }
      })
  });

  PubSub.publish({
    event: "renderAddedFriends",
    details: null,
  });
}
