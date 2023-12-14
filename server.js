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
/*
TODO:
So we have some API calls that SHOULD WORK.
Now let's just try to call the getResorts API on the client side.
Do this on page load.




*/




// Set route for page rendering
app.use(express.static(__dirname + '/client'));

// The API call to fetch all resorts
app.get('/api/resorts', async (req, res) => {
        const search = req.query.search;
        var resorts;

        if (search) {
                resorts = await getDataByName('resorts', search);
        } else {
                resorts = await getResorts();
        }

        res.json({ resorts });
})

// The API call to get a specific resort by ID
app.get('/api/resort', async (req, res) => {
        const resortID = req.query.id;
        const resortData = await getResort(resortID);

        if (resortData) {
                res.json(resortData);
        } else {
                res.status(404).json({ "message": "Resort Not Found" })
        }
});

app.get('/api/tracks', async (req, res) => {
        const search = req.query.search;
        var tracks;

        if (search) {
                tracks = await getDataByName('tracks', search);
        } else {
                tracks = await getTracks();
        }

        res.json({ tracks });
});

app.post('/api/resort', async (req, res) => {
        const resortData = req.body;
        const resorts = await getResorts();
        const tracks = await getTracks();

        // add track IDs and resortIDs
        resortData.id = resorts.length + 1;
        const newTracks = resortData.tracks.slice();

        // console.log(newTracks)

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
});

// Add new resort to JSON file
const addResort = async (data) => {
        const resortsFile = await getJSONData('resorts');

        resortsFile.resorts.push(data);

        // Code to add image?

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
        const filePath = path.join(__dirname, 'data', `${entity}.json`);
        const data = await fs.readFile(filePath, 'utf8');
        const jsonData = JSON.parse(data);

        return jsonData;
};

app.get('/', async (req, res) => {

});

// getResortsByName("Villars")


app.listen(8090, () => {
        console.log('✨ Server running');
});