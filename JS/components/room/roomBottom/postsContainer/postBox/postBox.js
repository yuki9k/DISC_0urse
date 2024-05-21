import {PubSub} from "../../../../../logic/PubSub.js";
import * as state from "../../../../../logic/state.js";

function renderPostBox(parent, data){
    const postBox = document.createElement("li");
    parent.appendChild(postBox);
    postBox.id = "post_"+ data.id; 

    const likedCount = data.likedBy.length;
    const dislikedCount = data.dislikedBy.length;
    const sum = likedCount - dislikedCount;

    postBox.innerHTML = `<div class="post_content_box">
                            <div class="post_top">
                                <div class="profile_pic_name">
                                    <img src="">
                                    <span id="profile_name">Gnajor</span>
                                </div>
                                <div class="post_time">10 min ago</div>
                            </div>
                            <div class="post_middle">
                                <p class="post_content">${data.content}</p>
                            </div>
                            <div class="post_bottom">
                                <div class="react_box">
                                    <div class="positive likeButton"> + </div>
                                    <div class="negative dislikeButton"> - </div>
                                </div>
                                <div class="reaction_counter_box">
                                    <span class="total_count">${sum} </span>(<span class="positive">${+likedCount}</span>/<span class="negative">${-dislikedCount}</span>)
                                </div>
                            </div>
                        <div>`;

    const like = postBox.querySelector(".likeButton");
    const dislike = postBox.querySelector(".dislikeButton");

    like.addEventListener("click", (event) => {
        const body = {
            "token": localStorage.getItem("token"),
            "id": data.id,
            "like": null
        }

        PubSub.publish({
            event: "patchPostItem",
            details: {"ent": "posts", "body": JSON.stringify(body)}
        });
    });

    dislike.addEventListener("click", (event) => {
        const body = {
            "token": localStorage.getItem("token"),
            "id": data.id,
            "dislike": null
        }

        PubSub.publish({
            event: "patchPostItem",
            details: {"ent": "posts", "body": JSON.stringify(body)}
        });
    });
}

PubSub.subscribe({
    event: "renderPostBox",
    listener: (details) => {
        const {parent, data} = details;
        renderPostBox(parent, data);
    }
});

PubSub.subscribe({
    event: "renderPostLikedCounter",
    listener: (details) => {
        const post = document.querySelector("#post_" + details.id);
        const post_liked = post.querySelector(".reaction_counter_box > .positive");
        const post_disliked = post.querySelector(".reaction_counter_box > .negative");
        const post_sum = post.querySelector(".reaction_counter_box > .total_count");

        post_liked.innerHTML = "+" + details.likedBy.length;
        post_disliked.innerHTML = "-" + details.dislikedBy.length;
        post_sum.innerHTML = details.likedBy.length - details.dislikedBy.length;
    }
})



