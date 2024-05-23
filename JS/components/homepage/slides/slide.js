import { PubSub } from "../../../logic/PubSub.js";
import * as albumCover from "./albumCover/albumCover.js";
import * as postsPreview from "./postsPreview/postsPreview.js";

function renderSlide(parent, data) {
  const { chats, image, genre, title } = data;
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
    details: { parent: postsPreview, data: { chats, genre, title } },
  });

  PubSub.publish({
    event: "renderAlbum",
    details: { parent: albumCover, data: data.image },
  });
}

function makeFirstSlideCurrent() {
  const slide1 = document.querySelector(".slide");
  slide1.classList.add("current");
}

PubSub.subscribe({
  event: "renderSlide",
  listener: (details) => {
    //const {parent, chats, image} = details;
    renderSlide(details.parent, {
      chats: details.posts,
      image: details.image,
      genre: details.genre,
      title: details.title,
    });
    makeFirstSlideCurrent();
  },
});

PubSub.subscribe({
  event: "changeSlide",
  listener: (ballIndex) => {
    const slides_container = document.querySelector("#slides_container");
    const slides = document.querySelectorAll(".slide");

    slides_container.style.transform = `translate(-${ballIndex * (100 / 6)}%)`;

    slides.forEach((slide) => {
      slide.classList.remove("current");
    });

    slides[ballIndex].classList.add("current");
  },
});

PubSub.subscribe({
  event: "close|post_preview",
  listener: () => {
    const posts_preview = document.querySelector(
      ".slide.current .posts_preview"
    );
    // posts_preview.classList.toggle("closed");
  },
});
