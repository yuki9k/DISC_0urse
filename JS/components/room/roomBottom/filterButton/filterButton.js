import {PubSub} from "../../../../logic/PubSub.js";

function renderFilterButton(parent){
    parent.innerHTML = `<select id="filter_input">
                            <option>Latest</option>
                            <option>Most likes</option>
                            <option>OLdest</option> 
                        </select>
    `;
}

PubSub.subscribe({
    event: "renderFilterButton",
    listener: renderFilterButton
});

