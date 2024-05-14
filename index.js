import * as header from "./JS/components/sharedComponents/header/header.js";
import { PubSub } from "./JS/logic/PubSub.js";

PubSub.publish({
    event: "renderHomepage",
    details: document.querySelector("#wrapper")
});
