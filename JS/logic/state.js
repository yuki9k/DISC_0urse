import { PubSub } from "./PubSub.js";
import { fetcher } from "./helpFunctions.js";

const State = {
  url: "http://localhost:8080/api/",
  _state: {
    posts: [],
  },
  post: async function (ent, options) {
    const request = new Request(this.url + ent + ".php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(options.body),
    });
    const response = await fetcher(request);
    if (!response.success.ok) {
      //throw error
    } else {
      switch (ent) {
        case "posts":
          this._state[ent].push(response.resource);
          PubSub.publish({
            event: "sendToPostParent",
            details: {
              post: response.resource,
              user: State._state.thisUser,
            },
          });
          break;
        case "friends":
          let user = response.resource[0];
          let friend = response.resource[1];
          let id = user.id;
          for (let obj of this._state.users) {
            if (obj.id === id) {
              obj = response.resource;
            }
          }
          PubSub.publish({
            event: "updateFriendsInfo",
            details: friend
          });
      }
    }
    //request okayed push new entity to state.
  },

  patch: async function (ent, options) {
    const endpoint = ent === "thisUser" ? "users" : ent;

    const request = new Request(this.url + endpoint + ".php", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(options.body),
    });

    const response = await fetcher(request);

    if (ent === "thisUser") {
      this._state.thisUser = response.resource;
      PubSub.publish({
        event: "patchThisUserRender",
        details: this._state.thisUser,
      });
      return;
    }

    let id = response.resource["id"];
    for (let obj of this._state[ent]) {
      if (obj["id"] === id) {
        obj = response.resource;
      }
    }

    PubSub.publish({
      event: "renderPostLikedCounter",
      details: response.resource,
    });

    //fire pubsub event for updating front end.
  },

  destruct: async function (ent, options) {
    const url = "http://localhost:8080/api/";

    const request = new Request(this.url + ent + ".php", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: options.body,
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
  getPrivateRooms: async function () {
    const request = new Request(this.url + `private.php`);
    const response = await fetcher(request);
    const rooms = response.resource;
    const userId = this._state.thisUser.id;

    return {
      rooms: rooms,
      userId: userId,
    };
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

  getAlbumHexColor: function (genreId) {
    return this._state.genres[genreId].albumImageHexColors;
  },

  updateGenres: async function () {
    this._state.genres = [];
    const reqGenres = new Request(URL + "genres.php", {
      method: "GET",
    });
    const resGenres = await fetcher(reqGenres);
    this._state.genres = resGenres.resource;
  },

  updateFriends: async function () { },
  /* getUserRooms: async function () {
    const token = localStorage.getItem("token");
    const userRooms = new Request(URL + `private.php?token=${token}`, {
      method: "GET",
    });
    const resUserRooms = await fetcher(userRooms);
    return resUserRooms.resource;
  } */
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
        score: State._state.thisUser.score,
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

    let requestPosts = new Request(URL + "posts.php", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    let responsePosts = await fetcher(requestPosts);
    State._state.posts = responsePosts.resource;

    PubSub.publish({
      event: "renderHomepageInfoRecived",
      details: {
        parent: document.querySelector("#wrapper"),
        users: State._state.users,
        genres: State._state.genres,
        pubRooms: State._state.publicRooms,
        posts: State._state.posts,
      },
    });
    PubSub.publish({
      event: "renderHeader",
      details: null,
    });
  },
});

PubSub.subscribe({
  event: "getInfo|renderAddedFriends|createRoom",
  listener: async (details) => {
    let friends = [];
    let friendIds = State._state.thisUser.friends;

    for (let friendId of friendIds) {
      let friend = await State.getExternalUser(friendId);
      friends.push(friend);
    }
    PubSub.publish({
      event: "recievedInfo|renderAddedFriends|createRoom",
      details: friends
    });
  }
})
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
    if (State._state.thisUser.friendRequests.length > 0) {
      const reqUsers = [];
      for (const reqId of State._state.thisUser.friendRequests) {
        reqUsers.push(await State.getExternalUser(reqId));
      }
      PubSub.publish({
        event: "foundFriendRequests",
        details: reqUsers,
      });
    }
    PubSub.publish({ event: "foundFriends", details: friendArr });
  },
});

