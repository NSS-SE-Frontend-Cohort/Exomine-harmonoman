import { PurchaseMineralButton } from "./PurchaseMineralButton.js";
import { getTransientState } from "./TransientState.js";

let spaceCartHTML = "";

export const DisplaySpaceCart = () => spaceCartHTML;

const buildSpaceCartHTML = async () => {
    
    const state = getTransientState();
    const mineralId = state.selectedMineral;

    const minerals = await fetch("http://localhost:8088/facilityMinerals?_expand=mineral&_expand=facility").then(res => res.json());    

    const mineral = minerals.find(min => min.mineralId === mineralId);

    if (mineral) {
        if (mineral.facility.status && mineral.quantity > 0) {
            // Button is active if facility is active
            spaceCartHTML = `
                <div class="spaceCart">
                    <h2>Space Cart</h2>
                    <p>1 ton of ${mineral.mineral.name}</p>
                    ${PurchaseMineralButton(false)}
                </div>
            `;
        } else {
            // Button is inactive if facility is inactive
            spaceCartHTML = `
                <div class="spaceCart">
                    <h2>Space Cart</h2>
                    ${PurchaseMineralButton(true)}
                </div>
            `;
        }
    } else {
        // Button is inactive
        spaceCartHTML = `
            <div class="spaceCart">
                <h2>Space Cart</h2>
                ${PurchaseMineralButton(true)}
            </div>
        `;
    }
    document.dispatchEvent(new CustomEvent("reRender"));
};

buildSpaceCartHTML();

document.addEventListener("stateChanged", buildSpaceCartHTML)
