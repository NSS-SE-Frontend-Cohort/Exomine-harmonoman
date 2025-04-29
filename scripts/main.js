import { GovernorsDropdown } from "./Governors.js";
import { DisplayColonyInventory } from "./ColonyInventories.js"
import { DisplayFacilities } from "./Facilities.js";
import { DisplayFacilityMinerals } from "./FacilityMinerals.js";
import { DisplaySpaceCart } from "./SpaceCart.js";

const container = document.querySelector("#container");

const render = async () => {

    const governors = await GovernorsDropdown(); 
    const colonyInventory = DisplayColonyInventory();
    const facilities = await DisplayFacilities();
    const facilityMinerals = DisplayFacilityMinerals();
    const spaceCart = DisplaySpaceCart();

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
        <div class="minerals-space_cart-container">
            ${facilityMinerals}
            ${spaceCart}
        </div>
    `;

    container.innerHTML = composedHTML;
}

render();

document.addEventListener("stateChanged", event => {
    render()
})

document.addEventListener("reRender", render);