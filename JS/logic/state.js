import { PubSub } from "./PubSub.js";
import { fetcher } from "./helpFunctions.js";

const State = {
  _state: {},
  patch: function () {},
  post: function () {},
  delete: function () {},
  getData: async function (ent, options) {
    if (!this._state[ent]) {
      return;
    }

    const URL = "http://localhost:8080/";
    const token = localStorage.getItem("token");

    // GENRES, FRIENDS, USERS, POSTS, ROOM
    switch (ent) {
      case "genres":
        const genresData = this._state["genres"];
        return JSON.parse(JSON.stringify(data));

      case "genre":
        const { genreName } = options;
        const genreData = this._state["genres"][genreName];
        return JSON.parse(JSON.stringify(data));

      case "posts":
        if (options["postsRoom"]) {
          const { roomId } = options;
          const reqPosts = new Request(URL + `posts.php?roomID=${roomId}`, {
            method: "GET",
          });

          const resPosts = await fetcher(reqPosts);
          return JSON.parse(JSON.stringify(resPosts.resource));
        }

        if (options["postsUser"]) {
          const { userId } = options;
          const reqPosts = new Request(URL + `posts.php?userID=${userId}`, {
            method: "GET",
          });

          const resPosts = await fetcher(reqPosts);
          return JSON.parse(JSON.stringify(resPosts.resource));
        }
        break;

      //   case "post":
      //     const { postId } = options;
      //     break;

      case "user":
        break;

      default:
        break;
    }
  },
};

PubSub.subscribe({
  event: "userLogin",
  listener: async () => {
    const URL = "http://localhost:8080/";

    const username = null;
    const password = null;
    const reqToken = new Request(URL + "login.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: { name: username, password },
    });

    // Gets token
    const resToken = await fetcher(reqToken);
    if (resToken.status !== 200) {
      return;
    } else {
      const token = resToken.resource;
      localStorage.setItem("token", token);
    }

    // Get logged in user
    const reqThisUser = new Request(
      URL + `users.php?token=${localStorage.getItem("token")}`,
      {
        method: "GET",
      }
    );

    const resThisUser = await fetcher(reqThisUser);
    if (resThisUser.status !== 200) {
      return;
    } else {
      State._state.thisUser = resThisUser.resource;
    }

    // Gets private rooms
    const privateRoomsObject = {};
    const reqPrivateRooms = new Request(
      URL + `private.php?hostID=${State._state.thisUser.id}`,
      {
        method: "GET",
      }
    );

    const resPrivateRooms = await fetcher(reqPrivateRooms);
    if (resPrivateRooms.status !== 200) {
      return;
    } else {
      State._state.privateRooms = resPrivateRooms.resource;
    }
  },
});
PubSub.subscribe({
  event: "renderHomepage",
  listener: async () => {
    const URL = "http://localhost:8080/";

    // Get public users
    const reqUsers = new Request(URL + "users.php", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const resUsers = await fetcher(reqUsers);
    State._state.users = resUsers.resource;

    // Get genres
    const reqGenres = new Request(URL + "genres.php", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
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
