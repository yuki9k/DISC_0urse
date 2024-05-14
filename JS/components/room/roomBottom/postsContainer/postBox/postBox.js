import {PubSub} from "../../../../../logic/PubSub.js";

function renderPostBox(parent, data){
    const postBox = document.createElement("li");
    parent.appendChild(postBox);
  /*   postBox.id = ""; */

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
                                    <div class="positive"> + </div>
                                    <div class="negative"> - </div>
                                </div>
                                <div class="reaction_counter_box">
                                    <span class="total_count">8p </span>(<span class="positive">+10</span>/<span class="negative">-2</span>)
                                </div>
                            </div>
                        <div>`;
}

PubSub.subscribe({
    event: "renderPostBox",
    listener: (details) => {
        const {parent, data} = details;
        renderPostBox(parent, data);
    }
})

