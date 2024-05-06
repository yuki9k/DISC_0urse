function renderPostsPreview(parent, posts){
    parent.innerHTML = `<h1 class="album_title"></h1>
                        <ul class="posts_container"></ul>`;

    const postsContainer = parent.querySelector(".posts_container");

    //get copy of state

    for(let post of posts){
        renderPostItem(postsContainer, post.content); 
    }; 
}