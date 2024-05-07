function renderRoomBottom(parent, data){
    parent.innerHtml = `<ul id="posts_container"></ul>
                        <div id="filter_add_post_container">
                            <div id="filter_posts"></div>
                            <div id="add_posts"></div>
                        </div>`;

    const posts_container = parent.querySelector("#posts_container");
    const filter_posts = parent.querySelector("#filter_posts");
    const add_posts = parent.querySelector("#add_posts");
}