import { PubSub } from "../../../../logic/PubSub.js";
import * as postBox from "./postBox/postBox.js";

function renderPostsContainer(parent, data) {
  const postsListContainer = document.createElement("ul");
  postsListContainer.id = "postsListContainer";
  parent.appendChild(postsListContainer);

  for (let chat of data) {
    PubSub.publish({
      event: "renderPostBox|getUserData",
      details: { parent: postsListContainer, data: chat },
    });
  }
}

PubSub.subscribe({
  event: "renderPostsContainer",
  listener: (details) => {
    const { parent, data } = details;
    renderPostsContainer(parent, data);
  },
});

PubSub.subscribe({
  event: "sendToPostParent",
  listener: (details) => {
    const user = details.user;
    const postsListContainer = document.querySelector("#postsListContainer");
    const chat = { data: details.post, parent: postsListContainer };
    chat.parent = postsListContainer;
    PubSub.publish({
      event: "renderPostBox",
      details: { chat: chat, user: user },
    });
  },
});

function sortPostsContainer({ dom, order }) {
  [...dom.children]
    .sort((a, b) => {
      switch (order) {
        case "Oldest":
          return a.dataset.time - b.dataset.time;

        case "Newest":
          return b.dataset.time - a.dataset.time;

        case "Unpopular":
          return a.dataset.postScore - b.dataset.postScore;

        case "Popular":
          return b.dataset.postScore - a.dataset.postScore;
      }
    })
    .forEach((node) => {
      dom.appendChild(node);
    });
}

PubSub.subscribe({
  event: "sortPostsContainer",
  listener: sortPostsContainer,
});
