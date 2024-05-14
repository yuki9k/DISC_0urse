import { PubSub } from "../../../../logic/PubSub.js";
import * as post from "./postItem/postItem.js";

function renderPostsPreview(parent, posts){
    parent.innerHTML = `<h1 class="album_title"></h1>
                        <ul class="posts_container"></ul>`;

    const postsContainer = parent.querySelector(".posts_container");

    //get copy of state

    for(let post of posts){
        PubSub.publish({
            event: "renderPost",
            details: {"parent": postsContainer, "data": post.content}
        })
    }; 
}

PubSub.subscribe({
    event: "renderPosts",
    listener: (details) => {
        const {parent, data} = details;
        renderPostsPreview(parent, data);
    }
});
