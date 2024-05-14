import * as header from "./JS/components/sharedComponents/header/header.js";
import * as main from "./JS/components/homepage/homepage.js";

import { PubSub } from "./JS/logic/PubSub.js";

const token = localStorage.getItem("token");
if (token) {
    PubSub.publish({
        event: "renderHomepage",
        details: document.querySelector("#wrapper")
    });

    console.log("hello from if");
}
