// Deals with JavaScript on the singular resorts profile pages

import { getResortAndTracks } from "./index.js";

const displayResort = (resort) => {
        // Resort side info
        document.querySelector('.resort-title').textContent = resort.name;
        document.querySelector('.resort-country').textContent = resort.country;
        document.querySelector('.resort-airport').textContent = resort.airport;
        document.querySelector('.resort-description').textContent = resort.description;

        const resortImage = resort.name.replaceAll(' ', '-');
        document.querySelector('.resort-image').setAttribute('src', `../assets/resorts/${resortImage}.png`)

        // Load tracks
        const tracks = resort.tracks;
        displayTracks(tracks);

        // Intialise the tooltips that have been added
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl)
        })
};

const displayTracks = (tracks) => {
        document.querySelector('.tracks-list').innerHTML = "";
        tracks.forEach((track) => {
                // First get the HTML for the feature tags
                var trackFeaturesHTML = "";
                const features = track.features;

                // Add feature tags for the track
                features.forEach((feature) => {
                        var featureIcon = "";

                        // Select the FontAwesome icon to use
                        switch (feature) {
                                case "Snow Park":
                                        featureIcon += "person-snowboarding";
                                        break;
                                case "Refreshments":
                                        featureIcon += "utensils";
                                        break;
                                case "Multiple Routes":
                                        featureIcon += "arrows-split-up-and-left";
                                        break;
                                case "Slalom":
                                        featureIcon += "flag-checkered";
                                        break;
                        };
                        // Create the HTML
                        trackFeaturesHTML += `
                        <i data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="${feature}" data-bs-custom-class="tooltip" class="fa fa-${featureIcon}"></i>
                        <div class="tag-break"></div>`;
                });

                // Then create the full track block
                const element = document.createElement('div');
                element.className = 'track';

                // Create the HTML
                element.innerHTML = `
                <div class="track-text">
                        <div class="track-title">${track.name}</div>
                        <div class="track-description">${track.description}</div>
                </div>
                <div class="track-info ${track.slope.toLowerCase()}">
                        <div class="track-info-top">
                                <div class="piste-type">${track.piste}</div>
                                <div class="slope-type">${track.slope}</div>
                        </div>
                        <div class="track-info-mid">
                                <i class="fa fa-ruler"></i>&nbsp;&nbsp;${track.length_km} km
                                <div class="tag-break"></div>
                                <i class="fa fa-clock"></i>&nbsp;&nbsp;${track.time_mins} mins
                        </div>
                        <div class="track-info-bottom">
                                ${trackFeaturesHTML}
                        </div>
                </div>`;

                // Add to the tracks list element
                document.querySelector('.tracks-list').appendChild(element);
        });
};

// Add event listener to the track search input
const addTrackInputListener = (tracks) => {
        const trackInput = document.querySelector('#track-search');
        trackInput.addEventListener('input', () => {
                const matchedTracks = tracks.filter((track) => {
                        return track.name.toUpperCase().includes(trackInput.value.trim().toUpperCase());
                });
                displayTracks(matchedTracks);
        });
}


getResortAndTracks().then((resort) => {
        if (resort) {
                displayResort(resort);
                addTrackInputListener(resort.tracks);
        }
});