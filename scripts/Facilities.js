import { getTransientState } from "./TransientState.js";

export const DisplayFacilities = async () => {
    const facilities = await fetch("http://localhost:8088/facilities").then(res => res.json());

    const governors = await fetch("http://localhost:8088/governors").then(res => res.json());
    
    const state = getTransientState();

    // Find selected governor
    const selectedGovernor = governors.find(gov => gov.id === state.selectedGovernor);

    // Should facilities dropdown be enabled?
    const isDisabled = !selectedGovernor || !selectedGovernor.status;

    // HTML for facilities dropdown
    let html = `<div style="display: flex; align-items: center; gap: 0.5rem;">
                    <label for="facility">Select a facility:</label>
                    <select id="facility" ${isDisabled ? "disabled" : ""}>
                        <option value="0">Select a facility</option>

                        ${facilities.map(facility => {
                            const selected = facility.id === state.selectedFacility ? "selected" : "";
                            return `<option value="${facility.id}" ${selected}>${facility.name}</option>`
                        }).join("")}
                    </select>
                </div>`;

    return html;
}