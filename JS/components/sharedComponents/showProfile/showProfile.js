function renderShowProfile() {
  const modalContainer = document.createElement("div");
  modalContainer.classList.add("modal_profile_container");
  modalContainer.innerHTML = `
    <div class="modal_profile_content">  
        <div class="upper_section">
            <div class="profile_info">
                <p class="username">Name Here</p>
                <p class="status">Status Here</p>
            </div>
            <div class="profile_picture"></div>
        </div>
        <div class="middle_section">
            <p class="middle_section_left">Posts</p>
            <p class="middle_section_right">Points here</p>
        </div>
        <div class="bottom_section">
            <div class="post_container">
                <div class="upper">
                    <p class="post_container_genre">Genre here</p>
                    <p class="post_container_timestamp">seconds ago</p>
                </div>
                <p class="post_container_text">Text here</p>
                <p class="post_container_points">Points here</p>
            </div>
        </div>
    </div>
  `;

  let wrapper = document.querySelector("#wrapper");
  wrapper.appendChild(modalContainer);

  // Prevent scrolling of the underlying content while modal is open
  document.body.style.overflow = "hidden";

  // Function to handle closing the modal when clicking outside the form
  const handleCloseModal = () => {
    modalContainer.remove();
    document.body.style.overflow = "";
  };

  // Add event listener to close modal when clicking outside the form
  modalContainer.addEventListener("click", (event) => {
    if (event.target === modalContainer) {
      handleCloseModal();
    }
  });
}
