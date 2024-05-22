import * as header from "./JS/components/sharedComponents/header/header.js";
import * as main from "./JS/components/homepage/homepage.js";
import { PubSub } from "./JS/logic/PubSub.js";

const token = localStorage.getItem("token");
const username = localStorage.getItem("username");

if (token) {
    PubSub.publish({
        event: "renderHomepage",
        details: document.querySelector("#wrapper")
    });

    PubSub.publish({
        event: "loginComplete",
        details: {token, username}
    });
} else {
    PubSub.publish({
        event: "renderHomepage",
        details: document.querySelector("#wrapper")
    });
}
