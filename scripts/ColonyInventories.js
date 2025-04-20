import { getTransientState } from "./TransientState.js";

let inventoryHTML = "";

export const DisplayColonyInventory = () => inventoryHTML;


document.addEventListener("stateChanged", async () => {
    const state = getTransientState();
    const governorId = state.selectedGovernor

    if (governorId != 0) {
        const governors = await fetch("http://localhost:8088/governors?_expand=colony").then(res => res.json());
        console.log("governors: ", governors)

        const inventories = await fetch("http://localhost:8088/colonyInventories?_expand=colony&_expand=mineral").then(res => res.json());
        console.log("inventories: ", inventories)  
    }
})