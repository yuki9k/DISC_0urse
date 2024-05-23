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
    const postsListContainer = document.querySelector("#postsListContainer");

    PubSub.publish({
      event: "renderPostBox",
      details: { parent: postsListContainer, data: details },
    });
  },
});

function sortPostsContainer({ dom, order }) {
  [...dom.children]
    .sort((a, b) => {
      switch (order) {
        case "Newest":
          return a.dataset.postTime - b.dataset.postTime;

        case "Oldest":
          return b.dataset.postTime - a.dataset.postTime;

        case "Unpopular":
          return a.dataset.postScore - b.dataset.postScore;

        case "Popular":
          return b.dataset.postScore - a.dataset.postScore;
      }
    })
    .forEach((node) => {
      console.log(node);
      dom.appendChild(node);
    });
}

PubSub.subscribe({
  event: "sortPostsContainer",
  listener: sortPostsContainer,
});
