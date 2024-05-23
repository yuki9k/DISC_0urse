import { PubSub } from "../../logic/PubSub.js";
import * as carousellScroll from "./carousellScroll/carousellScroll.js";
import * as slide from "./slides/slide.js";
function renderHompageContainer(parent, data){
    parent.innerHTML = "";
    const homepageContainer = document.createElement("div");
    const slidesContainer = document.createElement("div");

    slidesContainer.id = "slides_container";
    slidesContainer.classList.add("transition");
    homepageContainer.id = "homepage_container";
    parent.appendChild(homepageContainer);
    homepageContainer.appendChild(slidesContainer);
    
    for(let i = 0; i < data.pubRooms.length; i++){
        let image;
        const posts = [];
        switch (data.pubRooms[i].genre) {
            case "Indie Pop":
                image = "../../../../../API/db/albumPics/indie_pop.jpeg";
                break;
            case "Indie Rock":
                image = "../../../../../API/db/albumPics/indie_rock.jpeg";
                break;
            case "Indie Singer-songwriter":
                image = "../../../../../API/db/albumPics/indie_singer-songwriter.jpeg";
                break;
            case "Indie Folk":
                image = "../../../../../API/db/albumPics/indie_folk.jpeg";
                break;
            case "Indie R&b":
                image = "../../../../../API/db/albumPics/indie_r&b.jpeg";
                break;
            case "Indie Post-punk":
                image = "../../../../../API/db/albumPics/indie_post-punk.jpeg";
                break;
            default:
                return;
        }
        for(const post of data.posts){
            if(post.roomID === data.pubRooms[i].id){
                posts.push(post);
            }
        }
        PubSub.publish({
            event: "renderSlide",
            details: {"parent": slidesContainer, posts, image}
        });

    }

   /*  for(let i = 0; i < dataBase.chats.length; i++){
        //NOTE: Should be removed later, only simpulation
        const chats = dataBase.chats;
        const image = dataBase.images[i];

        PubSub.publish({
            event: "renderSlide",
            details: {"parent": slidesContainer, chats, image}
        });
    } */

  const carousellScroll = document.createElement("div");
  carousellScroll.id = "carousell_scroll";
  homepageContainer.appendChild(carousellScroll);

  PubSub.publish({
    event: "renderCarouselScroll",
    details: carousellScroll,
  });
}

PubSub.subscribe({
    event:"renderHomepageInfoRecived",
    listener: (details) => {
        renderHompageContainer(details.parent, {
            users: details.users,
            genres: details.genres,
            pubRooms: details.pubRooms,
            posts: details.posts
        });
        PubSub.publish({ event: "userLoggedIn", details: null });
    }
})


const dataBase = {
  chats: [
    { content:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis et gravida turpis, aliquam vestibulum sem. Maecenas vitae nisi urna. Aenean consequat lobortis turpis, a dapibus lacus porta luctus." },
    { content:"Etiam pulvinar sit amet velit vitae faucibus. Nunc vel condimentum felis. Vestibulum sed laoreet risus." },
    { content:"Nullam ac tellus sit amet urna posuere volutpat non eu tellus. Donec ex justo, bibendum vitae tincidunt sit amet, dictum ut urna." },
    { content: "Morbi tincidunt dapibus enim." },
    { content: "Praesent tincidunt auctor libero et laoreet." },
    { content: "Fusce cursus velit in lectus lobortis gravida." },
  ],

  images: [
    { id: 1, src: "./api/db/albumPics/indie_pop.jpeg" },
    { id: 2, src: "./api/db/albumPics/indie_rock.jpeg" },
    { id: 3, src: "./api/db/albumPics/indie_singer-songwriter.jpeg"},
    { id: 4, src: "./api/db/albumPics/indie_folk.jpeg" },
    { id: 5, src: "./api/db/albumPics/indie_r&b.jpeg" },
    { id: 6, src: "./api/db/albumPics/indie_post-punk.jpeg" },
  ],
};

//pubsub när jag trycker på karusellen så ska scrollern publisha och de andra komponenterna ska subscriba.
