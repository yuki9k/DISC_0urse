import { PubSub, PubSub } from "./PubSub.js";
import { fetcher } from "./helpFunctions.js";

const State = {
  url: "http://localhost:8080/",
  _state: {
      "posts": []
  },
	post: async function (ent, options){
    const request = new Request(this.url + ent + ".php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(options.body),
    });
    const response = await fetcher(request);

    if (!response.ok) {
      //throw error
    }
    //request okayed push new entity to state.
    this._state[ent].push(response.resource);

    PubSub.publish({
      event: "sendToPostParent",
      details: response.resource
    });
  },
  patch: async function (ent, options) {
    const endpoint = ent === "thisUser" ? "users" : ent;
    console.log(options);
    console.log(JSON.stringify(options.body));

    const request = new Request(this.url + endpoint + ".php", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(options.body),
    });

    const response = await fetcher(request);
    console.log(response.resource);

    if (ent === "thisUser") {
      this._state.thisUser = response.resource;
      PubSub.publish({
        event: "patchThisUserRender",
        details: this._state.thisUser,
      });
      return;
    }

    let id = response.resource["id"];
    for (const obj of this._state[ent]) {
      if (obj["id"] === id) {
        obj = response.resource;
      }
    }

    PubSub.publish({
      event:"renderPostLikedCounter",
      details: response.resource
    });

    //fire pubsub event for updating front end.
  },
  
  destruct: async function (ent, options){
    const url = "http://localhost:8080/";
    
    const request = new Request(this.url + ent + ".php", {
        method: "DELETE",
        headers: {"Content-Type": "application/json"},
        body: options.body
    });
    const response = await fetcher(request);
    let users = response.resource;
    for (const user of users) {
      if (!this._state["users"].includes(user)) {
        this._state["users"].push(user);
      }
    }
    return users;
  },
  getUsersPosts: async function (options) {
    const request = new Request(this.url + "posts.php?userID=" + options.id, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const response = await fetcher(request);
    let posts = response.resource;
    for (const post of posts) {
      if (!this._state["posts"].includes(post)) {
        this._state["posts"].push(post);
      }
    }
    return posts;
  },
  getExternalUser: async function (userId) {
    // Checks if user is already present in state and therefore doesn't do another unnecesary fetch
    for (const user of this._state.users) {
      if (user.id === userId) {
        return user;
      }
    }

    const req = new Request(this.url + `users.php?id=${userId}`);
    const res = await fetcher(req);
    if (!res.success.ok) {
      return;
    }

    this._state.users.push(res.resource);
    return res.resource;
  },
  getPostsFromRoom: async function (roomId) {
    const req = new Request(this.url + `posts.php?roomID=${roomId}`);
    const res = await fetcher(req);
    if (!res.success.ok) {
      return;
    }

    return res.resource;
  },
  getFriendIds: function () {
    return this._state.thisUser.friends;
  },
  getAlbumInformation: function (genreId) {
    switch (genreId) {
      case 1:
        return this._state.genres["Indie Pop"];
      case 2:
        return this._state.genres["Indie Rock"];
      case 3:
        return this._state.genres["Indie Singer-songwriter"];
      case 4:
        return this._state.genres["Indie Folk"];
      case 5:
        return this._state.genres["Indie R&b"];
      case 6:
        return this._state.genres["Indie Post-punk"];
      default:
        return;
    }
  },
  updateGenres: async function () {
    this._state.genres = [];
    const reqGenres = new Request(URL + "genres.php", {
      method: "GET",
    });
    const resGenres = await fetcher(reqGenres);
    this._state.genres = resGenres.resource;
  },
  updateFriends: async function () {},
};

PubSub.subscribe({
  event: "userLoggedIn",
  listener: async () => {
    const URL = "http://localhost:8080/api/";

    // Get logged in user detals
    const token = localStorage.getItem("token");
    const reqThisUser = new Request(URL + `users.php?token=${token}`, {
      method: "GET",
    });

    const resThisUser = await fetcher(reqThisUser);
    if (!resThisUser.success.ok) {
      return;
    } else {
      State._state.thisUser = resThisUser.resource;
    }

    // Get private rooms that user has access too
    const reqPrivateRooms = new Request(
      URL + `private.php?hostID=${State._state.thisUser.id}`,
      {
        method: "GET",
      }
    );

    const resPrivateRooms = await fetcher(reqPrivateRooms);
    State._state.privateRooms = resPrivateRooms.resource
      ? resPrivateRooms.resource
      : [];
    PubSub.publish({
      event: "loginComplete",
      details: {
        token: localStorage.getItem("token"),
        username: State._state.thisUser.name,
        status: State._state.thisUser.status,
        score: State._state.thisUser.score
      },
    });
  },
});

PubSub.subscribe({
  event: "userLogin",
  listener: async (details) => {
    const URL = "http://localhost:8080/api/";

    // Gets token
    const username = details.name;
    const password = details.password;
    const reqToken = new Request(URL + "login.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: username, password }),
    });

    const resToken = await fetcher(reqToken);
    if (!resToken.success.ok) {
      return;
    } else {
      const token = resToken.resource.token;
      localStorage.setItem("token", token);
    }
    PubSub.publish({ event: "userLoggedIn", details: null });
  },
});

