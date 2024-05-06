function renderCarousellScroll(parent, data){
    const scrollBallsAmounts = 6;

    for(let i = 0; i < scrollBallsAmounts; i++){
        const scrollBall = document.createElement("div");
        scrollBall.addEventListener("click", function onClickChangeSlide(event){
            
            //Should be done with pubsub
            
            const slides_container = document.querySelector("#slides_container");
            slides_container.style.transform = `translate(-${ i * (100/6)}%)`;

/*             if(i === 5){
                makeCarousellWrapAround();
                slides_container.classList.add("transition");
            } */
        });
        
        scrollBall.id = `scroll_ball_${i + 1}`;
        parent.appendChild(scrollBall);
    }
}


/* function makeCarousellWrapAround(){
    const newSlidesArray = [];
    const slides = document.querySelectorAll("#slides_container > div");

    for(let i = slides.length - 1; i >= 0; i--){
        newSlidesArray.push(slides[i]);
    }

    const slides_container = document.querySelector("#slides_container");

    slides_container.classList.remove("transition");
    slides_container.innerHTML = "";

    newSlidesArray.forEach(slide => { slides_container.appendChild(slide) });
}  */