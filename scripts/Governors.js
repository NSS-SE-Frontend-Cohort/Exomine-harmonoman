export const GovernorsDropdown = async () => {
    const governors = await fetch("http://localhost:8088/governors").then(res => res.json());

    // Filter active governors from inactive
    const activeGovernors = governors.filter(gov => gov.status);
    
    // HTML for governor dropdown
    let html = `<select id="governor">`;
    html += `<option value="0">Select a governor</option> `;

    const governorsHTML = activeGovernors.map(governor => {
        return `<option value="${governor.id}">${governor.firstName} ${governor.lastName}</option>`;
    });

    html += governorsHTML + `</select>`;

    return html;
}