PubSub.subscribe({
  event: "renderHomepage",
  listener: async () => {
    const URL = "http://localhost:8080/api/";

    // Get public users
    const reqUsers = new Request(URL + "users.php", {
      method: "GET",
    });
    const resUsers = await fetcher(reqUsers);
    State._state.users = resUsers.resource;

    // Get genres
    const reqGenres = new Request(URL + "genres.php", {
      method: "GET",
    });
    const resGenres = await fetcher(reqGenres);
    State._state.genres = resGenres.resource;

    // let requestPrivRooms = new Request(url + "private.php", {
    //   method: "GET",
    //   headers: { "Content-Type": "application/json" },
    // });
    // let responsePrivRooms = await fetcher(requestPrivRooms);
    // if (responsePrivRooms.status == 400) {
    //   _state["privRooms"] = [];
    // } else {
    //   _state["privRooms"] = responsePrivRooms.resource;
    // }

    // Get public rooms
    const reqPublicRooms = new Request(URL + "public.php", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const resPublicRooms = await fetcher(reqPublicRooms);
    State._state.publicRooms = resPublicRooms.resource;

    // let requestPosts = new Request(url + "posts.php", {
    //   method: "GET",
    //   headers: { "Content-Type": "application/json" },
    // });
    // let responsePosts = await fetcher(requestPosts);
    // _state["posts"] = responsePosts.resource;

    // console.log(_state);
  },
});

PubSub.subscribe({
  event: "getThisUser",
  listener: async () => {
    State.getCurrentUser();
  },
});

PubSub.subscribe({
  event: "getFriends",
  listener: async () => {
    const friendIds = State.getFriendIds();
    const friendArr = [];
    for (const friendId of friendIds) {
      const friend = await State.getExternalUser(friendId);
      friendArr.push(friend);
    }

    PubSub.publish({ event: "foundFriends", details: friendArr });
  },
});

PubSub.subscribe({
  event: "patchThisUser",
  listener: async (newThisUserInfo) => {
    const URL = "http://localhost:8080/api/";
    const token = localStorage.getItem("token");
    const { username, status } = newThisUserInfo;

    State.patch("thisUser", {
      body: { token, name: username, status },
    });

    if (newThisUserInfo.password) {
      const { password } = newThisUserInfo;
      console.log(password);
      console.log(newThisUserInfo);
      const reqToken = new Request(URL + "login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: username, password }),
      });

      const { resource } = await fetcher(reqToken);
      const token = resource.token;
      localStorage.removeItem("token");
      localStorage.setItem("token", token);
    }
  },
});

PubSub.subscribe({
  event: "patchThisUserRender",
  listener: (thisUser) => {
    PubSub.publish({ event: "foundUserInfo", details: thisUser });
  },
});

PubSub.subscribe({
  event: "confirmPassword",
  listener: async (password) => {
    const URL = "http://localhost:8080/api/";
    const username = State._state.thisUser.name;
    const reqToken = new Request(URL + "login.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: username, password }),
    });

    const { success } = await fetcher(reqToken);

    if (success.ok) {
      PubSub.publish({ event: "passwordConfirmed", details: null });
    }
  },
});

PubSub.subscribe({
  event: "userLogout",
  listener: () => {
    State._state = {};
    localStorage.removeItem("token");
  },
});

PubSub.subscribe({
  event: "getAlbums",
  listener: () => {
    const albums = State._state.genres;
    PubSub.publish({ event: "foundAlbums", details: albums });
  },
});

// Returnerar specifikt album
// PubSub.subscribe({
//   event: "getAlbum",
//   listener: (details) => {
//     const genre = details;
//     console.log(State._state.genres[genre]);
//     PubSub.publish({ event: "foundAlbum", details: albums });
//   },
// });

PubSub.subscribe({
  event: "getTopPosts",
  listener: async (roomId) => {
    const allPosts = State.getPostsFromRoom(roomId);
    const allPostsSorted = allPosts.sort(
      (a, b) =>
        a.likedBy.length -
        a.dislikedBy.length -
        (b.likedBy.length - b.dislikedBy.length)
    );
    const topSixPosts = allPostsSorted.splice(0, 6);
    PubSub.publish({ event: "foundTopPosts", details: topSixPosts.reverse() });
  },
});

PubSub.subscribe({
  event: "userLoggedOut",
  listener: () => {
    localStorage.removeItem("token");
    PubSub.publish({
      event: "renderHomepage",
      details: document.querySelector("#wrapper"),
    });
  }
})
PubSub.subscribe({
  event: "addPostItem",
  listener: (details) => {
    const {ent, body} = details;
    State.post(ent, {body: body});
  }
})

PubSub.subscribe({
  event: "patchPostItem",
  listener: (details) => {
    const {ent, body} = details;
    State.patch(ent, {body: body})
  }
})
