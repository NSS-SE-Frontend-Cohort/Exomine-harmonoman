import { getTransientState, setGovernor } from "./TransientState.js";

export const GovernorsDropdown = async () => {
    const governors = await fetch("http://localhost:8088/governors").then(res => res.json());
    // const inventories = await fetch("http://localhost:8088/colonyInventories?_expand=colony&_expand=mineral").then(res => res.json());
    // console.log("inventories: ", inventories);

    // Filter active governors from inactive
    const activeGovernors = governors.filter(gov => gov.status);
    const state = getTransientState();
    
    // HTML for governor dropdown
    let html = `<div style="display: flex; align-items: center; gap: 0.5rem;">
                    <label for="governor">Select a governor:</label>
                    <select id="governor">
                        <option value="0">Select a governor</option> 
                        
                        ${activeGovernors.map(governor => {
                            const selected = governor.id === state.selectedGovernor ? "selected" : "";
                            return `<option value="${governor.id}" ${selected}>${governor.firstName} ${governor.lastName}</option>`;
                        }).join("")};
                    </select>
                </div>`


    return html;
}

// Governor dropdown event Listener
document.addEventListener("change", (event) => {
    if(event.target.id === "governor") {
        const selectedOption = parseInt(event.target.value);
    
        // Set transient state
        setGovernor(selectedOption);
    }
})