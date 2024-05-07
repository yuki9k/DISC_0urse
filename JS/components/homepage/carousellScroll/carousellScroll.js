import { PubSub } from "../../../logic/PubSub.js";

function renderCarousellScroll(parent, data){
    const scrollBallsAmounts = 6;

    for(let i = 0; i < scrollBallsAmounts; i++){
        const scrollBall = document.createElement("div");
        scrollBall.addEventListener("click", function onClickChangeSlide(event){
            
            PubSub.publish({
                event: "changeSlide",
                details: i
            });
        });
        
        scrollBall.id = `scroll_ball_${i + 1}`;
        parent.appendChild(scrollBall);
    }
}

PubSub.subscribe({
    event: "renderCarouselScroll",
    listener: renderCarousellScroll
});