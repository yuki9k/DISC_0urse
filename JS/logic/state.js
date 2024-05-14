import {PubSub} from "./PubSub.js";
import {fetcher} from "./helpFunctions.js";

const _state = [];
PubSub.subscribe({
    event:"renderHomepage",
    listener: async () => {
        let url = "http://localhost:8080/";
        
        let requestUsers = new Request(url + "users.php",{
            method: "GET",
            headers: {"Content-Type": "application/json"}
        });
        let responseUsers = await fetcher(requestUsers);
        _state["users"] = responseUsers.resource;
        
        let requestGenres = new Request(url + "genres.php",{
            method: "GET",
            headers: {"Content-Type": "application/json"}
        });
        let responseGenres = await fetcher(requestGenres);
        _state["genres"] = responseGenres.resource;

        let requestPrivRooms = new Request(url + "private.php",{
            method: "GET",
            headers: {"Content-Type": "application/json"}
        });
        let responsePrivRooms = await fetcher(requestPrivRooms);
        if(responsePrivRooms.status == 400){
            _state["privRooms"] = [];
        } else {
            _state["privRooms"] = responsePrivRooms.resource;
        }
        
        let requestPubRooms = new Request(url + "public.php",{
            method: "GET",
            headers: {"Content-Type": "application/json"}
        });
        let responsePubRooms = await fetcher(requestPubRooms);
        _state["pubRooms"] = responsePubRooms.resource;

        let requestPosts = new Request(url + "posts.php",{
            method: "GET",
            headers: {"Content-Type": "application/json"}
        });
        let responsePosts = await fetcher(requestPosts);
        _state["posts"] = responsePosts.resource;

        console.log(_state);
    }
})
