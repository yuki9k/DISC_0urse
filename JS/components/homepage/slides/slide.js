import {PubSub} from "../../../logic/PubSub.js";
import * as albumCover from "./albumCover/albumCover.js";
import * as postsPreview from "./postsPreview/postsPreview.js";


function renderSlide(parent, data){
    const slide = document.createElement("div");
    slide.id = "slide_" + data.image.id;
    slide.classList.add("slide");
    parent.appendChild(slide);

    slide.innerHTML += `<div class="album_cover_container"></div>
                        <div class="posts_preview"></div>`;

    const albumCover = slide.querySelector(".album_cover_container");
    const postsPreview = slide.querySelector(".posts_preview");

    PubSub.publish({
        event: "renderPosts",
        details: {"parent": postsPreview, "data": data.chats}
    });
    
    PubSub.publish({
        event: "renderAlbum",
        details: {"parent": albumCover, "data": data.image}
    });
} 

PubSub.subscribe({
    event: "renderSlide",
    listener: (details) => {
        const {parent, chats, image} = details;

        renderSlide(parent, {chats, image});
    }
});

PubSub.subscribe({
    event: "changeSlide",
    listener: (ballIndex) => {
        const slides_container = document.querySelector("#slides_container");
        slides_container.style.transform = `translate(-${ ballIndex * (100/6)}%)`;
    }
});

