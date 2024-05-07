function renderRoomTop(parent, data){
    parent.innerHTML = `<div id="album_container"> 
                            <div id="album_cover">
                                <img src="">
                            </div>
                            <div id="album_data">
                                <h1 id="album_name">Album Name</h1>
                                <span id="artist_name"></span>
                                <span id="release_year"></span>
                                <ul id="album_tracks_container"></ul>
                            </div>
                        </div>
                        <div id="time_left">
                            <span> </span>
                        </div>
                        `;

    const album_tracks = parent.querySelector("#album_tracks_container");

    for(let songs of data){
        const album_track = document.createElement("li");
        album_track.classList.add("album_track");
        album_track.textContent = "song";
        album_tracks.appendChild(album_track);
    }
}