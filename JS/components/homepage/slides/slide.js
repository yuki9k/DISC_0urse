function renderSlide(parent, data){
    const slide = document.createElement("div");
    slide.id = "slide_" + data.image.id;
    slide.classList.add("slide");
    parent.appendChild(slide);

    slide.innerHTML += `<div class="album_cover_container"></div>
                        <div class="posts_preview"></div>`;

    const albumCover = slide.querySelector(".album_cover_container");
    const postsPreview = slide.querySelector(".posts_preview");

    renderPostsPreview(postsPreview, data.chats);
    renderAlbumCover(albumCover, data.image);
} 