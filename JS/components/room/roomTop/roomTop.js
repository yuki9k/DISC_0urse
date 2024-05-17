import {PubSub} from "../../../logic/PubSub.js";
import * as roomTop from "./roomTopAnimation/roomTopAnimation.js";

function renderRoomTop(parent, data){
    parent.innerHTML = `<div id="album_container"> 
                            <div id="album_cover">
                                <img src="https://i.scdn.co/image/ab67616d0000b273d400d27cba05bb0545533864">
                            </div>
                            <div id="album_data">
                                <h1 id="album_name">Ten</h1>
                                <span id="artist_name">Pearl Jam</span>
                                <span id="release_year">1991</span>
                                <ul id="album_tracks_container"></ul>
                            </div>
                        </div>
                        <div id="time_left">
                            <span> </span>
                        </div>
                        `;

    const albumTracks = parent.querySelector("#album_tracks_container");

    for(let i = 0; i < 10; i++){
        const albumTrack = document.createElement("li");
        albumTrack.classList.add("album_track");
        albumTrack.textContent = "song" + (i + 1);
        albumTracks.appendChild(albumTrack);
    }
}

PubSub.subscribe({
    event: "renderRoomTop",
    listener: renderRoomTop
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

