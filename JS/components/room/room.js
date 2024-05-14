import {PubSub} from "../../logic/PubSub.js";
import * as roomTop from "./roomTop/roomTop.js";
import * as roomBottom from "./roomBottom/roomBottom.js";
import * as roomTopAnimation from "./roomTop/roomTopAnimation/roomTopAnimation.js";

function renderRoom(parent){
    parent.innerHTML = `<div id="room_container"> 
                            <div id="room_top"></div>
                            <div id="room_bottom"></div>
                        </div>`;

    const roomTop = parent.querySelector("#room_top");
    const roomBottom = parent.querySelector("#room_bottom");
    const roomContainer = parent.querySelector("#room_container");

    PubSub.publish({
        event: "renderRoomTop",
        details: roomTop
    });

    PubSub.publish({
        event: "renderRoomBottom",
        details: roomBottom
    });

    PubSub.publish({
        event: "initiateHeightToTopAnimation",
        details: roomContainer.offsetHeight
    });
}

PubSub.subscribe({
    event:"renderRoom",
    listener: renderRoom
});



