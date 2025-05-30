import { getTransientState } from "./TransientState.js";

let inventoryHTML = "";

export const DisplayColonyInventory = () => inventoryHTML;

document.addEventListener("stateChanged", async () => {
    const state = getTransientState();
    const governorId = state.selectedGovernor;

    if (governorId != 0) {
        const governors = await fetch("http://localhost:8088/governors?_expand=colony").then(res => res.json());
        const inventories = await fetch("http://localhost:8088/colonyInventories?_expand=colony&_expand=mineral").then(res => res.json());

        const selectedGovernor = governors.find(gov => gov.id === governorId);

        if (selectedGovernor) {
            const colonyId = selectedGovernor.colonyId
            const colonyInventory = inventories.filter(inv => inv.colonyId === colonyId);

            inventoryHTML = `
                <div class="colonyInventory">
                    <h2>${selectedGovernor.colony.name} Inventory</h2>
                    
                    ${colonyInventory.map(inv => `<div>${inv.quantity} tons of ${inv.mineral.name}</div>`).join("")}
                    
                </div>`

            document.dispatchEvent(new CustomEvent("reRender"));
        } 
    } else {
        inventoryHTML = "";
        document.dispatchEvent(new CustomEvent("reRender"));
    }
})