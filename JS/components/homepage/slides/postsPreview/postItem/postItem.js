import { PubSub } from "../../../../../logic/PubSub.js";
import { colorToHsl } from "../../../../../logic/helpFunctions.js";

function renderPostItem(parent, data) {
  const { post, genre } = data;
  const { content, time, score, id } = post;
  const postItem = document.createElement("li");
  parent.appendChild(postItem);
  postItem.id = `post_id_${id}`;

  const timeSincePost = function () {
    const sTimeDiff = Math.floor(Date.now() / 1000) - time;
    const mTimeDiff = sTimeDiff / 60;
    const hPostTime = Math.floor(mTimeDiff / 60);
    const mPostTime = Math.floor(mTimeDiff % 60);
    return hPostTime > 0
      ? `${hPostTime}h ${mPostTime}min ago`
      : `${mPostTime}min ago`;
  };

  postItem.innerHTML = `
    <p style="font-style: italic">${timeSincePost()}</p><p>${content}</p><p>${score}p</p>
`;

  if (postItem.offsetWidth >= 400) {
    postItem.style.width = `${postItem.offsetWidth - 300}px`;
  }

  PubSub.subscribe({
    event: "sendAlbumHexColor",
    listener: (cArr) => {
      const c = cArr[0];
      const accentColorHex = {
        type: "hex",
        value: c,
      };

      let { h, s, l } = colorToHsl(accentColorHex);

      s = Math.min(s, 80);
      l = Math.min(l, 80);

      if (l < 50) {
        postItem.style.color = "var(--paragraph_color_white)";
      }
      postItem.style.backgroundColor = `hsl(${h} ${s} ${l})`;
    },
  });
  PubSub.publish({ event: "getAlbumHexColor", details: genre });
  PubSub.unsubscribe("sendAlbumHexColor");
}

PubSub.subscribe({
  event: "renderPost",
  listener: (details) => {
    const { parent, data } = details;
    renderPostItem(parent, data);
  },
});
