import { PubSub } from "../../../../logic/PubSub.js";
import * as state from "../../../../logic/state.js";

function renderAddPostButton(parent) {
  parent.innerHTML = `<div id="add_post_button">
                            <div id="plus_sign">+</div>
                            <textarea id="post_input"></textarea>
                            <div id="custom">
                                <button id="send_post">send</button> 
                            </div>
                        </div>`;

  const plusSign = parent.querySelector("#plus_sign");
  const addPostButton = parent.querySelector("#add_post_button");
  const input = parent.querySelector("#post_input");
  const sendPost = parent.querySelector("#send_post");

  plusSign.addEventListener("click", () => {
    plusSign.classList.add("undisplay");
    addPostButton.classList.add("border_rad_change");
    input.classList.add("display");
    sendPost.classList.add("display");

    PubSub.publish({
      event: "moveFilterAddPostContainer",
      details: "add",
    });

    window.addEventListener("click", function onWindowClickCloseInput(event) {
      if (
        event.target !== plusSign &&
        event.target !== input &&
        event.target &&
        addPostButton
      ) {
        plusSign.classList.remove("undisplay");
        addPostButton.classList.remove("border_rad_change");
        input.classList.remove("display");
        sendPost.classList.remove("display");

        PubSub.publish({
          event: "moveFilterAddPostContainer",
          details: "remove",
        });
      }
    });
  });

  sendPost.addEventListener("click", () => {
    const inputValue = input.value;

    const body = {
      token: localStorage.getItem("token"),
      roomID: 2,
      time: Math.floor(Date.now() / 1000),
      content: inputValue,
    };

    PubSub.publish({
      event: "addPostItem",
      details: { ent: "posts", body: body },
    });

    input.value = "";
  });
}

PubSub.subscribe({
  event: "renderAddPostButton",
  listener: renderAddPostButton,
});
