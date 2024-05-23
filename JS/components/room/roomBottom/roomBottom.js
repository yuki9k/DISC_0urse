import { PubSub } from "../../../logic/PubSub.js";
import * as postFiltering from "./filterButton/filterButton.js";
import * as addPostButton from "./addPostButton/addPostButton.js";
import * as postsContainer from "./postsContainer/postsContainer.js";

function renderRoomBottom(parent, data, id) {
  parent.innerHTML = `<div id="posts_container"></div>
                        <div id="filter_add_post_container">
                            <div id="filter_posts">
                                <label for="filter_input">Sort posts:</label>
                            </div>
                            <div id="add_posts"></div>
                        </div>`;

  const postsContainer = parent.querySelector("#posts_container");
  const filterPosts = parent.querySelector("#filter_posts");
  const addPosts = parent.querySelector("#add_posts");

  PubSub.publish({
    event: "renderAddPostButton",
    details: { parent: addPosts, id: id },
  });

  PubSub.publish({
    event: "renderFilterButton",
    details: filterPosts,
  });

  PubSub.publish({
    event: "renderPostsContainer",
    details: { parent: postsContainer, data: data },
  });
}

PubSub.subscribe({
  event: "sendRoomPosts",
  listener: (details) => {
    const { posts, id } = details;
    const roomBottom = document.querySelector("#room_bottom");
    renderRoomBottom(roomBottom, posts, id);
    /* PubSub.publish({
            event: "renderRoomBottom",
            details: {
                parent: roomBottom,
                data: details.posts
            }
        }); */
  },
});

PubSub.subscribe({
  event: "moveFilterAddPostContainer",
  listener: (details) => {
    const filterAddPostContainer = document.querySelector(
      "#filter_add_post_container"
    );
    filterAddPostContainer.classList[details]("move");
  },
});
