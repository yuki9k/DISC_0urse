import {PubSub} from "../../logic/PubSub.js";
import * as carousellScroll from "./carousellScroll/carousellScroll.js";
import * as slide from "./slides/slide.js";
function renderHompageContainer(parent, data){
    const homepageContainer = document.createElement("div");
    const slidesContainer = document.createElement("div");

    slidesContainer.id = "slides_container";
    slidesContainer.classList.add("transition");
    homepageContainer.id = "homepage_container";
    console.log(data.pubRooms);
    parent.appendChild(homepageContainer);
    homepageContainer.appendChild(slidesContainer);
    
    for(let i = 0; i < data.pubRooms.length; i++){
        console.log(data.pubRooms[i]);
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
        details: carousellScroll
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
    }
})


const dataBase = {
    "chats": [
        {
            "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis et gravida turpis, aliquam vestibulum sem. Maecenas vitae nisi urna. Aenean consequat lobortis turpis, a dapibus lacus porta luctus."
        },
        {
            "content": "Etiam pulvinar sit amet velit vitae faucibus. Nunc vel condimentum felis. Vestibulum sed laoreet risus."
        },
        {
            "content": "Nullam ac tellus sit amet urna posuere volutpat non eu tellus. Donec ex justo, bibendum vitae tincidunt sit amet, dictum ut urna."
        },
        {
            "content": "Morbi tincidunt dapibus enim."
        },
        {
            "content": "Praesent tincidunt auctor libero et laoreet."
        },
        {
            "content": "Fusce cursus velit in lectus lobortis gravida."
        },
        

    ],

    "images": [
        {
            "id": 10,
            "src": "https://downloads.pearljam.com/img/album-art/0223194507ten.jpg"
        },
        {
            "id": 5,
            "src": "https://upload.wikimedia.org/wikipedia/en/3/3a/Superunknown.jpg"
        },
        {
            "id": 8,
            "src": "https://i1.sndcdn.com/artworks-645OpIviTrQ4-0-t500x500.jpg"
        },
        {
            "id": 2,
            "src": "https://upload.wikimedia.org/wikipedia/en/b/b1/Fleetwood_Mac_-_Fleetwood_Mac_%281975%29.png"
        },
        {
            "id": 6,
            "src": "https://upload.wikimedia.org/wikipedia/en/2/27/IllmaticNas.jpg"
        },
        {
            "id": 9,
            "src": "https://upload.wikimedia.org/wikipedia/en/6/64/SystemofaDownToxicityalbumcover.jpg"
        },

    ]
}




//pubsub när jag trycker på karusellen så ska scrollern publisha och de andra komponenterna ska subscriba.