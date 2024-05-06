function renderAlbumCover(parent, data){
    const albumCover = document.createElement("img");
    
    albumCover.id = "album_cover";
    albumCover.setAttribute("src", data.src);

    parent.appendChild(albumCover);
}