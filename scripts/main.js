import { GovernorsDropdown } from "./Governors.js";

const container = document.querySelector("#container");

const render = async () => {

    const governors = GovernorsDropdown();

    const composedHTML = 
    `
        <h2>Solar System Mining Marketplace</h2>
        
    `;

    container.innerHTML = composedHTML;
}

render();