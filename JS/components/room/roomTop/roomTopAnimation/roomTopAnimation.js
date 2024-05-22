import { PubSub } from "../../../../logic/PubSub.js";
import * as roomTop from "../roomTop.js";
import * as room from "../../room.js";


PubSub.subscribe({
    event: "initiateAnimation",
    listener: () => {

        window.addEventListener("scroll", (event) => {

            const htmlDomScroll = document.documentElement.scrollTop;
            const bodyDomScroll = document.body.scrollTop;

            if (bodyDomScroll > 80 || htmlDomScroll > 80) {
                PubSub.publish({
                    event: "addRoomTopAnimation",
                    details: "add"
                });

                PubSub.publish({
                    event: "roomHeight",
                    details: "200px" 
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

