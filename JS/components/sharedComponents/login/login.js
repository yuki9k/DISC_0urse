function loginForm() {
  let form = document.createElement("form");
  let wrapper = document.querySelector("#wrapper");
  wrapper.appendChild(form);
  form.innerHTML = `
    <div class="login_container">
        <div id="form_header">
           <p id="form_title">DISC_Ourse</p>
          <p id="form_text">Login</p>
        </div>
        <input id="login_user" type="text" placeholder="username">
        <input id="login_password" type="password" placeholder="password">
        <button id="login_button">Log in</button>
        <button id="show_signup">Sign up here</button>
    </div>
`;

//   let loginButton = document.querySelector("#login_button");
//   loginButton.addEventListener("click", doLogin);

  let signupButton = document.querySelector("#show_signup");
  signupButton.addEventListener("click", signupForm);
}
