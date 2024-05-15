import * as header from "./JS/components/sharedComponents/header/header.js";
import * as main from "./JS/components/homepage/homepage.js";
import * as state from "./JS/logic/state.js";
import { PubSub } from "./JS/logic/PubSub.js";

const token = localStorage.getItem("token");
const username = localStorage.getItem("username");

if (token) {
    PubSub.publish({
        event: "userLogin",
        details: null
    });
    PubSub.publish({
        event: "loginComplete",
        details: {token, username}
    });
    PubSub.publish({
        event: "renderHomepage",
        details: document.querySelector("#wrapper")
    });
} else {
    PubSub.publish({
        event: "renderHomepage",
        details: document.querySelector("#wrapper")
    });
}
