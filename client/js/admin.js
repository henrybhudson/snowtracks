/*

admin.js
========
This deals with various functionalities on the 'new resort' ('admin') page.

*/

import AppAlert from './app-alert.js';
import { addResort } from './index.js'

// Global variable required to hold added tracks
var newTracks = [];

// Function to take track data and add it to the list of new tracks
const addTrack = (track) => {
        const TRACKS_LIST = document.querySelector('.new-tracks-list');

        console.log(TRACKS_LIST.childNodes.length);
        if (TRACKS_LIST.childNodes.length == 3) {
                // We have no previously added tracks, so now remove 'No tracks added' text.
                TRACKS_LIST.innerHTML = '';
        }

        // Create the HTML element
        const element = document.createElement('div');
        element.className = `new-track new-track-${track.slope.toLowerCase()}`;

        element.innerHTML = `
        <div class="new-track-title">${track.name}</div>
        <div class="new-track-tags">
                <div class="tag slope-tag ${track.slope.toLowerCase()}">${track.slope}</div>
                <div class="tag piste-tag">${track.piste}</div>
        </div>
        <div class="new-track-content">
                <div class="label">Description</div>
                ${track.description}
                <div class="label">Measures</div>
                Distance: ${track.length_km} km, Time: ${track.time_mins} mins
                <div class="label">Features</div>
                ${track.features.join(', ')}
        </div>
        `;

        // Add the element to the list of tracks on the page
        TRACKS_LIST.appendChild(element);
};

// Creates an event listener the 'Add Track' button
const addNewTrackListener = () => {
        const ADD_BTN = document.querySelector('.confirm-track-btn');

        // Create the event listener for the button
        ADD_BTN.addEventListener('click', () => {
                // Get all the data from the form
                const name = document.querySelector('#track-name-input').value.trim();
                const slope = document.querySelector('#difficulty-select').value;
                const piste = document.querySelector('#piste-select').value;
                const description = document.querySelector('#track-description-input').value.trim();
                const length_km = parseFloat(document.querySelector('#track-length-input').value);
                const time_mins = parseInt(document.querySelector('#track-time-input').value);
                var features = [];

                // For each feature selected, at it to the features array
                const SELECTED_FEATURES = document.querySelectorAll('.feature-selected');
                SELECTED_FEATURES.forEach((feature) => {
                        features.push(feature.getAttribute('value'));
                })

                // Create the track object
                const newTrack = {
                        name,
                        slope,
                        piste,
                        description,
                        length_km,
                        time_mins,
                        features
                }

                addTrack(newTrack);
                newTracks.push(newTrack);
        });
}

// Converts an image to a base 64 string
const imageToURL = (image) => {
        var reader = new FileReader();

        return new Promise((resolve, reject) => {
                reader.onload = () => {
                        resolve(reader.result);
                };
                reader.readAsDataURL(image);
        });
}

// Calls imageToURL and returns the result
const handleImageUpload = async (image) => {
        const imageContents = await imageToURL(image);
        return imageContents;
}

// Add an event listener to the 'Add Resort' button
const addNewResortListener = () => {
        const ADD_RESORT_BTN = document.querySelector('.confirm-resort-btn');

        // Add the event listener
        ADD_RESORT_BTN.addEventListener('click', async () => {
                // Get data from the form
                const name = document.querySelector('#resort-name').value;
                const country = document.querySelector('#resort-country').value;
                const airport = document.querySelector('#resort-airport').value;
                const description = document.querySelector('#resort-description').value;
                const image = document.querySelector('#resort-image').files[0];

                const imageCode = await handleImageUpload(image);

                // Create the resort object
                const newResort = {
                        name,
                        country,
                        airport,
                        description,
                        tracks: newTracks,
                        image: imageCode
                }

                // Try adding the resort
                addResort(newResort).then((success) => {
                        if (success) {
                                AppAlert('success', "Resort successfully added.")
                        } else {
                                AppAlert('error', 'Resort could not be added.')
                        }
                });
        });
};

// Adds the live search functionality for the added tracks
const addTrackInputListener = () => {
        const trackInput = document.querySelector('#track-search');
        const TRACKS_LIST = document.querySelector('.new-tracks-list');

        // Add the event listener
        trackInput.addEventListener('input', () => {
                // Clear the results space
                TRACKS_LIST.innerHTML = '';

                // Find the tracks that search the input
                const matchedTracks = newTracks.filter((track) => {
                        return track.name.toUpperCase().includes(trackInput.value.trim().toUpperCase());
                });

                // Add the tracks to the viewport
                matchedTracks.forEach((track) => {
                        addTrack(track);
                })

                // Deal with adding a 'No tracks found' message if there are no results 
                if (TRACKS_LIST.childNodes.length == 0) {
                        const noTracksText = document.createElement('div');
                        noTracksText.className = 'smalltext';
                        if (trackInput.value.trim() == "") {
                                noTracksText.textContent = "No tracks added";
                        } else {
                                noTracksText.textContent = "No tracks found";
                        }

                        TRACKS_LIST.appendChild(noTracksText);
                }
        });
}

// Enables the selecting and unselecting of features when adding a track
const addFeatureEventListeners = () => {
        const FEATURE_BUTTONS = document.querySelectorAll('.feature');

        FEATURE_BUTTONS.forEach((button) => {
                button.addEventListener('click', () => {
                        button.classList.toggle('feature-selected');
                });
        });
};

// Call all the add event listener functions
addFeatureEventListeners();
addNewTrackListener();
addNewResortListener();
addTrackInputListener();