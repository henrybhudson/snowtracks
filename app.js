const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs/promises');
const path = require('path');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.urlencoded({
        extended: true
}));
app.use(express.json());

// Set route for page rendering
app.use(express.static(__dirname + '/client'));

// Function to use for checking if inputs are valid
const allValuesAreDefined = (obj) => {
        return obj && typeof obj === 'object' && Object.values(obj).every(value => value);
}

// The API call to fetch all resorts
app.get('/api/resorts', async (req, res) => {
        const search = req.query.search;
        var resorts;

        if (search) {
                resorts = await getDataByName('resorts', search);
        } else {
                resorts = await getResorts();
        }

        res.status(200).json({ resorts });
})

// The API call to get a specific resort by ID
app.get('/api/resort', async (req, res) => {
        const resortID = req.query.id;
        const resortData = await getResort(resortID);

        if (resortID && resortData) {
                res.status(200).json(resortData);
        } else if (!resortID) {
                res.status(400).json({ "message": "No ID has been given." })
        } else {
                res.status(404).json({ "message": "Resort not found." })
        }
});

// Get all tracks that match the search
app.get('/api/tracks', async (req, res) => {
        const search = req.query.search;
        var tracks;

        if (search) {
                tracks = await getDataByName('tracks', search);
        } else {
                tracks = await getTracks();
        }

        res.status(200).json({ tracks });
});

// Add a new resort
app.post('/api/resort', async (req, res) => {
        const resortData = req.body;
        const resorts = await getResorts();
        const tracks = await getTracks();

        // Check that all inputs are defined
        if (allValuesAreDefined(resortData) && resortData.tracks.length) {
                // Set the resort id
                resortData.id = resorts.length + 1;
                // Get the tracks from the tracks array
                var newTracks = resortData.tracks.slice();

                // Set the track primary keys and the resort-track foreign keys
                for (let i = 0; i < newTracks.length; i++) {
                        newTracks[i].id = tracks.length + i + 1;
                        newTracks[i].resort = resortData.id;
                        resortData.tracks[i] = newTracks[i].id;
                }

                try {
                        await addResort(resortData);
                        await addTracks(newTracks);
                        res.status(200).json({
                                status: "success"
                        });
                } catch {
                        res.status(400);
                }
        } else {
                res.status(400).json({ "message": 'Some values are missing.' })
        }

});

// Add a new track to an existing resort
app.post('/api/track', async (req, res) => {
        const resortID = req.body.resort;
        const track = req.body;

        if (allValuesAreDefined(track)) {
                const resorts = await getResorts();
                const foundResort = resorts.find(resort => resort.id === resortID);

                if (foundResort) {
                        const tracks = await getTracks();
                        track.id = tracks.length + 1;
                        await addTracks([track]);

                        foundResort.tracks.push(track.id);
                        await updateResorts(resorts);

                        res.status(200).json({
                                status: 'success'
                        });
                } else {
                        res.status(404).json({
                                message: 'Resort not found.'
                        });
                }
        } else {
                res.status(400).json({
                        message: 'Some values are missing.'
                });
        }
});

// Update a resort, called when a new track is added
const updateResorts = async (resorts) => {
        const filePath = path.join(__dirname, 'data', 'resorts.json');
        const dataString = JSON.stringify({ resorts });
        await fs.writeFile(filePath, dataString);
};

// Add new resort to JSON file
const addResort = async (data) => {
        if (!(data.name && data.country && data.airport && data.description)) {
                throw "Missing required information";
        }

        const resortsFile = await getJSONData('resorts');
        const newResort = {
                name: data.name,
                country: data.country,
                airport: data.airport,
                description: data.description,
                id: data.id,
                tracks: data.tracks,
                image: data.image
        };

        resortsFile.resorts.push(newResort);

        const filePath = path.join(__dirname, 'data', `resorts.json`);
        const dataString = JSON.stringify(resortsFile);
        await fs.writeFile(filePath, dataString);
};

// Add all new tracks to JSON file
const addTracks = async (tracks) => {
        const tracksFile = await getJSONData('tracks');

        tracks.forEach((track) => {
                tracksFile.tracks.push(track);
        });

        const filePath = path.join(__dirname, 'data', `tracks.json`);
        const dataString = JSON.stringify(tracksFile);
        await fs.writeFile(filePath, dataString);
};

// Function to linearly search the list of resorts for a specific resort by ID
const getResort = async (id) => {
        const resorts = await getResorts();
        const resort = resorts.find(resort => resort.id == id)

        try {
                const tracksList = resort.tracks;
                resort.tracks = await getTracks(false, tracksList);
        } catch (err) {
                return null;
        }

        return resort;
};

// Function to get the list of all resorts from the JSON file
const getResorts = async () => {
        const jsonData = await getJSONData('resorts');
        return jsonData.resorts;
};

// Reused for tracks and resorts, depending on input
// Performs searching functionality
const getDataByName = async (type, search) => {
        var dataList;

        switch (type) {
                case 'resorts':
                        dataList = await getResorts();
                        break;
                case 'tracks':
                        dataList = await getTracks();
                        break;
        }

        // Filter data
        const matchedData = dataList.filter((data) => {
                // Convert both to uppercase to ensure not case sensitive
                return data.name.toUpperCase().includes(search.toUpperCase());
        });

        return matchedData;
}

// Function to get the list of all tracks from the JSON file
const getTracks = async (all = true, tracksList = []) => {
        const jsonData = await getJSONData('tracks');
        const tracksArray = jsonData.tracks;

        var matchedTracks;

        const resorts = await getResorts();

        for (let i = 0; i < tracksArray.length; i++) {
                const track = tracksArray[i];
                const resort = resorts.find(resort => resort.id == track.resort);
                tracksArray[i].resort = resort.name;
        }

        matchedTracks = tracksArray;

        if (!all) {
                // We're not fetching all tracks, so filter them
                matchedTracks = tracksArray.filter((track) => {
                        return tracksList.includes(track.id);
                });
        }

        return matchedTracks;
};

// Reusable function to open a JSON file and extract the data
const getJSONData = async (entity) => {
        // Create the file path
        const filePath = path.join(__dirname, 'data', `${entity}.json`);

        // Get the data and parse the JSON
        const data = await fs.readFile(filePath, 'utf8');
        const jsonData = JSON.parse(data);

        return jsonData;
};

module.exports = app;