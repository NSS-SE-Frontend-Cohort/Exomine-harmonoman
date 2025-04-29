const state = {
    selectedGovernor: 0,
    selectedFacility: 0,
    selectedMineral: 0 
}

export const setGovernor = (governorId) => {
    state.selectedGovernor = governorId;
    state.selectedFacility = 0;
    state.selectedMineral = 0; 
    document.dispatchEvent(new CustomEvent("stateChanged"));
}

export const setFacility = (facilityId) => {
    state.selectedFacility = facilityId;
    state.selectedMineral = 0; 
    document.dispatchEvent(new CustomEvent("stateChanged"));
}

export const setMineral = (mineralId) => {
    state.selectedMineral = mineralId;
    document.dispatchEvent(new CustomEvent("stateChanged"));
}

export const getTransientState = () => {
    return structuredClone(state);
}

export const purchaseMineral = async () => {
  
    // Get selected attributes
    const state = getTransientState();
    const { selectedGovernor, selectedFacility, selectedMineral } = state;

    // Get Governors and Colonies
    const governors = await fetch("http://localhost:8088/governors").then(res => res.json());
    const governor = governors.find(gov => gov.id === selectedGovernor);

    // Get Colony Inventory
    const colonyInventories = await fetch("http://localhost:8088/colonyInventories?_expand=mineral").then(res => res.json());
    const colonyInventory = colonyInventories.filter(col => col.colonyId === governor.colonyId);
    const colonyMineral = colonyInventory.find(inv => inv.mineralId === selectedMineral);

    // Get Facility and Mineral
    const facilityMinerals = await fetch("http://localhost:8088/facilityMinerals").then(res => res.json());
    const facilityInventory = facilityMinerals.filter(fac => fac.facilityId === selectedFacility);
    const facilityMineral = facilityInventory.find(fac => fac.mineralId === selectedMineral);
    const facilityQuantity = facilityMineral.quantity;

    // Helper function to update Facility Inventory
    const updateFacility = async (newQuantity) => {
        await fetch(`http://localhost:8088/facilityMinerals/${facilityMineral.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: facilityMineral.id,
                facilityId: selectedFacility,
                mineralId: selectedMineral,
                quantity: newQuantity
            })
        })
    } 

    if(facilityMineral && facilityQuantity > 0) {
        // If colonyMineral is true
        if (colonyMineral) {
            // If mineral is in Colony Inventory

            // PUT an update to the facility mineral count (-1)
            await fetch(`http://localhost:8088/colonyInventories/${colonyMineral.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: colonyMineral.id,
                    colonyId: colonyMineral.colonyId,
                    mineralId: selectedMineral,
                    quantity: colonyMineral.quantity + 1
                })
            })

        } else {
            // If mineral is NOT in Colony Inventory

            // POST a new mineral to colonyInventory
            const postDetails = {
                "colonyId": governor.colonyId,
                "mineralId": selectedMineral,
                "quantity": 1
            }

            const postPurchase = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(postDetails)
            }

            await fetch("http://localhost:8088/colonyInventories", postPurchase);
        }   
        
        // PUT an update to the facility mineral count (-1)
        await updateFacility(facilityQuantity -1);
        
        document.dispatchEvent(new CustomEvent("stateChanged"))
    }
}
