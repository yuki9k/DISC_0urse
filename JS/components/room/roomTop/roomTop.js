import {PubSub} from "../../../logic/PubSub.js";
import * as roomTop from "./roomTopAnimation/roomTopAnimation.js";

function renderRoomTop(parent, data){
    let albumInfo;
    PubSub.subscribe({
        event: "sendAlbum",
        listener: (details) => {
            albumInfo = details;
            console.log(albumInfo);
            switch (data.genre) {
                case "Indie Pop":
                  albumInfo.image = "../../../../API/db/albumPics/indie_pop.jpeg";
                  break;
                case "Indie Rock":
                    albumInfo.image = "../../../../API/db/albumPics/indie_rock.jpeg";
                    break;
                case "Indie Singer-songwriter":
                    albumInfo.image = "../../../../API/db/albumPics/indie_singer-songwriter.jpeg";
                    break;
                case "Indie Folk":
                    albumInfo.image = "../../../../API/db/albumPics/indie_folk.jpeg";
                    break;
                case "Indie R&b":
                    albumInfo.image = "../../../../API/db/albumPics/indie_r&b.jpeg";
                    break;
                case "Indie Post-punk":
                    albumInfo.image = "../../../../API/db/albumPics/indie_post-punk.jpeg";
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

            for(let i = 0; i < albumInfo.albumTotalTracks; i++){
                const albumTrack = document.createElement("li");
                albumTrack.classList.add("album_track");
                albumTrack.textContent = (i+1) + " " + albumInfo.albumTracks[i].trackName;
                
                albumTracks.appendChild(albumTrack);
            }
        }
    });
    PubSub.publish({
        event: "getAlbum",
        details: data.genre
    });
}

PubSub.subscribe({
    event: "renderRoomTop",
    listener: (details) => {
        renderRoomTop(details.parent, details.data);
    }
});


PubSub.subscribe({
    event: "addRoomTopAnimation",
    listener:(detail) => {
        const roomTop = document.querySelector("#room_top");
        const albumContainer = document.querySelector("#album_container");
        const albumTracks = document.querySelector("#album_tracks_container");

        roomTop.classList[detail]("makeSmall");
        albumContainer.classList[detail]("makeSmall");           
        albumTracks.classList[detail]("display_none");
    }
});

