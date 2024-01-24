/*

resorts.js
==========
Deals with various functionalities on the main resorts page.

*/

import { getResorts } from "./index.js";

// Display the resorts on the page
const displayResorts = (resorts) => {
        // Firstly clear the contents of the table
        const RESORTS_TABLE = document.querySelector('.resorts-table');
        RESORTS_TABLE.innerHTML = "";

        // For each resort, create and append an HTML element
        resorts.forEach((resort) => {
                const element = document.createElement('div');
                element.className = "resort-card";
                element.style.backgroundImage = `url(${resort.image})`;
                element.innerHTML = `
                <div class="resort-card-screen" id="${resort.id}" onclick="document.location.href='/resort/?id=${resort.id}';">
                        <div class="resort-title">${resort.name}</div>
                        <div class="resort-tags">
                                <i class="fa fa-location-pin"></i>&nbsp;&nbsp;${resort.country}
                                <div class="tag-break"></div>
                                <i class="fa fa-plane"></i>&nbsp;&nbsp;${resort.airport}
                        </div>
                </div>
                `;

                RESORTS_TABLE.appendChild(element);
        });

}

// Get the resorts and then display them
getResorts().then((resorts) => {
        if (resorts) {
                displayResorts(resorts);
        }
});