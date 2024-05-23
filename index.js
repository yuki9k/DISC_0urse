import * as header from "./JS/components/sharedComponents/header/header.js";
import * as main from "./JS/components/homepage/homepage.js";
import * as state from "./JS/logic/state.js";
import { PubSub } from "./JS/logic/PubSub.js";

const token = localStorage.getItem("token");
const username = localStorage.getItem("username");

if (token) {
  /* async () => {
    reqThisUser = await fetch("http://localhost:8080/api/users.php?token="+token, {
      method: "GET",
      headers: {"Conte"}
    });
  } */
  PubSub.publish({
    event: "renderHomepage",
    details: document.querySelector("#wrapper"),
  });
  PubSub.publish({ event: "userLoggedIn", details: null });
} else {
  PubSub.publish({
    event: "renderHomepage",
    details: document.querySelector("#wrapper"),
  });
}
