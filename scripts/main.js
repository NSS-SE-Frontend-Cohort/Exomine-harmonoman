import { GovernorsDropdown } from "./Governors.js";
import { DisplayColonyInventory } from "./ColonyInventories.js"
import { DisplayFacilities } from "./Facilities.js";

const container = document.querySelector("#container");

const render = async () => {

    const governors = await GovernorsDropdown(); 
    const colonyInventory = DisplayColonyInventory();
    const facilities = await DisplayFacilities();

    const composedHTML = 
    `
        <h2>Solar System Mining Marketplace</h2>
        <div class="governor-colony-container">
            ${governors}
            ${colonyInventory}
        </div>
        <div class="facilities-container">
            ${facilities}
        </div>
    `;

    container.innerHTML = composedHTML;
}

render();

document.addEventListener("stateChanged", event => {
    console.log("State of data has changed.  Regenerating HTML...")
    render()
})
document.addEventListener("reRender", render);