PubSub.subscribe({
  event: "getPrivateRooms",
  listener: async () => {
    const data = await State.getPrivateRooms();
    const rooms = data.rooms;
    const userId = data.userId;
    const roomArray = [];

    for (let room of rooms) {
      if (room.hostID === userId) {
        roomArray.push(room);
      }
    }

    PubSub.publish({ event: "foundRooms", details: roomArray });
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
  },
});
PubSub.subscribe({
  event: "addPostItem",
  listener: (details) => {
    const { ent, body } = details;
    State.post(ent, { body: body });
  },
});

PubSub.subscribe({
  event: "patchPostItem",
  listener: (details) => {
    const { ent, body } = details;
    State.patch(ent, { body: body });
  },
});
PubSub.subscribe({
  event: "renderPostBox|getUserData",
  listener: async (details) => {
    const user = await State.getExternalUser(details.data.userID);
    PubSub.publish({
      event: "renderPostBox",
      details: {
        chat: details,
        user: user,
      },
    });
  },
});

PubSub.subscribe({
  event: "getUserForPost",
  listener: async (details) => {
    const user = await State.getExternalUser(details.id);
    PubSub.publish({
      event: "sendUserForPost",
      details: user,
    });
  },
});

PubSub.subscribe({
  event: "getRoomPosts",
  listener: async (details) => {
    const posts = await State.getPostsFromRoom(details.id);
    PubSub.publish({
      event: "sendRoomPosts",
      details: { posts, id: details.id },
    });
  },
});

PubSub.subscribe({
  event: "getRoomInfo",
  listener: (details) => {
    const token = localStorage.getItem("token");
    let rooms = {
      public: State._state.publicRooms,
      private: [],
    };
    if (!token) {
      //publish with no private rooms

      PubSub.publish({
        event: "renderSideNav",
        details: {
          parent: details.parent,
          menuIcon: details.menuIcon,
          rooms: rooms,
        },
      });
    } else {
      //publish with private rooms
      if (typeof State._state.privateRooms === "array") {
        if (State._state.privateRooms.length > 0) {
          rooms.private = State._state.privateRooms;
        }
      }
      PubSub.publish({
        event: "renderSideNav",
        details: {
          parent: details.parent,
          menuIcon: details.menuIcon,
          rooms: rooms,
        },
      });
    }
  },
});

PubSub.subscribe({
  event: "getAlbum",
  listener: (details) => {
    PubSub.publish({
      event: "sendAlbum",
      details: State._state.genres[details],
    });
  },
});

PubSub.subscribe({
  event: "getAlbumHexColor",
  listener: (genreId) => {
    PubSub.publish({
      event: "sendAlbumHexColor",
      details: State.getAlbumHexColor(genreId),
    });
  },
});

PubSub.subscribe({
  event: "userCreatedRoom",
  listener: (details) => {
    const token = localStorage.getItem("token");
    const body = {
      token: token,
      genre: details.genre,
      style: details.style,
      name: details.name,
      users: details.users,
    };
    const request = new Request("./api/private.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    fetcher(request);
  },
});

PubSub.subscribe({
  event: "getAlbumInfo",
  listener: (details) => {
    const albumInfo = State.getAlbumInformation(details);
    PubSub.publish({
      event: "foundAlbumInfo",
      details: albumInfo,
    });
  },
});

PubSub.subscribe({
  event: "sendFriendRequest",
  listener: (details) => {
    const user = details;
    const token = localStorage.getItem("token");
    const ent = "friends";
    const options = {
      body: {
        token: token,
        name: user,
      },
    };
    State.post(ent, options);
  },
});

PubSub.subscribe({
  event: "removeFriend",
  listener: (details) => {
    const request = new Request("./api/users.php", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: details
    })
  }
})
