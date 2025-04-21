let inventoryHTML = "";

export const DisplayFacilityMinerals = () => inventoryHTML;

document.addEventListener("stateChanged", async () => {
    const inventories = await fetch("http://localhost:8088/facilityMinerals?_expand=facility&_expand=mineral").then(res => res.json());
    console.log("inventories: ", inventories)
})