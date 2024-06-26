import { PubSub } from "../../../../logic/PubSub.js";
import * as post from "./postItem/postItem.js";

// PubSub.publish({
//     event: "getAlbums",
//     details: null,
//   });

//   PubSub.subscribe({
//     event: "foundAlbums",
//     listener: (details) => {
//         renderPostsPreview
//     }
//   })

function renderPostsPreview(parent, data) {
  const { chats: posts, genre, title } = data;
  parent.innerHTML = `<h2>Talk about:</h2>
                        <h1 class="album_title">${title}</h1>
                        <ul class="posts_container"></ul>`;

  const postsContainer = parent.querySelector(".posts_container");

  //get copy of state

  for (let post of posts) {
    PubSub.publish({
      event: "renderPost",
      details: { parent: postsContainer, data: { post, genre } },
    });
  }
}

PubSub.subscribe({
  event: "renderPosts",
  listener: (details) => {
    const { parent, data } = details;
    renderPostsPreview(parent, data);
  },
});
