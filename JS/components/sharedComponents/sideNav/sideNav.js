import * as createRoom from "../../createRoom/main/main.js";
import * as showProfile from "../showProfile/showProfile.js";
import * as renderRoom from "../../room/room.js";
import { PubSub } from "../../../logic/PubSub.js";

PubSub.subscribe({
  event: "renderSideNav",
  listener: (details) => {
    renderDropdownItems(details.parent, details.menuIcon);
  },
});

function renderDropdownItems(parent, icon) {
const friendsItem = document.createElement("div");
  friendsItem.classList.add("dropdown_item");
  friendsItem.innerHTML = `
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
    </div>
  `;
  parent.appendChild(friendsItem);

  const roomsItem = document.createElement("div");
  roomsItem.classList.add("dropdown_item_rooms");
  roomsItem.innerHTML = `
    <div class="dropdown_title">Rooms</div>
    <div class="dropdown_title_two">Public Rooms</div>
    <div class="dropdown_rooms">
      <div class="dropdown_box_rooms room_pop">
        <p>Indie Pop</p>
      </div>
      <div class="dropdown_box_rooms room_rock">
        <p>Indie Rock</p>
      </div>
      <div class="dropdown_box_rooms room_singer">
        <p>Indie Singer Songwriter</p>
      </div>
      <div class="dropdown_box_rooms room_folk">
        <p>Indie Folk</p>
      </div>
      <div class="dropdown_box_rooms room_rb">
        <p>Indie R&B</p>
      </div>
      <div class="dropdown_box_rooms room_pp">
        <p>Indie Post-punk</p>
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
    </div>
  `;
  parent.appendChild(roomsItem);

  const menuIcon = icon;
  const dropdown = parent;
  const createPrivateRoom = document.querySelector(".create_private_room_button");
  const showFriendProfile = document.querySelector(".dropdown_box_friends");
  const rooms = document.querySelectorAll(".dropdown_box_rooms");

  rooms.forEach((room) => {
    room.addEventListener("click", () => {
      menuIcon.classList.toggle("change");
      dropdown.classList.toggle("active");
      let wrapper = document.querySelector("#wrapper");

      PubSub.publish({
        event: "renderRoom",
        details: wrapper,
      });
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
