// Deals with JavaScript on the main resorts page

import { getResorts } from "./index.js";

const displayResorts = (resorts) => {
        // Firstly clear the contents of the table
        const RESORTS_TABLE = document.querySelector('.resorts-table');
        RESORTS_TABLE.innerHTML = "";

        resorts.forEach((resort) => {
                const element = document.createElement('div');
                const imageName = resort.name.replaceAll(' ', '-');
                console.log(imageName)
                element.className = "resort-card";
                element.style.backgroundImage = `url(../assets/resorts/${imageName}.png)`;
                element.innerHTML = `
                <div class="resort-card-screen" id="${resort.id}">
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

getResorts().then((resorts) => {
        if (resorts) {
                displayResorts(resorts);
        }
});