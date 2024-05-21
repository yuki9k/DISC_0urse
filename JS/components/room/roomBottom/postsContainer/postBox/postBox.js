import {PubSub} from "../../../../../logic/PubSub.js";

function renderPostBox(data, user){
    const postBox = document.createElement("li");
    data.parent.appendChild(postBox);
  /*   postBox.id = ""; */
    /* PubSub.publish({
        event: "getUserForPost",
        details: {
            id: data.userID
        }
    }); */
    console.log(data);
    postBox.innerHTML = `<div class="post_content_box">
                    <div class="post_top">
                        <div class="profile_pic_name">
                            <img src="">
                            <span id="profile_name">${user.name}</span>
                        </div>
                        <div class="post_time">10 min ago</div>
                    </div>
                    <div class="post_middle">
                        <p class="post_content">${data.data.content}</p>
                    </div>
                    <div class="post_bottom">
                        <div class="react_box">
                            <div class="positive"> + </div>
                            <div class="negative"> - </div>
                        </div>
                        <div class="reaction_counter_box">
                            <span class="total_count">${data.data.likedBy.length - data.data.dislikedBy.length}p </span>(<span class="positive">+${data.data.likedBy.length}</span>/<span class="negative">-${data.data.dislikedBy.length}</span>)
                        </div>
                    </div>
                <div>`;
}
    

PubSub.subscribe({
    event: "renderPostBox",
    listener: (details) => {
        renderPostBox(details.chat, details.user);
    }
})

