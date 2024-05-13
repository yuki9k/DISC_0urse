import {PubSub} from "../../../../logic/PubSub.js";

function renderAddPostButton(parent){
    parent.innerHTML = `<div id="add_post_button">
                            <span id="plus_sign">+</span>
                            <textarea id="post_input"></textarea>
                        </div>`;

    const plusSign = parent.querySelector("#plus_sign");
    const addPostButton = parent.querySelector("#add_post_button");
    const input = parent.querySelector("#post_input");

    addPostButton.addEventListener("click", () => {
        plusSign.classList.add("undisplay");
        addPostButton.classList.add("border_rad_change");

        //width increase transtion and stuff
        addPostButton.addEventListener("transitionend", () => {
            if(input.className === "display"){
                input.classList.remove("display");
                plusSign.classList.remove("display_none");
            }
            else{
                input.classList.add("display");
                plusSign.classList.add("display_none");
            }
        });

        window.addEventListener("click", function onWindowClickCloseInput(event){
            if(event.target !== addPostButton && event.target !== input){
                input.classList.remove("display");
                plusSign.classList.remove("display_none");

                plusSign.classList.remove("undisplay");
                addPostButton.classList.remove("border_rad_change");
            
            } 
        });     
    });



/*     window.addEventListener("click", (event) => {
        event.stopPropagation();

        input.classList.remove("display");
        plusSign.classList.remove("display_none");

           input.addEventListener("transitionend", (event) => {
            addPostButton.classList.remove("border_rad_less");
            plusSign.classList.remove("undisplay");
        })
    }); */
}

PubSub.subscribe({
    event: "renderAddPostButton",
    listener: renderAddPostButton
})