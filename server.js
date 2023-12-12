const express = require('express');
const app = express();
const fs = require('fs/promises');
const path = require('path');


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
                resorts = await getResortsByName(search);
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
})

app.post('/api/resort', (req, res) => {
        const resortData = req.body;
        resortData.id = 1;
});

const addResort = async (data) => {
        const resortsFile = await getJSONData('resorts');

        data.id = resortsFile.resorts.length + 1;

        resortsFile.resorts.push(data);

        // Code to add image?

        const filePath = path.join(__dirname, 'data', `resorts.json`);
        const dataString = JSON.stringify(resortsFile);
        await fs.writeFile(filePath, dataString);
};

// Function to linearly search the list of resorts for a specific resort by ID
const getResort = async (id) => {
        const resorts = await getResorts();
        const resort = resorts.find(resort => resort.id == id)

        const tracksList = resort.tracks;
        resort.tracks = await getTracks(tracksList);

        return resort;
};

// Function to get the list of all resorts from the JSON file
const getResorts = async () => {
        const jsonData = await getJSONData('resorts');
        return jsonData.resorts;
};

const getResortsByName = async (search) => {
        const jsonData = await getJSONData('resorts');
        const resortsList = jsonData.resorts;

        // Filter resorts
        const matchedResorts = resortsList.filter((resort) => {
                // Convert both to uppercase to ensure not case sensitive
                return resort.name.toUpperCase().includes(search.toUpperCase());
        });

        return matchedResorts;
}

// Function to get the list of all tracks from the JSON file
const getTracks = async (tracksList) => {
        const jsonData = await getJSONData('tracks');
        const tracksArray = jsonData.tracks;

        const matchedTracks = tracksArray.filter((track) => {
                return tracksList.includes(track.id);
        });

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