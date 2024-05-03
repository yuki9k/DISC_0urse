"use strict";
export { postNewUser, getToken, loginUser, getUser };
import { fetcher } from "./fetcher.js";
import { createJsonRequest } from "./jsonRequest.js";

async function postNewUser(username, password) {
  const newUser = {
    username,
    password,
    profilePicture: "url",
    score: 0,
    roomIds: [1, 2, 3, 4, 5, 6],
    friendsIds: [],
  };
  const newUserReq = createJsonRequest("../../api/users.php", newUser, "POST");
  // Will the response from the api return just the token or more things about the user?
  const { token } = await fetcher(newUserReq);
  return token;
}

async function getToken(username, password) {
  const loginUserReq = createJsonRequest(
    "../../api/login.php",
    { username, password },
    "POST"
  );
  const { token } = await fetcher(loginUserReq);
  return token;
}

async function loginUser(token) {
  const req = new Request(`../../api/login.php?token=${token}`);
  const res = await fetcher(req);
  return res;
}

async function getUser(userId) {
  const req = new Request(`../../api/users.php?userId=${userId}`);
  const res = await fetcher(req);
  return res;
}
