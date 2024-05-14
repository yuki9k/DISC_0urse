import { PubSub } from "../../../../../logic/PubSub.js";

function renderPostItem(parent, data){
    const postItem = document.createElement("li");
    parent.appendChild(postItem);
    postItem.id = "post_id_";
    postItem.innerHTML = data;

    if(postItem.offsetWidth >= 400){
        postItem.style.width = `${postItem.offsetWidth - 300}px`;
    }
}

PubSub.subscribe({
    event: "renderPost",
    listener: (details) => {
        const {parent, data} = details;
        renderPostItem(parent, data);
    }
});

