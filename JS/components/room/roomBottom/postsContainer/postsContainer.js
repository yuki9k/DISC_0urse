import {PubSub} from "../../../../logic/PubSub.js";
import * as postBox from "./postBox/postBox.js";

function renderPostsContainer(parent, data){
    const postsListContainer = document.createElement("ul");
    postsListContainer.id = "postsListContainer";
    parent.appendChild(postsListContainer);
    

    console.log(data);
    for(let chat of data){
        
        PubSub.publish({
            event: "renderPostBox|getUserData",
            details: {"parent": postsListContainer, "data": chat}
        });
    }
}

PubSub.subscribe({
    event: "renderPostsContainer",
    listener: (details) => {
        const {parent, data} = details;
        renderPostsContainer(parent, data);
    }
})

