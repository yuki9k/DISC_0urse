import { PubSub } from "./PubSub.js";
import { fetcher } from "./helpFunctions.js";


const State = {
  url: "http://localhost:8080/",
  _state: {},
	post: async function (ent, options){
    const request = new Request(this.url + ent + ".php", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: options.body
    });
    const response = await fetcher(request);

    if(!response.ok){
        //throw error 
    }
    //request okayed push new entity to state.
    this._state[ent].push(response.resource);
},
patch: async function (ent, options){
    const request = new Request(this.url + ent + ".php", {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: options.body
    });
    const response = await fetcher(request);
    let id = response.resource["id"];
    for(const obj of this._state[ent]){
        if(obj["id"] === id){
            obj = response.resource;
        }
    }
    //fire pubsub event for updating front end.
},
destruct: async function (ent, options){
    
    const request = new Request(this.url + ent + ".php", {
        method: "DELETE",
        headers: {"Content-Type": "application/json"},
        body: options.body
    });
    const response = await fetcher(request);
    let id = response.resource["id"];
    for(const [i, obj] of this._state[ent].entries()){
        if(obj["id"] === id){
            this._state[ent].splice(i, 1);
        }
    }
    //fire pubsub event for updating front end.
	},
	getCurretUser: async function (){
		if(!this.thisUser){
			return "no current user";
		}
		return this.thisUser;
	},
	getAllUsersInRoom: async function(options){
		const request = new Request(this.url + "private.php?id=" + options.id, {
			method: "GET",
			headers: {"Content-Type": "application/json"}
		});
		const response = await fetcher(request);
		let users = response.resource;
		for(user of users){
			if(!this._state["users"].includes(user)){
				this._state["users"].push(user);
			}
		}
		return users;
	},
	getUsersPosts: async function(options){
		const request = new Request(this.url + "posts.php?userID=" + options.id, {
			method: "GET",
			headers: {"Content-Type": "application/json"}
		});
		const response = await fetcher(request);
		let posts = response.resource;
		for(post of posts){
			if(!this._state["posts"].includes(post)){
				this._state["posts"].push(post);
			}
		}
		return posts;
	}

};

PubSub.subscribe({
  event: "userLogin",
  listener: async () => {
    const URL = "http://localhost:8080/";

    // Gets token
    const username = null;
    const password = null;
    const reqToken = new Request(URL + "login.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: { name: username, password },
    });

    const resToken = await fetcher(reqToken);
    if (resToken.status !== 200) {
      return;
    } else {
      const token = resToken.resource;
      localStorage.setItem("token", token);
    }

    // Get logged in user detals
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

    // Get private rooms that user has access too
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
