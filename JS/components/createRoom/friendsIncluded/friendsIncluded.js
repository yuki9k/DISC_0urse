import { PubSub } from "../../../logic/PubSub.js";

PubSub.subscribe({
  event: "renderAddedFriends",
  listener: (event) => {
    renderAddedFriends();
  },
});

function renderAddedFriends() {
  let container = document.createElement("div");
  container.className = "added_friends";
  let wrapper = document.querySelector("#wrapper");
  wrapper.appendChild(container);

  container.innerHTML = `
    <div class="added_friends_container">
        <div class="add_container">
            <div class="plus_sign">+</div>
        </div>
    </div>
  `;

  const addButton = document.querySelector(".add_container");
  addButton.addEventListener ("click", () => {
    let container = document.querySelector(".added_friends_container");
    let friendDiv = document.createElement("div");
    friendDiv.className = "friend_container";
    friendDiv.textContent = "img";

    container.appendChild(friendDiv);
  });
}
