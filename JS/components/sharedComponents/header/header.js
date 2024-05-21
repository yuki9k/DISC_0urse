import * as login from "../login/login.js";
import * as signup from "../signup/signup.js";
import * as sideNav from "../sideNav/sideNav.js";
import { PubSub } from "../../../logic/PubSub.js";

PubSub.subscribe({
  event: "renderHomepage",
  listener: () => {
    renderHeader();
  },
});

function renderHeader() {
  let wrapper = document.querySelector("#header");
  wrapper.innerHTML = "";
  const header = document.createElement("header");
  wrapper.appendChild(header);
  header.innerHTML = `
    <div class="menu">
      <div class="menu_icon_container">
        <div class="bar1"></div>
        <div class="bar2"></div>
        <div class="bar3"></div>
      </div>
      <div class="dropdown"></div>
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

  menuIcon.addEventListener("click", () => {
    menuIcon.classList.toggle("change");
    dropdown.classList.toggle("active");
  });

  loginButton.addEventListener("click", () => {
    PubSub.publish({
      event: "renderLogin",
      details: null,
    });
  });

  signupButton.addEventListener("click", () => {
    PubSub.publish({
      event: "renderSignup",
      details: null,
    });
  });

  PubSub.publish({
    event: "renderSideNav",
    details: { parent: dropdown, menuIcon: menuIcon },
  });
}

PubSub.subscribe({
  event: "loginComplete",
  listener: (details) => {
    const buttons_container = document.querySelector(".buttons_container");
    if (details.token) {
      buttons_container.innerHTML = "";
      buttons_container.textContent = details.username;

      buttons_container.addEventListener("click", (e) => {
        console.log(details);
        PubSub.publish({
          event: "renderProfileInfo",
          details: { username: details.username, status: details.status, score: details.score },
        });
      });
    }
    PubSub.publish({ event: "closeLoginModal", details: null });
  },
});
