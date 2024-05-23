import * as login from "../login/login.js";
import { fetcher } from "../../../logic/helpFunctions.js";
import { PubSub } from "../../../logic/PubSub.js";

PubSub.subscribe({
  event: "renderSignup",
  listener: (details) => {
    renderSignupForm();
  },
});

function renderSignupForm() {
  const modalContainer = document.createElement("div");
  modalContainer.classList.add("modal_container");
  modalContainer.innerHTML = `
    <div class="modal_content">
      <div class="form_container">
        <div id="form_header">
          <p id="form_title">DISC_ourse</p>
          <p id="form_text">Create a new account</p>
        </div>
        <input id="signup_user" type="text" placeholder="Username">
        <input id="signup_password" type="password" placeholder="Password">
        <input id="rewrite_signup_password" type="password" placeholder="Confirm Password">
        <button id="signup_button">Sign up</button>
        <button id="switch_to_login">Already a user? Log in here</button>
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

  const switchToLoginButton = modalContainer.querySelector("#switch_to_login");
  switchToLoginButton.addEventListener("click", () => {
    handleCloseModal();
    PubSub.publish({
      event: "renderLogin",
      details: null,
    });
  });

  const inputUsername = document.querySelector("#signup_user");
  const inputPassword = document.querySelector("#signup_password");
  const inputPassword2 = document.querySelector("#rewrite_signup_password");

  const signupButton = modalContainer.querySelector("#signup_button");
  signupButton.addEventListener("click", async () => {
    let username = inputUsername.value.trim();
    let password = inputPassword.value.trim();
    let password2 = inputPassword2.value.trim();

    if (password === password2 && password.length > 1 && username.length > 1) {
      let body = { name: username, password: password };

      let request = new Request("./api/users.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      let resource = await fetcher(request);
      handleCloseModal();
      PubSub.publish({
        event: "signupComplete",
        details: username,
      });
    } else {
        inputUsername.style.border = "1.5px solid red";
        inputPassword.style.border = "1.5px solid red";
        inputPassword2.style.border = "1.5px solid red";
    }
  });
}
