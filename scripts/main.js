import { GovernorsDropdown } from "./Governors.js";
import { DisplayColonyInventory } from "./ColonyInventories.js"

const container = document.querySelector("#container");

const render = async () => {

    const governors = await GovernorsDropdown(); 
    const colonyInventory = await DisplayColonyInventory();

    const composedHTML = 
    `
        <h2>Solar System Mining Marketplace</h2>
        ${governors}
        ${colonyInventory}
    `;

    container.innerHTML = composedHTML;
}

render();

document.addEventListener("stateChanged", event => {
    console.log("State of data has changed.  Regenerating HTML...")
    render()
})
document.addEventListener("reRender", render);