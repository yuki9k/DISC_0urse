import * as addedFriends from "../friendsIncluded/friendsIncluded.js";
import { PubSub } from "../../../logic/PubSub.js";

PubSub.subscribe({
    event: "renderCreateRoom",
    listener: (event) => {
        renderCreate();
    }
});

function renderCreate () {
    let main = document.createElement("main");
    main.className = "main_container_create_room";
    let wrapper = document.querySelector("#wrapper");
    wrapper.innerHTML = "";
    wrapper.appendChild(main);

    main.innerHTML = `
        <div class="container_main">
            <h2 class="create_room_title">Create new room</h2>
            <div class="room_name_container">
                <p class="room_name_text">Room name</p>
                <input type="text" placeholder="Enter room name here" class="input_room_name">
            </div>
            <div class="bottom">
                <div class="genre_theme_container">
                    <p class="room_genre">Genre</p>
                        <select class="choose_genre">  
                            <option>Choose genre</option>
                            <option value="Pop">Pop</option>  
                            <option value="Rock">Rock</option>  
                            <option value="Singer Songwriter">Singer & Songwriter</option>  
                            <option value="Folk">Folk</option>  
                            <option value="R&B">R&B</option>  
                            <option value="Post Punk">Post Punk</option>  
                        </select> 
                    <p class="room_theme">Theme</p>
                        <select class="choose_theme">  
                            <option>Choose theme</option>  
                            <option value="one">Theme One</option>  
                            <option value="two">Theme Two</option>  
                            <option value="three">Theme Three</option>  
                            <option value="four">Theme Four</option>  
                            <option value="five">Theme Five</option>  
                            <option value="six">Theme Six</option>  
                        </select> 
                </div>
                <div class="placeholders">
                    <div class="create_room_album_cover"></div>
                    <div class="two">
                        <p class="album_title_in_div">Genre here</p>
                    </div>
                    <div class="create_room_album_info"></div>
                </div>
            </div>
            <div class="underline"></div>
        </div>
    `;

    const genre = document.querySelector(".choose_genre");
    genre.addEventListener("click", (e) => {
        const genrePlaceholder = document.querySelector(".album_title_in_div");
        genrePlaceholder.textContent = genre.value;
        
        const albumCover = document.querySelector(".create_room_album_cover");
        const albumInfo = document.querySelector(".create_room_album_info");

    })

    PubSub.publish({
        event: "renderAddedFriends",
        details: null
    });
}