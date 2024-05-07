import * as homepage from "./JS/components/homepage/homepage.js";
import { PubSub } from "./JS/logic/PubSub.js";

PubSub.publish({
    event: "renderHomepage",
    details: document.querySelector("#wrapper")
});

