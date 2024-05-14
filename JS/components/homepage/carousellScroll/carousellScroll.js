import { PubSub } from "../../../logic/PubSub.js";

function renderCarousellScroll(parent, data){
    const scrollBallsAmounts = 6;

    for(let i = 0; i < scrollBallsAmounts; i++){
        const scrollBall = document.createElement("div");

        if(i === 0){
            scrollBall.classList.add("current");
        }

        scrollBall.addEventListener("click", function onClickChangeSlide(event){
            const everyScrollBall = parent.querySelectorAll("div");
            
            everyScrollBall.forEach(ball => { ball.classList.remove("current"); });

            scrollBall.classList.add("current");

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