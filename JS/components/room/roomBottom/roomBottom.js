import {PubSub} from "../../../logic/PubSub.js";
import * as postFiltering from "./filterButton/filterButton.js";
import * as addPostButton from "./addPostButton/addPostButton.js";

function renderRoomBottom(parent, data){
    parent.innerHTML = `<ul id="posts_container"></ul>
                        <div id="filter_add_post_container">
                            <div id="filter_posts"></div>
                            <div id="add_posts"></div>
                        </div>`;

    const posts_container = parent.querySelector("#posts_container");
    const filter_posts = parent.querySelector("#filter_posts");
    const add_posts = parent.querySelector("#add_posts");

    PubSub.publish({
        event: "renderAddPostButton",
        details: add_posts
    });

    
    PubSub.publish({
        event: "renderFilterButton",
        details: filter_posts
    });
}

PubSub.subscribe({
    event: "renderRoomBottom",
    listener: renderRoomBottom
});