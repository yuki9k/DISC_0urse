// import { PubSub } from "../../../../logic/PubSub.js";

// window.addEventListener("load", (event) => {
//     const roomContainer = document.querySelector("#room_container");
//     const orgHeight = roomContainer.offsetHeight;

//     window.addEventListener("scroll", (event) => {

//         const htmlDomScroll = document.documentElement.scrollTop;
//         const bodyDomScroll = document.body.scrollTop;

//         const roomContainer = document.querySelector("#room_container");
//         const roomTop = document.querySelector("#room_top");
//         const albumContainer = document.querySelector("#album_container");
//         const albumTracks = document.querySelector("#album_tracks_container");


//         if (bodyDomScroll > 80 || htmlDomScroll > 80) {
//             roomTop.classList.add("makeSmall");
//             albumContainer.classList.add("makeSmall");
//             albumTracks.classList.add("display_none");

//             roomContainer.style.height =  orgHeight + "px";

//         }
//         else{
//             roomTop.classList.remove("makeSmall");
//             albumContainer.classList.remove("makeSmall");
//             albumTracks.classList.remove("display_none");
//         }
//     });
// });



