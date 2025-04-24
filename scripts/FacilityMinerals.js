import { getTransientState } from "./TransientState.js";

let inventoryHTML = "";

export const DisplayFacilityMinerals = () => inventoryHTML;

document.addEventListener("stateChanged", async () => {
    const state = getTransientState();
    const facilityId = state.selectedFacility;

    if(facilityId != 0) {
        const inventories = await fetch("http://localhost:8088/facilityMinerals?_expand=facility&_expand=mineral").then(res => res.json());

        const mineralsArray = inventories.filter(inv => inv.facilityId === facilityId);
        
        inventoryHTML = 
            `<div class="mineralInventory">
                <h2>Facility Minerals for ${mineralsArray[0].facility.name}</h2>
            
                ${mineralsArray.map(mineral => { 

                    if(mineral.quantity != 0) {
                        return `
                        <div>
                            <input type="radio" name="mineral" value="${mineral.id}" /> ${mineral.quantity} tons of ${mineral.mineral.name} 
                        </div>`
                    
                    } else {
                        return`
                        <div>
                            0 tons of ${mineral.mineral.name} 
                        </div>`
                    }}).join("")
                }
            
            </div>`;
            
        document.dispatchEvent(new CustomEvent("reRender"));

    } else {
        inventoryHTML = `
            <div class="mineralInventory">
                <h2>Facility Minerals</h2>
            </div>`;

        document.dispatchEvent(new CustomEvent("reRender"));
    }
})