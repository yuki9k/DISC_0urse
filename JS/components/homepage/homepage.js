function renderHompageContainer(parent){
    const homepageContainer = document.createElement("div");
    const slidesContainer = document.createElement("div");

    slidesContainer.id = "slides_container";
    slidesContainer.classList.add("transition");
    homepageContainer.id = "homepage_container";

    parent.appendChild(homepageContainer);
    homepageContainer.appendChild(slidesContainer);

    for(let i = 0; i < dataBase.chats.length; i++){
        //NOTE: Should be removed later, only simpulation
        const chats = dataBase.chats;
        const image = dataBase.images[i];

        renderSlide(slidesContainer, {chats, image});
    }

    const carousellScroll = document.createElement("div");
    carousellScroll.id = "carousell_scroll";
    homepageContainer.appendChild(carousellScroll);

    renderCarousellScroll(carousellScroll);
}


const dataBase = {
    "chats": [
        {
            "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis et gravida turpis, aliquam vestibulum sem. Maecenas vitae nisi urna. Aenean consequat lobortis turpis, a dapibus lacus porta luctus."
        },
        {
            "content": "Etiam pulvinar sit amet velit vitae faucibus. Nunc vel condimentum felis. Vestibulum sed laoreet risus."
        },
        {
            "content": "Morbi tincidunt dapibus enim."
        },
        {
            "content": "Nullam ac tellus sit amet urna posuere volutpat non eu tellus. Donec ex justo, bibendum vitae tincidunt sit amet, dictum ut urna."
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