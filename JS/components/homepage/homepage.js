import { PubSub } from "../../logic/PubSub.js";
import * as carousellScroll from "./carousellScroll/carousellScroll.js";
import * as slide from "./slides/slide.js";
function renderHompageContainer(parent, data) {
  parent.innerHTML = "";
  const homepageContainer = document.createElement("div");
  const slidesContainer = document.createElement("div");

  slidesContainer.id = "slides_container";
  slidesContainer.classList.add("transition");
  homepageContainer.id = "homepage_container";
  parent.appendChild(homepageContainer);
  homepageContainer.appendChild(slidesContainer);
  const { posts: allPosts } = data;

  for (let i = 0; i < data.pubRooms.length; i++) {
    let image;

    switch (data.pubRooms[i].genre) {
      case "Indie Pop":
        image = "api/db/albumPics/indie_pop.jpeg";
        break;
      case "Indie Rock":
        image = "api/db/albumPics/indie_rock.jpeg";
        break;
      case "Indie Singer-songwriter":
        image = "api/db/albumPics/indie_singer-songwriter.jpeg";
        break;
      case "Indie Folk":
        image = "api/db/albumPics/indie_folk.jpeg";
        break;
      case "Indie R&b":
        image = "api/db/albumPics/indie_r&b.jpeg";
        break;
      case "Indie Post-punk":
        image = "api/db/albumPics/indie_post-punk.jpeg";
        break;
      default:
        return;
    }

    const albumPosts = [];
    for (const post of allPosts) {
      if (i + 1 === post.roomID) {
        post.score = post.likedBy.length - post.dislikedBy.length;
        albumPosts.push(post);
      }
    }

    const topSixPosts = albumPosts
      .toSorted((a, b) => b.score - a.score)
      .splice(0, 6);

    PubSub.publish({
      event: "renderSlide",
      details: {
        parent: slidesContainer,
        posts: topSixPosts,
        image,
        genre: data.pubRooms[i].genre,
        title: data.genres[data.pubRooms[i].genre].albumName,
      },
    });
  }

  const carousellScroll = document.createElement("div");
  carousellScroll.id = "carousell_scroll";
  homepageContainer.appendChild(carousellScroll);

  PubSub.publish({
    event: "renderCarouselScroll",
    details: carousellScroll,
  });
}

PubSub.subscribe({
  event: "renderHomepageInfoRecived",
  listener: (details) => {
    renderHompageContainer(details.parent, {
      users: details.users,
      genres: details.genres,
      pubRooms: details.pubRooms,
      posts: details.posts,
    });
    PubSub.publish({ event: "userLoggedIn", details: null });
  },
});

//pubsub när jag trycker på karusellen så ska scrollern publisha och de andra komponenterna ska subscriba.
