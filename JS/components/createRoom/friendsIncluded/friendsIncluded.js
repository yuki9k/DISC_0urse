import { PubSub } from "../../../logic/PubSub.js";
import { fetcher } from "../../../logic/helpFunctions.js";

PubSub.subscribe({
  event: "renderAddedFriends",
  listener: (event) => {
    renderAddedFriends();
  },
});

function renderAddedFriends() {
  PubSub.publish({
    event: "getInfo|renderAddedFriends|createRoom",
    details: null,
  });

  PubSub.unsubscribe("recievedInfo|renderAddedFriends|createRoom");
  PubSub.subscribe({
    event: "recievedInfo|renderAddedFriends|createRoom",
    listener: (details) => {
      let friendsToInvite = [];
      let friends = details;
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
        const modalContainer = document.createElement("div");
        modalContainer.classList.add("modal_container");

        document.body.style.overflow = "hidden";
        const handleCloseModal = () => {
          modalContainer.remove();
          document.body.style.overflow = "";
        };

        modalContainer.addEventListener("click", (event) => {
          if (event.target === modalContainer) {
            handleCloseModal();
          }
        });
        wrapper.appendChild(modalContainer);
        modalContainer.innerHTML = `
    <div class="add_friend_container">
      <h3>Invite friends:</h3>
    </div>
      `;
        let friendContainer = modalContainer.querySelector(
          ".add_friend_container"
        );
        //const friend of friends
        for (let i = 0; i < friends.length; i++) {
          let div = document.createElement("div");
          div.classList.add("dropdown_box_friends");
          div.id = `invite_friend_${friends[i].id}`;
          div.innerHTML = `
              <div class="friend_username">${friends[i].name}</div>
              <img class="friend_image" src="../../../../images/profile.png">
          `;
          friendContainer.appendChild(div);
          friendContainer
            .querySelector(`#invite_friend_${friends[i].id}`)
            .addEventListener("click", () => {
              console.log(friends, friendsToInvite);
              let container = document.querySelector(
                ".added_friends_container"
              );
              let friendDiv = document.createElement("div");
              friendDiv.className = "friend_container";
              friendDiv.classList.add("friend_image");
              friendDiv.textContent = friends[i].name;
              container.appendChild(friendDiv);
              friendsToInvite.push(friends[i].id);
              friends.splice(i, 1);

              handleCloseModal();
            });
        }
      });

      const createButton = document.querySelector(".create_room_button");

      createButton.addEventListener("click", (e) => {
        const style = document.querySelector(".choose_theme");

        const token = localStorage.getItem("token");
        const name = document.querySelector(".input_room_name");

        const genre = document.querySelector(".choose_genre");
        let genreValue = "";

        switch (genre.value) {
          case "1":
            genreValue = "Indie Pop";
            break;

          case "2":
            genreValue = "Indie Rock";
            break;

          case "3":
            genreValue = "Indie Singer-songwriter";
            break;

          case "4":
            genreValue = "Indie Folk";
            break;

          case "5":
            genreValue = "Indie R&b";
            break;

          case "6":
            genreValue = "Indie Post-punk";
            break;
        }

        PubSub.publish({
          event: "userCreatedRoom",
          details: {
            genre: genreValue,
            style: style.value,
            name: name.value,
            users: friendsToInvite,
          },
        });

        PubSub.publish({
          event: "renderHomepage",
          details: null,
        });
      });
    },
  });
}
