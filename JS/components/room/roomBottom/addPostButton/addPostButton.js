function renderAddPostButton(parent){
    parent.innerHTML = `<div id="add_post_button">
                            <span id="plus_sign">+</span>
                            <textarea id="post_input"></textarea>
                        </div>`;

    const plusSign = parent.querySelector("#plus_sign");
    const addPostButton = parent.querySelector("#add_post_button");
    const input = parent.querySelector("#post_input");

    addPostButton.addEventListener("click", (event) => {
        plusSign.classList.add("undisplay");
        addPostButton.classList.add("border_rad_change");

        //width increase transtion and stuff
        addPostButton.addEventListener("transitionend", (event) => {
            input.classList.toggle("display");
            plusSign.classList.toggle("display_none");
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