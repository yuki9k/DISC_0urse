import {PubSub} from "../../../../logic/PubSub.js";
import * as postBox from "./postBox/postBox.js";

function renderPostsContainer(parent, data){
    const postsListContainer = document.createElement("ul");
    postsListContainer.id = "postsListContainer";
    parent.appendChild(postsListContainer);
    



/*     for(let i = 0; i < 2; i++){
        for(let chat of data){
            PubSub.publish({
                event: "renderPostBox",
                details: {"parent": postsListContainer, "data": chat}
            });
        }
    } */
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
});

PubSub.subscribe({
    event: "sendToPostParent",
    listener:(details) => {
        
        
        const user = details.user;
        const postsListContainer = document.querySelector("#postsListContainer");
        const chat = {data: details.post, parent: postsListContainer}
        console.log(chat);
        chat.parent = postsListContainer;
        PubSub.publish({
            event: "renderPostBox",
            details: {chat: chat, user: user}
        })

    }
})

