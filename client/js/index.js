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
                const response = await fetch(`http://127.0.0.1:8090/api/resorts/?search=${search}`);
                const data = await response.json();
                const resorts = data.resorts;

                // AppAlert('success', 'Found all resorts.')
                return resorts;
        } catch (e) {
                AppAlert('error', 'Could not find resorts.')
                return null;
        }
};

export const getResortAndTracks = async () => {
        var id = parseInt(new URLSearchParams(window.location.search).get('id'));

        if (!id) {
                id = "";
        }

        try {
                const response = await fetch(`http://127.0.0.1:8090/api/resort/?id=${id}`);
                const data = await response.json();

                console.log(data);

                if (response.status != 200) {
                        throw Error;
                }

                AppAlert('success', 'Found the resort.')
                return data;
        } catch (e) {
                AppAlert('error', 'Could not find resort.')
                return null;
        }
}

export const getTracks = async () => {
        var search = parseInt(new URLSearchParams(window.location.search).get('search'));

        if (search) {
                // Set the page header text to explain that results have been filtered
                document.querySelector('.resorts-text').textContent = `Showing results for "${search}"`;
        } else {
                // Empty string to return all results
                search = "";
        }

        try {
                const response = await fetch(`http://127.0.0.1:8090/api/tracks/?search=${search}`);
                const data = await response.json();
                const tracks = data.tracks;

                // AppAlert('success', 'Found all resorts.')
                console.log(tracks)
                return tracks;
        } catch (e) {
                AppAlert('error', 'Could not find tracks.')
                return null;
        }

}

document.querySelector('#resorts-search-btn').addEventListener('click', () => {
        const searchValue = document.querySelector('#resorts-search-input').value.trim();
        document.location.href = `/?search=${searchValue}`;
})

document.querySelector('#mobile-resorts-btn').addEventListener('click', () => {
        const searchValue = document.querySelector('#mobile-resorts-input').value.trim();
        document.location.href = `/?search=${searchValue}`;
})