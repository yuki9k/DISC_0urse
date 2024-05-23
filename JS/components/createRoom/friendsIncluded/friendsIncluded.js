import { PubSub } from "../../../logic/PubSub.js";
import { fetcher } from "../../../logic/helpFunctions.js";

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
    <button class="create_room_button">Submit</button>
  `;

  const addButton = document.querySelector(".add_container");
  addButton.addEventListener("click", () => {
    let container = document.querySelector(".added_friends_container");
    let friendDiv = document.createElement("div");
    friendDiv.className = "friend_container";
    friendDiv.textContent = "img";

    container.appendChild(friendDiv);
  });

  const createButton = document.querySelector(".create_room_button");

  createButton.addEventListener("click", (e) => {
    const genre = document.querySelector(".choose_genre");
    const style = document.querySelector(".choose_theme");

    const token = localStorage.getItem("token");
    const name = document.querySelector(".input_room_name");

    PubSub.publish({
      event: "userCreatedRoom",
      details: {
        genre: genre.value, 
        style: style.value,
        name: name.value
      }
    });

    PubSub.publish({
      event: "renderHomepage",
      details: null
    })
  });
}
