import {PubSub} from "../../../../logic/PubSub.js";

function renderAddPostButton(parent){
    parent.innerHTML = `<div id="add_post_button">
                            <div id="plus_sign">
                                <div id="vertical_line"></div>
                                <div id="horisontal_line"></div>
                            </div>
                            <textarea id="post_input"></textarea>
                            <div id="send_post"></div>
                        </div>`;

    const plusSign = parent.querySelector("#plus_sign");
    const addPostButton = parent.querySelector("#add_post_button");
    const input = parent.querySelector("#post_input");
    const sendPost = parent.querySelector("#send_post");

    addPostButton.addEventListener("click", () => {
        plusSign.classList.add("undisplay");
        addPostButton.classList.add("border_rad_change");
    });

    window.addEventListener("click", function onWindowClickCloseInput(event){
        if(event.target !== addPostButton && event.target !== input && event.target !== sendPost){
            addPostButton.classList.remove("border_rad_change");
            plusSign.classList.remove("undisplay");
        }  
    }, {ones: true});
 

    addPostButton.addEventListener("transitionend", () => {
        if(input.className === "display"){
            input.classList.remove("display");
            plusSign.classList.remove("display_none");
            sendPost.classList.remove("display");

            PubSub.publish({
                event: "moveFilterAddPostContainer",
                details: "remove"
            })
        }
        else{
            input.classList.add("display");
            plusSign.classList.add("display_none");
            sendPost.classList.add("display");

            PubSub.publish({
                event: "moveFilterAddPostContainer",
                details: "add"
            })
        }
    });

    sendPost.addEventListener("click", () => {

    });
}

PubSub.subscribe({
    event: "renderAddPostButton",
    listener: renderAddPostButton
})