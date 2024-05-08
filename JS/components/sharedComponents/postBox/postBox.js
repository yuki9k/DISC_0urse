function renderPostBox(parent, data){
    const postBox = document.createElement("li");
    parent.appendChild(postBox);

    postBox.innerHTML = `<div class="post_content_box">
                            <div class="post_top">
                                <div class="profile_pic_name">
                                    <img src="">
                                    <span id="profile_name"></span>
                                </div>
                                <div class="post_time"> </div>
                            </div>
                            <div class="post_middle">
                                <p id="post_content"></p>
                            </div>
                            <div class="post_bottom">
                                <div class="react_box">
                                    <div class="positive"> + </div>
                                    <div class="negative"> - </div>
                                </div>
                                <div class="reaction_counter_box">
                                    <span class="total_count"></span>
                                    <span class="positive_count"></span>
                                    <span class="negative_count"></span>
                                </div>
                            </div>
                        <div>`;
}