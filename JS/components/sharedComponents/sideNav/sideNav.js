import * as createRoom from "../../createRoom/main/main.js";
import * as showProfile from "../showProfile/showProfile.js";
import * as renderRoom from "../../room/room.js";
import { PubSub } from "../../../logic/PubSub.js";
//HERE
PubSub.subscribe({
  event: "renderSideNav",
  listener: (details) => {
    renderDropdownItems(details.parent, details.menuIcon, details.rooms);
  },
});

PubSub.subscribe({
  event: "loginComplete",
  listener: () => {
    PubSub.publish({
      event: "getFriends",
      details: null,
    });
    PubSub.publish({
      event: "get PrivateRooms",
      details: null,
    });
  },
});

PubSub.subscribe({
  event: "foundFriends",
  listener: (friends) => {
    const parent = document.querySelector(".dropdown");
    const icon = document.querySelector(".menu_icon_container");

    for (let friend of friends) {
      renderFriends(parent, icon, friend);
    }
  },
});

PubSub.subscribe({
  event: "foundRooms",
  listener: (rooms) => {
    const parent = document.querySelector(".dropdown");
    const icon = document.querySelector(".menu_icon_container");

    for (let room of rooms) {
      renderPrivateRooms(parent, icon, room);
    }
  },
});
function renderDropdownItems(parent, icon, roomsToRender) {
  const friendsItem = document.createElement("div");
  friendsItem.classList.add("dropdown_item");
  friendsItem.innerHTML = `
    <div class="room_title_one">
      <div class="dropdown_title">Friends</div>
      <div class="add_friend_button">
        <div>+</div>
      </div>
    </div>
    <div class="dropdown_friends"></div>
  `;
  parent.appendChild(friendsItem);

  const roomsItem = document.createElement("div");
  roomsItem.classList.add("dropdown_item_rooms");
/*   <div class="dropdown_box_rooms room_pop">
        <p>Pop</p>
      </div>
      <div class="dropdown_box_rooms room_rock">
        <p>Rock</p>
      </div>
      <div class="dropdown_box_rooms room_singer">
        <p>Singer Songwriter</p>
      </div>
      <div class="dropdown_box_rooms room_folk">
        <p>Folk</p>
      </div>
      <div class="dropdown_box_rooms room_rb">
        <p>R&B</p>
      </div>
      <div class="dropdown_box_rooms room_pp">
        <p>Post Punk</p>
      </div> */

  roomsItem.innerHTML = `
    <div class="dropdown_title">Rooms</div>
    <div class="dropdown_title_two">Public Rooms</div>
    <div class="dropdown_rooms" id="publicRoomDropdown">
     
    </div>
    <div class="room_title_two">
      <div class="dropdown_title_two">Private Rooms</div>
      <div class="create_private_room_button">
        <div>+</div>
      </div>
    </div>
    <div class="dropdown_rooms" id="privateRoomDropdown">
      
    </div>
  `;
  parent.appendChild(roomsItem);
  const firstRoomDropDown = document.querySelector("#publicRoomDropdown");
  const secondRoomDropDown = document.querySelector("#privateRoomDropdown");
  for(const room of roomsToRender.public){
    let div = document.createElement("div");
    div.classList.add(`dropdown_box_rooms`,`room_${room.id}`);
    div.innerHTML = `<p>${room.genre}</p>`;
    firstRoomDropDown.appendChild(div);
    div.addEventListener("click", () => {
      const menuIcon = icon;
      const dropdown = parent;
      const wrapper = document.querySelector("#wrapper");
      menuIcon.classList.toggle("change");
      dropdown.classList.toggle("active");
      PubSub.publish({
        event: "renderRoom",
        details: {
          parent: wrapper,
          room: room
        }
      });
    });
  }
  if(roomsToRender.private.length > 0){
    for(const room of roomsToRender.private){
      secondRoomDropDown.innerHTML += `
      <div class="dropdown_box_rooms room_${room.id}">
        <p>${room.genre}</p>
      </div>
    `;
    }
  }
  

  const createPrivateRoom = document.querySelector(
    ".create_private_room_button"
  );
  /* const rooms = document.querySelectorAll(".dropdown_box_rooms");

  rooms.forEach((room) => {
    room.addEventListener("click", () => {
      
      let wrapper = document.querySelector("#wrapper");

      PubSub.publish({
        event: "renderRoom",
        details: {
          parent: wrapper,
          room: room
        },
      });
    });
  }); */

  createPrivateRoom.addEventListener("click", () => {
    menuIcon.classList.toggle("change");
    dropdown.classList.toggle("active");

    PubSub.publish({
      event: "renderCreateRoom",
      details: null,
    });
  });
}

function renderFriends(dropdown, icon, friend) {
  let parent = document.querySelector(".dropdown_friends");
  let friendDom = document.createElement("div");
  friendDom.className = "dropdown_box_friends";
  parent.appendChild(friendDom);
  friendDom.innerHTML = `
      <img class="friend_image" src="${friend.profilePicture}">
      <div class="friend_username">${friend.name}</div> 
    `;

  friendDom.addEventListener("click", (e) => {
    const menuIcon = icon;
    const parent = dropdown;
    menuIcon.classList.toggle("change");
    parent.classList.toggle("active");

    PubSub.publish({
      event: "renderFriendProfile",
      details: {
        username: friend.name,
        status: friend.status,
        score: friend.score
      }
    });

    PubSub.subscribe({
      event: "foundUserInfo",
      listener: (details) => {
        PubSub.publish({
          event: "renderFriendProfile",
          details: details,
        });
      },
    });
  });
}

function renderPrivateRooms(dropdown, icon, room) {
  let parent = document.querySelector(".dropdown_rooms");
  let roomDom = document.createElement("div");
  roomDom.className = "dropdown_box_rooms";
  parent.appendChild(roomDom);
  roomDom.innerHTML = `
      <div>
        <p>${room.name}</p>
      </div>
    `;

  roomDom.addEventListener("click", (e) => {
    const menuIcon = icon;
    const parent = dropdown;
    menuIcon.classList.toggle("change");
    parent.classList.toggle("active");

    PubSub.publish({
      event: "renderRoom",
      details: null
    });
  });
}
