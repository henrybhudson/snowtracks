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

        ADD_BTN.addEventListener('click', () => {
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
                })


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

const imageToURL = (image) => {
        var reader = new FileReader();

        return new Promise((resolve, reject) => {
                reader.onload = () => {
                        resolve(reader.result);
                };
                reader.readAsDataURL(image);
        });
}

const handleImageUpload = async (image) => {
        const imageContents = await imageToURL(image);
        return imageContents;
}

const addNewResortListener = () => {
        const ADD_RESORT_BTN = document.querySelector('.confirm-resort-btn');

        ADD_RESORT_BTN.addEventListener('click', async () => {
                const name = document.querySelector('#resort-name').value;
                const country = document.querySelector('#resort-country').value;
                const airport = document.querySelector('#resort-airport').value;
                const description = document.querySelector('#resort-description').value;
                const image = document.querySelector('#resort-image').files[0];

                const imageCode = await handleImageUpload(image);
                console.log(imageCode)

                const newResort = {
                        name,
                        country,
                        airport,
                        description,
                        tracks: newTracks,
                        image: imageCode
                }

                addResort(newResort).then((success) => {
                        if (success) {
                                AppAlert('success', "Resort successfully added.")
                        } else {
                                AppAlert('error', 'EFEUBHBBFEIWBE')
                        }
                });

                if (name && country && airport && description && image) {
                        addResort(newResort).then((success) => {
                                if (success) {
                                        AppAlert('success', "Resort successfully added.")
                                }
                        });
                } else {
                        // One of the fields is missing
                        AppAlert('error', "Resort could not be added.")
                }

        });
};

// Live search functionality
const addTrackInputListener = () => {
        const trackInput = document.querySelector('#track-search');
        const TRACKS_LIST = document.querySelector('.new-tracks-list');

        trackInput.addEventListener('input', () => {
                TRACKS_LIST.innerHTML = '';
                const matchedTracks = newTracks.filter((track) => {
                        return track.name.toUpperCase().includes(trackInput.value.trim().toUpperCase());
                });

                matchedTracks.forEach((track) => {
                        addTrack(track);
                })

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

const addFeatureEventListeners = () => {
        // Enables the selecting and unselecting of features when adding a track
        const FEATURE_BUTTONS = document.querySelectorAll('.feature');

        FEATURE_BUTTONS.forEach((button) => {
                button.addEventListener('click', () => {
                        button.classList.toggle('feature-selected');
                });
        });
};

addFeatureEventListeners();
addNewTrackListener();
addNewResortListener();
addTrackInputListener();