import { PubSub } from "../../../../logic/PubSub.js";
import * as state from "../../../../logic/state.js";
import { colorToHsl } from "../../../../logic/helpFunctions.js";

function renderAddPostButton(parent, id) {
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

  const inlineStyle =
    document.querySelector("#room_top").attributes.style.value;

  addPostButton.style = inlineStyle;

  plusSign.addEventListener("click", (event) => {
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
      roomID: id,
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
  listener: (details) => {
    const { parent, id } = details;
    renderAddPostButton(parent, id);
  },
});
