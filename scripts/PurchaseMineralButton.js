import { purchaseMineral } from "./TransientState.js";


export const handlePurchaseMineralClick = async (clickEvent) => {
    if(clickEvent.target.id === "purchase") {
        await purchaseMineral();
    }
}

export const PurchaseMineralButton = (isDisabled = false) => {
    document.addEventListener("click", handlePurchaseMineralClick);
    return `<button id="purchase" ${isDisabled ? "disabled" : ""}>Purchase Mineral</button>`;
}