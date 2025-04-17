import { GovernorsDropdown } from "./Governors.js";

const container = document.querySelector("#container");

const render = async () => {

    const governors = await GovernorsDropdown();

    const composedHTML = 
    `
        <h2>Solar System Mining Marketplace</h2>
        ${governors}
    `;

    container.innerHTML = composedHTML;
}

render();