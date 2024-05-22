import { PubSub } from "../../../logic/PubSub.js";
import * as postFiltering from "./filterButton/filterButton.js";
import * as addPostButton from "./addPostButton/addPostButton.js";
import * as postsContainer from "./postsContainer/postsContainer.js";

function renderRoomBottom(parent, data) {
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
    details: addPosts,
  });

  console.log(data);
  PubSub.publish({
    event: "renderAddPostButton",
    details: addPosts,
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
    const roomBottom = document.querySelector("#room_bottom");
    renderRoomBottom(roomBottom, details.posts);
    /* PubSub.publish({
            event: "renderRoomBottom",
            details: {
                parent: roomBottom,
                data: details.posts
            }
        }); */
  },
});
/* PubSub.subscribe({
    event: "renderRoomBottom",
    listener: (details) => {
        console.log("AWOOOOOOOOOOO", details);
        renderRoomBottom(details.parent, details.data);
    }
}); */

PubSub.subscribe({
  event: "moveFilterAddPostContainer",
  listener: (details) => {
    const filterAddPostContainer = document.querySelector(
      "#filter_add_post_container"
    );
    filterAddPostContainer.classList[details]("move");
  },
});

const dataBase = {
  chats: [
    {
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis et gravida turpis, aliquam vestibulum sem. Maecenas vitae nisi urna. Aenean consequat lobortis turpis, a dapibus lacus porta luctus.",
    },
    {
      content:
        "Etiam pulvinar sit amet velit vitae faucibus. Nunc vel condimentum felis. Vestibulum sed laoreet risus.",
    },
    {
      content:
        "Nullam ac tellus sit amet urna posuere volutpat non eu tellus. Donec ex justo, bibendum vitae tincidunt sit amet, dictum ut urna.",
    },
    {
      content: "Morbi tincidunt dapibus enim.",
    },
    {
      content: "Praesent tincidunt auctor libero et laoreet.",
    },
    {
      content: "Fusce cursus velit in lectus lobortis gravida.",
    },
  ],

  images: [
    {
      id: 10,
      src: "https://downloads.pearljam.com/img/album-art/0223194507ten.jpg",
    },
    {
      id: 5,
      src: "https://upload.wikimedia.org/wikipedia/en/3/3a/Superunknown.jpg",
    },
    {
      id: 8,
      src: "https://i1.sndcdn.com/artworks-645OpIviTrQ4-0-t500x500.jpg",
    },
    {
      id: 2,
      src: "https://upload.wikimedia.org/wikipedia/en/b/b1/Fleetwood_Mac_-_Fleetwood_Mac_%281975%29.png",
    },
    {
      id: 6,
      src: "https://upload.wikimedia.org/wikipedia/en/2/27/IllmaticNas.jpg",
    },
    {
      id: 9,
      src: "https://upload.wikimedia.org/wikipedia/en/6/64/SystemofaDownToxicityalbumcover.jpg",
    },
  ],
};
