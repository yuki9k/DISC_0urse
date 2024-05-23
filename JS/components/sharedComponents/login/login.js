import * as signup from "../signup/signup.js";
import { fetcher } from "../../../logic/helpFunctions.js";
import { PubSub } from "../../../logic/PubSub.js";

PubSub.subscribe({
  event: "renderLogin",
  listener: (details) => {
    renderLoginForm();
  },
});

function renderLoginForm() {
  const modalContainer = document.createElement("div");
  modalContainer.classList.add("modal_container");
  modalContainer.innerHTML = `
    <div class="modal_content">
      <div class="form_container">
        <div id="form_header">
          <p id="form_title">DISC_ourse</p>
          <p id="form_text">Welcome back!</p>
        </div>
        <input id="login_user" type="text" placeholder="Username">
        <input id="login_password" type="password" placeholder="Password">
        <button id="login_button">Log in</button>
        <button id="switch_to_signup">Not a user? Sign up here</button>
      </div>
    </div>
  `;

  let wrapper = document.querySelector("#wrapper");
  wrapper.appendChild(modalContainer);

  document.body.style.overflow = "hidden";

  function handleCloseModal() {
    modalContainer.remove();
    document.body.style.overflow = "";
  }

  modalContainer.addEventListener("click", (event) => {
    if (event.target === modalContainer) {
      handleCloseModal();
    }
  });

  const switchToSignupButton =
  modalContainer.querySelector("#switch_to_signup");
  switchToSignupButton.addEventListener("click", () => {
    handleCloseModal(); 
    PubSub.publish({
      event: "renderSignup",
      details: null,
    });
  });

  const loginButton = modalContainer.querySelector("#login_button");
  loginButton.addEventListener("click", async () => {
    let username = login_user.value.trim();
    let password = login_password.value.trim();

    let body = { name: username, password: password };

    if (username.length > 1 && password.length > 1) {
      PubSub.publish({ event: "userLogin", details: body });
      PubSub.subscribe({
        event: "closeLoginModal",
        listener: handleCloseModal,
      });
    }
  });
}
