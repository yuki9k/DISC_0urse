import { PubSub } from "../../../../logic/PubSub.js";

function renderAlbumCover(parent, data){
    const albumCover = document.createElement("img");
    
    albumCover.id = "album_cover";
    albumCover.setAttribute("src", data.src);

    parent.appendChild(albumCover);
}

PubSub.subscribe({
    event: "renderAlbum",
    listener: (details) => {
        const {parent, data} = details;
        renderAlbumCover(parent, data);
    }
})