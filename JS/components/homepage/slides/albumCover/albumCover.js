import { PubSub } from "../../../../logic/PubSub.js";
import * as slide from "../slide.js";

function renderAlbumCover(parent, data){
    const albumCover = document.createElement("img");
    
    albumCover.id = "album_cover";
    albumCover.classList.add("closed");
    albumCover.setAttribute("src", data);
    parent.appendChild(albumCover);

    albumCover.addEventListener("click", (event) => {
        albumCover.classList.toggle("closed");

        PubSub.publish({
            event: "close|post_preview",
            details: null
        });
        
    });
}

PubSub.subscribe({
    event: "renderAlbum",
    listener: (details) => {
        //const {parent, data} = details;
        renderAlbumCover(details.parent, details.data);
    }
})