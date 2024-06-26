import { PubSub } from "../../../logic/PubSub.js";
import * as roomTop from "./roomTopAnimation/roomTopAnimation.js";
import { colorToHsl } from "../../../logic/helpFunctions.js";

function renderRoomTop(parent, data) {
  let albumInfo;
  PubSub.unsubscribe("sendAlbum");
  PubSub.subscribe({
    event: "sendAlbum",
    listener: (details) => {
      albumInfo = details;
      switch (data.genre) {
        case "Indie Pop":
          albumInfo.image = "api/db/albumPics/indie_pop.jpeg";
          break;
        case "Indie Rock":
          albumInfo.image = "api/db/albumPics/indie_rock.jpeg";
          break;
        case "Indie Singer-songwriter":
          albumInfo.image = "api/db/albumPics/indie_singer-songwriter.jpeg";
          break;
        case "Indie Folk":
          albumInfo.image = "api/db/albumPics/indie_folk.jpeg";
          break;
        case "Indie R&b":
          albumInfo.image = "api/db/albumPics/indie_r&b.jpeg";
          break;
        case "Indie Post-punk":
          albumInfo.image = "api/db/albumPics/indie_post-punk.jpeg";
          break;
        default:
          return;
      }

      parent.innerHTML = `
            <div id="album_container"> 
            <div id="album_cover">
                <img src="${albumInfo.image}">
            </div>
            <div id="album_data">
                <h1>${albumInfo.albumName}</h1>
                <span id="artist_name">${albumInfo.albumArtists[0].name}</span>
                <span id="release_year">${albumInfo.albumReleaseDate}</span>
                <ul id="album_tracks_container"></ul>
            </div>
            </div>
            <div id="time_left">
                <span> </span>
            </div>
            `;
      const albumTracks = parent.querySelector("#album_tracks_container");
      const albumDataContainer = parent.querySelector("#album_data");

      PubSub.subscribe({
        event: "sendAlbumHexColor",
        listener: (cArr) => {
          const c = cArr[0];
          const accentColorHex = {
            type: "hex",
            value: c,
          };

          let { h, s, l } = colorToHsl(accentColorHex);

          s = Math.min(s, 80);
          l = Math.min(l, 80);

          if (l < 50) {
            albumDataContainer.style.color = "var(--paragraph_color_white)";
          }
          albumDataContainer.style.backgroundColor = `hsl(${h} ${s - 5} ${
            l + 5
          })`;
        },
      });
      PubSub.publish({ event: "getAlbumHexColor", details: data.genre });

      for (let i = 0; i < albumInfo.albumTotalTracks; i++) {
        const albumTrack = document.createElement("li");
        albumTrack.classList.add("album_track");
        albumTrack.textContent =
          i + 1 + " " + albumInfo.albumTracks[i].trackName;

        albumTracks.appendChild(albumTrack);
      }
    },
  });

  PubSub.publish({
    event: "initiateAnimation",
    details: null,
  });

  PubSub.publish({
    event: "getAlbum",
    details: data.genre,
  });
}

PubSub.subscribe({
  event: "renderRoomTop",
  listener: (details) => {
    const { parent, data } = details;
    renderRoomTop(parent, data);
  },
});

PubSub.subscribe({
  event: "addRoomTopAnimation",
  listener: (detail) => {
    const roomTop = document.querySelector("#room_top");
    const albumContainer = document.querySelector("#album_container");
    const albumTracks = document.querySelector("#album_tracks_container");

    roomTop.classList[detail]("makeSmall");
    albumContainer.classList[detail]("makeSmall");
    albumTracks.classList[detail]("display_none");
  },
});
