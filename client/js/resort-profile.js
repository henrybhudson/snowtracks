/*

resort-profile.js
=================
This deals with various functionalities on the 'resort profile' page that shows all the details about a specific resort.

*/

import { getResortAndTracks, addTrack } from "./index.js";

// Global variable necessary to maintain full tracks list for searching
var resortTracks = [];

const displayResort = (resort) => {
        // Resort side info
        document.querySelector('.resort-title').textContent = resort.name;
        document.querySelector('.resort-country').textContent = resort.country;
        document.querySelector('.resort-airport').textContent = resort.airport;
        document.querySelector('.resort-description').textContent = resort.description;

        document.querySelector('#track-search').setAttribute('placeholder', `Search tracks in ${resort.name}...`);

        document.querySelector('.resort-image').setAttribute('src', resort.image);

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
const addTrackInputListener = () => {
        const trackInput = document.querySelector('#track-search');
        trackInput.addEventListener('input', () => {
                const matchedTracks = resortTracks.filter((track) => {
                        return track.name.toUpperCase().includes(trackInput.value.trim().toUpperCase());
                });
                document.querySelector('.tracks-list').innerHTML = "";
                displayTracks(matchedTracks);
        });
}

const addNewTrackListener = (resort) => {
        const confirmButton = document.querySelector('.confirm-track-btn');

        confirmButton.addEventListener('click', () => {
                const name = document.querySelector('#track-name-input').value.trim();
                const slope = document.querySelector('#difficulty-select').value;
                const piste = document.querySelector('#piste-select').value;
                const description = document.querySelector('#track-description-input').value.trim();
                const length_km = parseFloat(document.querySelector('#track-length-input').value);
                const time_mins = parseInt(document.querySelector('#track-time-input').value);
                var features = [];

                const SELECTED_FEATURES = document.querySelectorAll('.feature-selected');
                SELECTED_FEATURES.forEach((feature) => {
                        features.push(feature.getAttribute('value'));
                });

                const track = {
                        name,
                        slope,
                        piste,
                        description,
                        length_km,
                        time_mins,
                        features,
                        resort
                };

                addTrack(track);
                displayTracks([track]);

                // Push to resortTracks to add it to search domain
                resortTracks.push(track);
        });
};

const addFeatureEventListeners = () => {
        const FEATURE_BUTTONS = document.querySelectorAll('.feature');

        FEATURE_BUTTONS.forEach((button) => {
                button.addEventListener('click', () => {
                        button.classList.toggle('feature-selected');
                });
        });
};

getResortAndTracks().then((resort) => {
        if (resort) {
                resortTracks = resort.tracks;
                displayResort(resort);
                addTrackInputListener();
                addNewTrackListener(resort.id);
                addFeatureEventListeners();
        }
});