import { PubSub } from "../../../../../logic/PubSub.js";
import * as state from "../../../../../logic/state.js";

function renderPostBox(data, user) {
  const postBox = document.createElement("li");
  const DATA = data.data;
  const { likedBy, dislikedBy, time } = DATA;
  postBox.dataset.postScore = likedBy.length - dislikedBy.length;
  postBox.dataset.time = time;
  data.parent.prepend(postBox);
  postBox.id = "post_" + DATA.id;

  const timeSincePost = function () {
    const sTimeDiff = Math.floor(Date.now() / 1000) - time;
    const mTimeDiff = sTimeDiff / 60;
    const hPostTime = Math.floor(mTimeDiff / 60);
    const mPostTime = Math.floor(mTimeDiff % 60);
    return hPostTime > 0
      ? `${hPostTime}h ${mPostTime}min ago`
      : `${mPostTime}min ago`;
  };

  /* const likedCount = data.likedBy.length;
    const dislikedCount = data.dislikedBy.length;
    const sum = likedCount - dislikedCount; */

  postBox.innerHTML = `<div class="post_content_box">
                    <div class="post_top">
                        <div class="profile_pic_name">
                            <img src="images/profile.png">
                            <span id="profile_name">${user.name}</span>
                        </div>
                        <div class="post_time">${timeSincePost()}</div>
                    </div>
                    <div class="post_middle">
                        <p class="post_content">${DATA.content}</p>
                    </div>
                    <div class="post_bottom">
                        <div class="react_box">
                            <div class="like_button"> + </div>
                            <div class="dislike_button"> - </div>
                        </div>
                        <div class="reaction_counter_box">
                            <span class="total_count">${
                              DATA.likedBy.length - DATA.dislikedBy.length
                            }p </span>(<span class="positive">+${
    DATA.likedBy.length
  }</span>/<span class="negative">-${DATA.dislikedBy.length}</span>)
                        </div>
                    </div>
                <div>`;

  const like = postBox.querySelector(".like_button");
  const dislike = postBox.querySelector(".dislike_button");

  like.addEventListener("click", () => {
    const body = {
      token: localStorage.getItem("token"),
      id: DATA.id,
      like: "like",
    };

    PubSub.publish({
      event: "patchPostItem",
      details: { ent: "posts", body: body },
    });
  });

  dislike.addEventListener("click", () => {
    const body = {
      token: localStorage.getItem("token"),
      id: DATA.id,
      dislike: "dislike",
    };

    PubSub.publish({
      event: "patchPostItem",
      details: { ent: "posts", body: body },
    });
  });

  // The below code is trash but I cba anymore

  const inlineStyle =
    document.querySelector("#room_top").attributes.style.value;

  postBox.style = inlineStyle;
}

PubSub.subscribe({
  event: "renderPostBox",
  listener: (details) => {
    renderPostBox(details.chat, details.user);
  },
});

PubSub.subscribe({
  event: "renderPostLikedCounter",
  listener: (details) => {
    console.log(details);
    const totalScore = details.likedBy.length - details.dislikedBy.length;
    const post = document.querySelector("#post_" + details.id);
    const post_liked = post.querySelector(".reaction_counter_box > .positive");
    const post_disliked = post.querySelector(
      ".reaction_counter_box > .negative"
    );
    const post_sum = post.querySelector(".reaction_counter_box > .total_count");

    post_liked.innerHTML = "+" + details.likedBy.length;
    post_disliked.innerHTML = "-" + details.dislikedBy.length;
    post_sum.innerHTML = `${totalScore}p `;
    post.dataset.postScore = totalScore;
  },
});
