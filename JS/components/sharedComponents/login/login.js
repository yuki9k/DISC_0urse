import * as signup from "../signup/signup.js";
import { fetcher } from "../../../logic/helpFunctions.js"
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
          <p id="form_title">Login</p>
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

  // Prevent scrolling of the underlying content while modal is open
  document.body.style.overflow = "hidden";

  // Function to handle closing the modal when clicking outside the form
  const handleCloseModal = () => {
    modalContainer.remove();
    // Restore scrolling of the underlying content
    document.body.style.overflow = "";
  };

  // Add event listener to close modal when clicking outside the form
  modalContainer.addEventListener("click", (event) => {
    if (event.target === modalContainer) {
      handleCloseModal();
    }
  });

  // Event listener for switching to signup form
  const switchToSignupButton =
    modalContainer.querySelector("#switch_to_signup");
  switchToSignupButton.addEventListener("click", () => {
    handleCloseModal(); // Close the current login modal
    PubSub.publish({
      event: "renderSignup",
      details: null,
    }); // Render the signup form
  });

  // Event listener for login button (you can implement login logic here)
  const loginButton = modalContainer.querySelector("#login_button");

  loginButton.addEventListener("click", async () => {
    let username = login_user.value;
    let password = login_password.value;

    let body = { name: username, password: password };

    if (username.length > 1 && password.length > 1) {
      let request = new Request("./api/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      let resource = await fetcher(request);
      let token = resource.token;
      localStorage.setItem("token", token);
      handleCloseModal();
      console.log(token);
    }
  });
}
