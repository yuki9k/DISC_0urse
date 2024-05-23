import { PubSub } from "../../logic/PubSub.js";
import * as roomTop from "./roomTop/roomTop.js";
import * as roomBottom from "./roomBottom/roomBottom.js";
import * as roomTopAnimation from "./roomTop/roomTopAnimation/roomTopAnimation.js";
import { colorToHsl } from "../../logic/helpFunctions.js";

function renderRoom(details) {
  let roomInfo = details.room;
  let parent = details.parent;
  details.parent.innerHTML = `<div id="room_container" class=${roomInfo.id}> 
                                    <div id="room_top"></div>
                                    <div id="room_bottom"></div>
                                </div>`;
  const roomTop = parent.querySelector("#room_top");
  const roomBottom = parent.querySelector("#room_bottom");
  const roomContainer = parent.querySelector("#room_container");

  PubSub.publish({
    event: "renderRoomTop",
    details: {
      parent: roomTop,
      data: roomInfo,
    },
  });
  PubSub.publish({
    event: "getRoomPosts",
    details: details.room,
  });

  PubSub.publish({
    event: "initiateHeightToTopAnimation",
    details: roomContainer.offsetHeight,
  });

  PubSub.subscribe({
    event: "sendAlbumHexColor",
    listener: (cArr) => {
      const c = cArr[0];
      const accentColorHex = {
        type: "hex",
        value: c,
      };

      let { h, s, l } = colorToHsl(accentColorHex);

      s = Math.min(s, 80);
      l = Math.min(l, 80);

      if (l < 50) {
        roomTop.style.color = "var(--paragraph_color_white)";
      }
      roomTop.style.backgroundColor = `hsl(${h} ${s} ${l})`;
    },
  });
  PubSub.publish({ event: "getAlbumHexColor", details: roomInfo.genre });
}

PubSub.subscribe({
  event: "renderRoom",
  listener: (details) => {
    renderRoom(details);
  },
});

PubSub.subscribe({
  event: "roomHeight",
  listener: (padding) => {
    const roomContainer = document.querySelector("#room_container");
    roomContainer.style.paddingBottom = padding;
  },
});
