// import { PubSub } from "../../../logic/PubSub";

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
  };

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
    renderLoginForm();
  });

  // Event listener for signup button (you can implement signup logic here)
  const signupButton = modalContainer.querySelector("#signup_button");
  signupButton.addEventListener("click", () => {
    handleCloseModal();
  });

}

