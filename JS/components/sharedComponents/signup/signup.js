import * as login from "../login/login.js";
import { fetcher } from "../../../logic/helpFunctions.js"
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
          <p id="form_title">Sign Up</p>
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

  // Prevent scrolling of the underlying content while modal is open
  document.body.style.overflow = "hidden";

  // Function to handle closing the modal when clicking outside the form
  function handleCloseModal() {
    modalContainer.remove();
    // Restore scrolling of the underlying content
    document.body.style.overflow = "";
  }

  // Add event listener to close modal when clicking outside the form
  modalContainer.addEventListener("click", (event) => {
    if (event.target === modalContainer) {
      handleCloseModal();
    }
  });

  // Event listener for switching back to login form
  const switchToLoginButton = modalContainer.querySelector("#switch_to_login");
  switchToLoginButton.addEventListener("click", () => {
    handleCloseModal();
    PubSub.publish({
      event: "renderLogin",
      details: null,
    });
  });

  // Event listener for signup button (you can implement signup logic here)
  const signupButton = modalContainer.querySelector("#signup_button");
  signupButton.addEventListener("click", async () => {
    let username = signup_user.value;
    let password = signup_password.value;

    let body = { name: username, password: password };

    if (username.length > 1 && password.length > 1) {
      let request = new Request("./api/users.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      let resource = await fetcher(request);
      handleCloseModal();
      console.log(resource);
      PubSub.publish ({
        event: "signupComplete",
        details: username
      });
    }
  });
}
