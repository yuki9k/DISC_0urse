function renderPostItem(parent, data){
    const postItem = document.createElement("li");
    parent.appendChild(postItem);
    postItem.id = "post_id_";
    postItem.innerHTML = data;

    if(postItem.offsetWidth >= 400){
        postItem.style.width = "200px";
    }
}

