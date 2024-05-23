import * as createRoom from "../../createRoom/main/main.js";
import * as showProfile from "../showProfile/showProfile.js";
import * as renderRoom from "../../room/room.js";
import { PubSub } from "../../../logic/PubSub.js";
//HERE


PubSub.subscribe({
  event: "loginComplete",
  listener: () => {
    PubSub.publish({
      event: "getFriends",
      details: null,
    });
    PubSub.publish({
      event: "getPrivateRooms",
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
  event: "foundFriendRequests",
  listener: (requests) => {
    const parent = document.querySelector(".dropdown");
    const icon = document.querySelector(".menu_icon_container");

    for (let request of requests) {
      renderFriendRequests(parent, request);
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

PubSub.subscribe({
  event: "renderSideNav",
  listener: (details) => {
    renderDropdownItems(details.parent, details.menuIcon, details.rooms);
  },
});

PubSub.subscribe({
  event: "updateFriendsInfo",
  listener: (details) => {
    const parent = document.querySelector(".dropdown");
    const icon = document.querySelector(".menu_icon_container");
    renderFriends(parent, icon, details);
    let doms = document.querySelectorAll(".dropdown_friend_requests > div");
    for(let dom of doms){
      let checkID = Number(dom.id.replace("friend_request_", ""));
      if(checkID === details.id){
        dom.remove();
      }
    }
  }
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
    <div class="dropdown_friend_requests"></div>
  `;
  parent.appendChild(friendsItem);
  const addFriendButton = document.querySelector(".add_friend_button");
  addFriendButton.addEventListener("click", (e) => {

    const modalContainer =  document.createElement("div");
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

    let wrapper =  document.querySelector("#wrapper");
    let token = localStorage.getItem("token");
    if(!token){
      wrapper.appendChild(modalContainer);
      modalContainer.innerHTML = `
        <div class="add_friend_container">
          <p id="add_friend_logo">DISC_ourse</p>
          <p id="form_text" class="add_friend_title">Add Friend</p>
          <p style = "color: red">YOU MUST BE LOGGED IN TO ADD FRIENDS >:(</p>
        </div>
      `;
    } else {
      wrapper.appendChild(modalContainer);
      modalContainer.innerHTML = `
        <div class="add_friend_container">
          <p id="add_friend_logo">DISC_ourse</p>
          <p id="form_text" class="add_friend_title">Add Friend</p>
          <input id="new_friend" placeholder="Your new friends username here:">
          <button id="send_friend_request">Send friend request</button>
        </div>
      `;
      document.querySelector("#send_friend_request").addEventListener("click", (e) => {
        const user = document.querySelector("#new_friend").value
        PubSub.publish({
          event: "sendFriendRequest",
          details: user
        });
        handleCloseModal();
      });
    }
  });
  const roomsItem = document.createElement("div");
  roomsItem.classList.add("dropdown_item_rooms");
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
    <div class="dropdown_private_rooms" id="privateRoomDropdown">
      
    </div>
  `;
  parent.appendChild(roomsItem);
  const firstRoomDropDown = document.querySelector("#publicRoomDropdown");
  const secondRoomDropDown = document.querySelector("#privateRoomDropdown");
  const menuIcon = icon;
  const dropdown = parent;
  
  for(const room of roomsToRender.public){
    let div = document.createElement("div");
    div.classList.add(`dropdown_box_rooms`,`room_${room.id}`);
    div.innerHTML = `<p>${room.genre}</p>`;
    firstRoomDropDown.appendChild(div);
    div.addEventListener("click", () => {
      const wrapper = document.querySelector("#wrapper");
      menuIcon.classList.toggle("change");
      dropdown.classList.toggle("active");

      console.log(room)
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
      </div>`;
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
function renderFriendRequests(dropdown, user){
  let parent = document.querySelector(".dropdown_friend_requests");
  let friendDom = document.createElement("div");
  friendDom.className = "dropdown_box_friends";
  friendDom.id = "friend_request_" + user.id;
  parent.appendChild(friendDom);
  friendDom.innerHTML = `
      <img class="friend_image" src="${user.profilePicture}">
      <div style="font-size: 14px" class="friend_username">New friend request from ${user.name}</div>
      <div class="check" id="accept_request_${user.name}">&#9745;</div>
      <div class="cross">&#9746;</div>
    `;
  friendDom.querySelector(".check").addEventListener("click", (e) => {
    PubSub.publish({
      event: "sendFriendRequest",
      details: user.name
    });
  });
}

function renderFriends(dropdown, icon, friend) {
  const menuIcon = icon;
  let parent = document.querySelector(".dropdown_friends");
  let friendDom = document.createElement("div");
  friendDom.className = "dropdown_box_friends";
  parent.appendChild(friendDom);
  friendDom.innerHTML = `
      <img class="friend_image" src="../../../../images/profile.png">
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
  const menuIcon = icon;
  let parent = document.querySelector(".dropdown_private_rooms");
  let roomDom = document.createElement("div");
  roomDom.className = "dropdown_box_rooms";
  parent.appendChild(roomDom);
  roomDom.innerHTML = `
      <div class="dropdown_box_rooms">
        <p>${room.name}</p>
      </div>
    `;

    console.log(room)

  roomDom.addEventListener("click", (e) => {
    const wrapper = document.querySelector("#wrapper");
    const menuIcon = icon;
    const parent = dropdown;
    menuIcon.classList.toggle("change");
    parent.classList.toggle("active");

    PubSub.publish({
      event: "renderRoom",
      details: {
        parent: wrapper,
        room: room
      }
    });
  });
}
