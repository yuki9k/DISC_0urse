function renderHeader() {
    const header = document.createElement("header");
    let wrapper = document.querySelector("#wrapper");
    wrapper.appendChild(header);
    header.innerHTML = `
      <div class="menu">
          <div class="menu_icon_container">
              <div class="bar1"></div>
              <div class="bar2"></div>
              <div class="bar3"></div>
          </div>   
          <div class="dropdown">
              <div class="dropdown_item">
                  <div class="dropdown_title">Friends</div>
                  <div class="dropdown_friends">
                      <div class="dropdown_box"></div>
                      <div class="dropdown_box"></div>
                      <div class="dropdown_box"></div>
                  </div>
              </div>
              <div class="dropdown_item">
                  <div class="dropdown_title">Rooms</div>
                  <div class="dropdown_rooms">
                      <div class="dropdown_box"></div>
                      <div class="dropdown_box"></div>
                      <div class="dropdown_box"></div>
                  </div>
              </div>
          </div>
      </div>
      <a class="home_button" href="index.html">DISC_ourse</a>
      <div class="buttons_container">
          <div class="login_button">Log in</div> 
          <div class="signup_button">Sign up</div> 
      </div>
    `;
  
    const menuIcon = document.querySelector(".menu_icon_container");
    const dropdown = document.querySelector(".dropdown");
    const loginButton = document.querySelector(".login_button");
    const signupButton = document.querySelector(".signup_button");
  
    // Toggle dropdown menu on menu icon click
    menuIcon.addEventListener("click", () => {
      menuIcon.classList.toggle("change");
      dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
    });
  
    // Display login form when login button is clicked
    loginButton.addEventListener("click", () => {
      renderLoginForm(); // Call renderLoginForm function
    });
  
    // Display signup form when signup button is clicked
    signupButton.addEventListener("click", () => {
      renderSignupForm(); // Call renderSignupForm function
    });
  }
  