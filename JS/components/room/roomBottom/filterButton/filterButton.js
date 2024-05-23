import { PubSub } from "../../../../logic/PubSub.js";

function renderFilterButton(parent) {
  const filterSelectDom = document.createElement("select");
  filterSelectDom.id = "filter_input";
  filterSelectDom.innerHTML = `
  <option>Newest</option>
  <option>Oldest</option>
  <option>Popular</option>
  <option>Unpopular</option>
  `;
  parent.appendChild(filterSelectDom);

  filterSelectDom.addEventListener("change", () => {
    const postsContainerDom = document.getElementById("postsListContainer");
    PubSub.publish({
      event: "sortPostsContainer",
      details: { dom: postsContainerDom, order: filterSelectDom.value },
    });
  });
}

PubSub.subscribe({
  event: "renderFilterButton",
  listener: renderFilterButton,
});
