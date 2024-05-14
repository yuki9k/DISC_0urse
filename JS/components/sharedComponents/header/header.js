import * as login from "../login/login.js";
import * as signup from "../signup/signup.js";
import * as createRoom from "../../createRoom/main/main.js";
import * as showProfile from "../showProfile/showProfile.js";
import { PubSub } from "../../../logic/PubSub.js";

PubSub.subscribe({
  event: "renderHomepage",
  listener: (details) => {
    renderHeader();
  },
});

PubSub.subscribe({
  event: "loginComplete",
  listener: (details) => {
    renderHeader(details.token, details.username)
  }
});

function renderHeader(token, username) {
  const header = document.createElement("header");
  let wrapper = document.querySelector("#wrapper");
  wrapper.appendChild(header);
  header.innerHTML = `
      <div class="menu">
          <div class="menu_icon_container">
              <div class="bar1"></div>
              <div class="bar2"></div>
              <div class="bar3"></div>
          </div>   
          <div class="dropdown">
              <div class="dropdown_item">
                <div class="room_title_one">
                  <div class="dropdown_title">Friends</div>
                  <div class="add_friend_button">
                    <div>+</div>
                  </div>
                </div>
                  <div class="dropdown_friends">
                      <div class="dropdown_box_friends">
                        <div class="friend_image"></div> 
                        <div class="friend_username">User23840232312</div> 
                      </div>
                      <div class="dropdown_box_friends">
                        <div class="friend_image"></div> 
                        <div class="friend_username">User233444502</div> 
                      </div>
                      <div class="dropdown_box_friends">
                        <div class="friend_image"></div> 
                        <div class="friend_username">User2384092384902</div> 
                      </div>
                  </div>
              </div>
              <div class="dropdown_item_rooms">
                  <div class="dropdown_title">Rooms</div>
                  <div class="dropdown_title_two">Public Rooms</div>
                  <div class="dropdown_rooms">
                      <div class="dropdown_box_rooms">
                        <p>Genre</p>
                      </div>
                      <div class="dropdown_box_rooms">
                        <p>Genre</p>
                      </div>
                      <div class="dropdown_box_rooms">
                        <p>Genre</p>
                      </div>
                      <div class="dropdown_box_rooms">
                        <p>Genre</p>
                      </div>
                      <div class="dropdown_box_rooms">
                        <p>Genre</p>
                      </div>
                      <div class="dropdown_box_rooms">
                        <p>Genre</p>
                      </div>
                  </div>
                  <div class="room_title_two">
                    <div class="dropdown_title_two">Private Rooms</div>
                    <div class="create_private_room_button">
                        <div>+</div>
                    </div>
                  </div>
                  <div class="dropdown_rooms">
                      <div class="dropdown_box_rooms">
                        <p>Room</p>
                      </div>
                      <div class="dropdown_box_rooms">
                        <p>Room</p>
                      </div>
                      <div class="dropdown_box_rooms">
                        <p>Room</p>
                      </div>
                      <div class="dropdown_box_rooms">
                        <p>Room</p>
                      </div>
                      <div class="dropdown_box_rooms">
                        <p>Room</p>
                      </div>
                      <div class="dropdown_box_rooms">
                        <p>Room</p>
                      </div>
                      <div class="dropdown_box_rooms">
                        <p>Room</p>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      <a class="home_button" href="index.html">DISC_ourse</a>
      <div class="buttons_container">
          <div class="login_button">Log in</div> 
          <div class="signup_button">Sign up</div> 
      </div>
    `;

  const menuIcon = document.querySelector(".menu_icon_container");
  const dropdown = document.querySelector(".dropdown");
  const loginButton = document.querySelector(".login_button");
  const signupButton = document.querySelector(".signup_button");
  const createPrivateRoom = document.querySelector(".create_private_room_button");
  const showFriendProfile = document.querySelector(".dropdown_box_friends");
  const buttons_container = document.querySelector(".buttons_container");

  if (token) {
    buttons_container.innerHTML = "";
    buttons_container.textContent = username;
  }

  menuIcon.addEventListener("click", () => {
    menuIcon.classList.toggle("change");
    dropdown.classList.toggle("active");
  });

  loginButton.addEventListener("click", () => {
    PubSub.publish({
      event: "renderLogin",
      details: null,
    });
  });

  signupButton.addEventListener("click", () => {
    PubSub.publish({
      event: "renderSignup",
      details: null,
    });
  });

  createPrivateRoom.addEventListener("click", () => {
    menuIcon.classList.toggle("change");
    dropdown.classList.toggle("active");
    
    PubSub.publish({
      event: "renderCreateRoom",
      details: null,
    });
  });

  showFriendProfile.addEventListener("click", () => {
    menuIcon.classList.toggle("change");
    dropdown.classList.toggle("active");
    
    PubSub.publish({
      event: "renderFriendProfile",
      details: null,
    });
  });
}

