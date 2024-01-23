/*

index.js
========
This file manages and exports all the requests to the server.
It also deals with the navigaton buttons and inputs.

*/

import AppAlert from './app-alert.js';

export const getResorts = async () => {
        // Get query value from URL
        var search = new URLSearchParams(window.location.search).get('search');

        if (search) {
                // Set the page header text to explain that results have been filtered
                document.querySelector('.resorts-text').textContent = `Showing results for "${search}"`;
        } else {
                // Empty string to return all results
                search = "";
        }

        try {
                // Create an AbortController to check for timeout
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000);

                // Send request
                const response = await fetch(`http://127.0.0.1:8090/api/resorts/?search=${search}`);

                clearTimeout(timeoutId);

                if (!response.ok) {
                        throw new Error(`HTTP Error. Status: ${response.status}`);
                }

                // Get the data from the response
                const data = await response.json();
                const resorts = data.resorts;

                return resorts;
        } catch (e) {
                if (e.name === 'AbortError') {
                        AppAlert('error', 'Request timed out. Please check your connection.');
                } else {
                        AppAlert('error', 'Could not find resorts.');
                }
                return null;
        }
};

export const getResortAndTracks = async () => {
        var id = parseInt(new URLSearchParams(window.location.search).get('id'));

        if (!id) {
                id = "";
        }

        try {
                // Create an AbortController to check for timeout
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000);

                // Send request
                const response = await fetch(`http://127.0.0.1:8090/api/resort/?id=${id}`);

                clearTimeout(timeoutId);

                if (!response.ok) {
                        throw new Error(`HTTP Error. Status: ${response.status}`);
                }

                const data = await response.json();

                if (response.status != 200) {
                        throw Error;
                }

                return data;
        } catch (e) {
                if (e.name === 'AbortError') {
                        AppAlert('error', 'Request timed out. Please check your connection.');
                } else {
                        AppAlert('error', 'Could not find this resort.');
                }
                return null;
        }
}

export const getTracks = async () => {
        var search = new URLSearchParams(window.location.search).get('search');

        if (search) {
                // Set the page header text to explain that results have been filtered
                document.querySelector('.resorts-text').textContent = `Showing results for "${search}"`;
        } else {
                // Empty string to return all results
                search = "";
        }

        try {
                // Create an AbortController to check for timeout
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000);

                // Send request
                const response = await fetch(`http://127.0.0.1:8090/api/tracks/?search=${search}`);

                clearTimeout(timeoutId);

                if (!response.ok) {
                        throw new Error(`HTTP Error. Status: ${response.status}`);
                }

                // Get data from response
                const data = await response.json();
                const tracks = data.tracks;

                console.log(tracks)

                return tracks;
        } catch (e) {
                if (e.name === 'AbortError') {
                        AppAlert('error', 'Request timed out. Please check your connection.');
                } else {
                        AppAlert('error', 'Could not find tracks.');
                }
                return null;
        }

}

export const addResort = async (resort) => {
        try {
                // Create an AbortController to check for timeout
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000);

                // Send request
                const response = await fetch(`http://127.0.0.1:8090/api/resort/`, {
                        method: 'POST',
                        body: JSON.stringify(resort),
                        headers: {
                                'content-type': 'application/json'
                        },
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                        throw new Error(`HTTP Error. Status: ${response.status}`);
                }

                return true;
        } catch (e) {
                if (e.name === 'AbortError') {
                        AppAlert('error', 'Request timed out. Please check your connection.');
                } else {
                        AppAlert('error', 'Could not add resort.');
                }
                return false;
        }
};

export const addTrack = async (track) => {
        try {
                // Create an AbortController to check for timeout
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000);

                // Send request
                const response = await fetch(`http://127.0.0.1:8090/api/track/`, {
                        method: 'POST',
                        body: JSON.stringify(track),
                        headers: {
                                'content-type': 'application/json'
                        },
                        signal: controller.signal,
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                        throw new Error(`HTTP Error. Status: ${response.status}`);
                }

                AppAlert('success', 'The track was successfully added.');
                return true;
        } catch (e) {
                if (e.name === 'AbortError') {
                        AppAlert('error', 'Request timed out. Please check your connection.');
                } else {
                        AppAlert('error', 'Could not add track.');
                }
                return false;
        }
};


// Navigation buttons & inputs for searching or redirection

document.querySelector('#resorts-search-btn').addEventListener('click', () => {
        const searchValue = document.querySelector('#resorts-search-input').value.trim();
        document.location.href = `/?search=${searchValue}`;
});

document.querySelector('#mobile-resorts-btn').addEventListener('click', () => {
        const searchValue = document.querySelector('#mobile-resorts-input').value.trim();
        document.location.href = `/?search=${searchValue}`;
});

document.querySelector('#tracks-search-btn').addEventListener('click', () => {
        const searchValue = document.querySelector('#tracks-search-input').value.trim();
        document.location.href = `/tracks/?search=${searchValue}`;
});

document.querySelector('#mobile-tracks-btn').addEventListener('click', () => {
        const searchValue = document.querySelector('#mobile-tracks-input').value.trim();
        document.location.href = `/tracks/?search=${searchValue}`;
});

document.querySelector('#edit-tracks-btn').addEventListener('click', () => {
        document.location.href = '/admin/';
});

document.querySelector('#mobile-edit-btn').addEventListener('click', () => {
        document.location.href = '/admin/';
});

document.querySelector('.logo-container').addEventListener('click', () => {
        document.location.href = '/';
});