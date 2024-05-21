import { fetcher } from "../../../logic/helpFunctions.js";
import { PubSub } from "../../../logic/PubSub.js";

PubSub.subscribe({
  event: "renderFriendProfile",
  listener: (details) => {
    console.log(details);
    renderFriendProfile(details.username, details.status, details.score);
  },
});

PubSub.subscribe({
  event: "renderProfileInfo",
  listener: (details) => {
    renderProfile(details.username, details.status, details.score);
  },
});

function renderFriendProfile(username, status, score) {
  const modalContainer = document.createElement("div");
  modalContainer.classList.add("modal_container");
  let wrapper = document.querySelector("#wrapper");
  wrapper.appendChild(modalContainer);
  modalContainer.innerHTML = `
    <div class="modal_content">  
        <div class="upper_section">
            <div class="profile_info">
                <p class="username">${username}</p>
                <p class="status">${status}</p>
            </div>
            <div class="profile_picture"></div>
        </div>
        <div class="middle_section">
            <p class="middle_section_left">Latest post:</p>
            <p class="middle_section_right">Score: ${score}</p>
        </div>
        <div class="bottom_section">
            <div class="post_container">
                <div class="upper">
                    <p class="post_container_genre">Genre here</p>
                    <p class="post_container_timestamp">seconds ago</p>
                </div>
                <p class="post_container_text">Text here</p>
                <p class="post_container_points">Points here</p>
            </div>
        </div>
    </div>
  `;

  // Prevent scrolling of the underlying content while modal is open
  document.body.style.overflow = "hidden";

  // Function to handle closing the modal when clicking outside the form
  const handleCloseModal = () => {
    modalContainer.remove();
    document.body.style.overflow = "";
  };

  // Add event listener to close modal when clicking outside the form
  modalContainer.addEventListener("click", (event) => {
    if (event.target === modalContainer) {
      handleCloseModal();
    }
  });
}

function renderProfile(username, status, score) {
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
                <p class="status">${status}</p>
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
                <div class="upper">
                    <p class="post_container_genre">Genre here</p>
                    <p class="post_container_timestamp">seconds ago</p>
                </div>
                <p class="post_container_text">Text here</p>
                <p class="post_container_points">Points here</p>
            </div>
        </div>
        <div class="edit_container">
          <button class="edit_user">Edit information</button>
        </div>
        <div class="logout_container">
          <button class="logout_user">Logout</button>
        </div>
    </div>
  `;

  const changeUsername = document.querySelector(".change_username");
  changeUsername.classList.add("display_none");
  const changeStatus = document.querySelector(".change_status");
  changeStatus.classList.add("display_none");

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

  let editButton = document.querySelector(".edit_user");
  editButton.addEventListener("click", async (e) => {
    let username = document.querySelector(".change_username");
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
              renderProfile(details.name, details.status);
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
      details: null
    })
  });
}
