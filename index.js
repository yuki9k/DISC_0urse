import {PubSub} from "./JS/logic/PubSub.js";
import * as room from "./JS/components/room/room.js";


PubSub.publish({
    event: "renderRoom",
    details: document.querySelector("#wrapper")
});

