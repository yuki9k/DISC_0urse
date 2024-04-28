function signupForm(event) {
    event.preventDefault();
  
    let form = document.querySelector("form");
    form.innerHTML = `
      <div class="login_container">
      <div id="form_header">
           <p id="form_title">DISC_Ourse</p>
          <p id="form_text">Create User</p>
        </div>
          <input id="signup_user" type="text" placeholder="create username">
          <input id="signup_password" type="password" placeholder="create password">
          <input id="rewrite_signup_password" type="password" placeholder="confirm password">
          <button id="signup_button">Sign up</button>
          <button id="back_to_login_button">Already have a account? <span>Log in here</span></button>
      </div>
      `;
  
    let signupButton = document.querySelector("#signup_button");
    signupButton.addEventListener("click", doSignup);
  }