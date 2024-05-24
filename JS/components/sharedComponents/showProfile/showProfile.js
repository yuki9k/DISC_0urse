import { fetcher } from "../../../logic/helpFunctions.js";
import { PubSub } from "../../../logic/PubSub.js";

PubSub.subscribe({
  event: "renderFriendProfile",
  listener: (details) => {
    renderFriendProfile(details.username, details.status, details.score, details.friendID, details.friendDomID, details.post);
  },
});

PubSub.subscribe({
  event: "renderProfileInfo",
  listener: (details) => {
    renderProfile(details.username, details.status, details.score, details.post);
  },
});

function renderFriendProfile(username, status, score, friendID, friendDomID, post) {
  const modalContainer = document.createElement("div");
  modalContainer.classList.add("modal_container");
  let wrapper = document.querySelector("#wrapper");
  wrapper.appendChild(modalContainer);
  modalContainer.innerHTML = `
    <div class="modal_content">  
        <div class="upper_section">
            <div class="profile_info">
                <p class="username">${username}</p>
                <p class="status"><span class="status_text">Status:</span> ${status}</p>
            </div>
            <div class="profile_picture"></div>
        </div>
        <div class="middle_section">
            <p class="middle_section_left">Latest post:</p>
            <p class="middle_section_right">Score: ${score}</p>
        </div>
        <div class="bottom_section">
            <div class="post_container">
                <p class="post_container_text">${post.content}</p>
                <p class="post_container_points">${post.likedBy.length - post.dislikedBy.length} points</p>
            </div>
        </div>
        <div class="settings">
          <div class="remove_friend_container">
            <button class="remove_friend_button">Remove friend</button>
          </div>
        </div>
    </div>
  `;

  document.body.style.overflow = "hidden";

  function handleCloseModal() {
    modalContainer.remove();
    document.body.style.overflow = "";
  }

  modalContainer.addEventListener("click", (event) => {
    if (event.target === modalContainer) {
      handleCloseModal();
    }
  });

  const removeFriend = document.querySelector(".remove_friend_button");
  removeFriend.addEventListener("click", (e) => {
    const token = localStorage.getItem("token");

    const body = { friendID: friendID, token: token };
    PubSub.publish({
      event: "removeFriend",
      details: body
    })

    friendDomID.remove();
    handleCloseModal();
  })
}

function renderProfile(username, status, score, post) {
  const modalContainer = document.createElement("div");
  modalContainer.classList.add("modal_container");
  let wrapper = document.querySelector("#wrapper");
  wrapper.appendChild(modalContainer);
  modalContainer.innerHTML = `
    <div class="modal_content">  
        <div class="upper_section">
            <div class="profile_info">
                <p class="username">${username}</p>
                <input class="change_username" placeholder="change username">
                <p class="status"><span class="status_text">Status:</span> ${status}</p>
                <input class="change_status" placeholder="change status">
            </div>
            <div class="profile_picture"></div>
        </div>
        <div class="middle_section">
            <p class="middle_section_left">Latest post:</p>
            <p class="middle_section_right">Score: ${score}</p>
        </div>
        <div class="bottom_section">
          <div class="post_container">
            <p class="post_container_text">${post.content}</p>
            <p class="post_container_points">${post.likedBy.length - post.dislikedBy.length} points</p>
          </div>
        </div>
        <div class="settings">
          <div class="edit_container">
            <button class="edit_user">Edit information</button>
          </div>
          <div class="logout_container">
            <button class="logout_user">Logout</button>
          </div>
        </div>
    </div>
  `;

  const changeUsername = document.querySelector(".change_username");
  changeUsername.classList.add("display_none");
  const changeStatus = document.querySelector(".change_status");
  changeStatus.classList.add("display_none");

  document.body.style.overflow = "hidden";

  function handleCloseModal() {
    modalContainer.remove();
    document.body.style.overflow = "";
  }

  modalContainer.addEventListener("click", (event) => {
    if (event.target === modalContainer) {
      handleCloseModal();
    }
  });

  let editButton = document.querySelector(".edit_user");
  editButton.addEventListener("click", async (e) => {
    let username = document.querySelector(".change_username");
    username.value = document.querySelector(
      ".profile_info > .username"
    ).textContent;
    let status = document.querySelector(".change_status");

    if (editButton.textContent === "Save changes") {
      const token = localStorage.getItem("token");

      const userPassword = prompt("Write your password for changing info");
      const body = {
        username: username.value,
        status: status.value,
        password: userPassword,
      };

      PubSub.publish({
        event: "confirmPassword",
        details: userPassword,
      });

      PubSub.subscribe({
        event: "passwordConfirmed",
        listener: (details) => {
          PubSub.publish({
            event: "patchThisUser",
            details: body,
          });

          PubSub.subscribe({
            event: "foundUserInfo",
            listener: (details) => {
              handleCloseModal();
              renderProfile(details.name, details.status, details.score);
            },
          });
        },
      });
    } else {
      editButton.textContent = "Save changes";

      let username = document.querySelector(".username");
      let status = document.querySelector(".status");

      username.classList.toggle("display_none");
      status.classList.toggle("display_none");
      changeUsername.classList.toggle("display_none");
      changeStatus.classList.toggle("display_none");
    }
  });

  const logoutButton = document.querySelector(".logout_user");
  logoutButton.addEventListener("click", () => {
    PubSub.publish({
      event: "userLoggedOut",
      details: null,
    });
  });
}
