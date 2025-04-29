import { getTransientState, setMineral } from "./TransientState.js";

let inventoryHTML = "";

export const DisplayFacilityMinerals = () => inventoryHTML;

const buildFacilityMineralsHTML = async () => {
    const state = getTransientState();
    const facilityId = state.selectedFacility;

    if(facilityId != 0) {
        const inventories = await fetch("http://localhost:8088/facilityMinerals?_expand=facility&_expand=mineral").then(res => res.json());
        const mineralsArray = inventories.filter(inv => inv.facilityId === facilityId);
        const allOutOfStock = mineralsArray.every(mineral => mineral.quantity === 0);

            if (mineralsArray.length > 0 && !allOutOfStock) {
                // Get facility status
                const facilityIsActive = mineralsArray[0].facility.status;
                
                // Check if facility is active
                if(facilityIsActive) {
                    // Facility is active
                    inventoryHTML = 
                        `<div class="mineralInventory">
                            <h2>Facility Minerals for ${mineralsArray[0].facility.name}</h2>
                        
                            ${mineralsArray.map(mineral => { 
                                if(mineral.quantity != 0) {
                                    const isChecked = state.selectedMineral === mineral.mineralId ? "checked" : "";  
                                    return `
                                        <div>
                                            <input type="radio" name="mineral" value="${mineral.mineralId}" ${isChecked} /> ${mineral.quantity} tons of ${mineral.mineral.name} 
                                        </div>`;
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
                    // Facility is inactive
                    inventoryHTML = `
                        <div class="mineralInventory">
                            <h2>Facility Minerals</h2>
                            <p>Facility is inactive</p>
                        </div>`;

                    document.dispatchEvent(new CustomEvent("reRender"));
                }
            } else {
                // No minerals at facility
                inventoryHTML = `
                    <div class="mineralInventory">
                        <h2>Facility Minerals</h2>
                        <p>No minerals available</p>
                    </div>`;

                document.dispatchEvent(new CustomEvent("reRender"));
            }
    } else {
        // No facility selected
        inventoryHTML = `
            <div class="mineralInventory">
                <h2>Facility Minerals</h2>
            </div>`;

        document.dispatchEvent(new CustomEvent("reRender"));
    }
}

buildFacilityMineralsHTML();

document.addEventListener("stateChanged", buildFacilityMineralsHTML);

document.addEventListener("change", (event) => {
    if(event.target.name === "mineral") {
        setMineral(parseInt(event.target.value));
    }
})