import { PubSub } from "../../../../logic/PubSub.js";

PubSub.subscribe({
    event: "initiateHeightToTopAnimation",
    listener: (orgHeight) => {

        window.addEventListener("scroll", (event) => {

            const htmlDomScroll = document.documentElement.scrollTop;
            const bodyDomScroll = document.body.scrollTop;

            if (bodyDomScroll > 60 || htmlDomScroll > 60) {
                PubSub.publish({
                    event: "addRoomTopAnimation",
                    details: "add"
                });
            }
            else{
                PubSub.publish({
                    event: "addRoomTopAnimation",
                    details: "remove"
                });
            }
        });
    }
})

