import {PubSub} from "../../../logic/PubSub.js";

function renderRoomTop(parent, data){
    parent.innerHTML = `<div id="album_container"> 
                            <div id="album_cover">
                                <img src="https://i.scdn.co/image/ab67616d0000b273d400d27cba05bb0545533864">
                            </div>
                            <div id="album_data">
                                <h1 id="album_name">Pearl Jam</h1>
                                <span id="artist_name">Pearl Jam</span>
                                <span id="release_year">1991</span>
                                <ul id="album_tracks_container"></ul>
                            </div>
                        </div>
                        <div id="time_left">
                            <span> </span>
                        </div>
                        `;

    const album_tracks = parent.querySelector("#album_tracks_container");

    for(let i = 0; i < 10; i++){
        const album_track = document.createElement("li");
        album_track.classList.add("album_track");
        album_track.textContent = "song" + (i + 1);
        album_tracks.appendChild(album_track);
    }
}

PubSub.subscribe({
    event: "renderRoomTop",
    listener: renderRoomTop
});