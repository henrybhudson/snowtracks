const request = require('supertest');
const app = require('../app.js');

// ================================================================
// Tests for Resort POST
// ================================================================

/* global describe */
describe('POST /api/resort', () => {
        /* global test */
        test('responds with status 200', async () => {
                // Mock data for the request payload
                const requestTrack = {
                        "name": "Valid Track Name",
                        "slope": "Valid Slope",
                        "piste": "Valid Piste Type",
                        "description": "Valid Description",
                        "length_km": 1,
                        "time_mins": 10,
                        "features": ["Multiple Routes"]
                };

                const requestData = {
                        name: "Valid Name",
                        country: "Valid Country",
                        airport: "Valid Airport",
                        description: "Valid Description",
                        tracks: [requestTrack],
                        image: "Valid Image Code"
                };


                // Use supertest to send a POST request to the specified route
                const response = await request(app)
                        .post('/api/resort')
                        .send(requestData)
                        .set('Accept', 'application/json');

                // Assert the response status and any other relevant information
                /* global expect */
                expect(response.status).toBe(200);
        });
});

describe('POST /api/resort', () => {
        test('responds with status 400', async () => {
                // Mock data for the request payload
                const requestData = {
                        name: undefined,
                        country: "Valid Country",
                        airport: "",
                        description: "Valid Description",
                        tracks: [],
                        image: "Valid Image Code"
                };

                // Use supertest to send a POST request to the specified route
                const response = await request(app)
                        .post('/api/resort')
                        .send(requestData)
                        .set('Accept', 'application/json');

                // Assert the response status and any other relevant information
                expect(response.status).toBe(400);
                expect(response.body).toEqual({ "message": "Some values are missing." })
        });
});

// ================================================================
// Tests for Resort (Singular) GET
// ================================================================

describe('GET /api/resort', () => {
        test('responds with status 200 and the expected response', async () => {
                // Use the "Test Resort" with id = 4 and one track with id = 6
                const response = await request(app).get('/api/resort/?id=4');


                expect(response.status).toBe(200);
                expect(response.body).toEqual({
                        name: "Test Resort",
                        country: "Test Country",
                        airport: "TEST",
                        description: "Test Description",
                        id: 4,
                        tracks: [{
                                name: 'Test Track',
                                slope: 'Black',
                                piste: 'On-Piste',
                                description: 'Test Track Description',
                                length_km: 1,
                                time_mins: 10,
                                features: ["Multiple Routes"],
                                id: 6,
                                resort: 'Test Resort'
                        }],
                        image: ""
                });
        });
});

describe('GET /api/resort', () => {
        test('responds with status 400', async () => {
                // Do not supply an id field
                const response = await request(app).get('/api/resort/?id=');

                expect(response.status).toBe(400);
                expect(response.body).toEqual({ "message": "No ID has been given." });
        });
});

describe('GET /api/resort', () => {
        test('responds with status 404', async () => {
                // Use the a resort that doesn't exist (id = -1)
                const response = await request(app).get('/api/resort/?id=-1');

                expect(response.status).toBe(404);
                expect(response.body).toEqual({ "message": "Resort not found." });
        });
});

// ================================================================
// Tests for Resorts (Plural) GET
// ================================================================

// Used to test if we get all expected resorts
const consecutiveIntegerArray = (length) => {
        return Array.from({ length }, (_, index) => index + 1);
}

describe('GET /api/resorts', () => {
        test('responds with status 200 and the expected response with no search query', async () => {
                // This has no query parameter so should get all resorts
                var response = await request(app).get('/api/resorts/');

                // We should take out everything but the IDs as if we have the IDs,
                // we have all the data.
                response.body = response.body.resorts.map(resort => resort.id)

                expect(response.status).toBe(200);
                expect(response.body).toEqual(consecutiveIntegerArray(response.body.length));
        });
});

describe('GET /api/resorts', () => {
        test('responds with status 200 and the expected response with a matched search query', async () => {
                // Search for the query 'Resort', which should match two resorts.
                var response = await request(app).get('/api/resorts/?search=Resort');

                // We should take out everything but the IDs as if we have the IDs,
                // we have all the data.
                response.body = response.body.resorts.map(resort => resort.id)

                expect(response.status).toBe(200);
                expect(response.body).toEqual([3, 4]);
        });
});

describe('GET /api/resorts', () => {
        test('responds with status 200 and the expected response with an unmatched search query', async () => {
                // Search for a query that returns no results
                var response = await request(app).get('/api/resorts/?search=abcdefghijkl');

                // We should take out everything but the IDs as if we have the IDs,
                // we have all the data.
                response.body = response.body.resorts.map(resort => resort.id)

                expect(response.status).toBe(200);
                expect(response.body).toEqual([]);
        });
});

// ================================================================
// Tests for Track POST
// ================================================================

describe('POST /api/track', () => {
        test('responds with status 200', async () => {
                // Mock data for the request payload
                const requestData = {
                        "name": "Valid Track Name",
                        "slope": "Valid Slope",
                        "piste": "Valid Piste Type",
                        "description": "Valid Description",
                        "length_km": 1,
                        "time_mins": 10,
                        "features": [
                                "Multiple Routes"
                        ],
                        "resort": 3
                };

                // Use supertest to send a POST request to the specified route
                const response = await request(app)
                        .post('/api/track')
                        .send(requestData)
                        .set('Accept', 'application/json');

                // Assert the response status and any other relevant information
                expect(response.status).toBe(200);
        });
});

describe('POST /api/track', () => {
        test('responds with status 400', async () => {
                // Mock data for the request payload
                const requestData = {
                        "name": "Valid Track Name",
                        "slope": undefined,
                        "piste": "Valid Piste Type",
                        "description": "",
                        "length_km": 1,
                        "time_mins": 10,
                        "features": [
                                "Multiple Routes"
                        ],
                        "resort": 3
                };

                // Use supertest to send a POST request to the specified route
                const response = await request(app)
                        .post('/api/track')
                        .send(requestData)
                        .set('Accept', 'application/json');

                // Assert the response status and any other relevant information
                expect(response.status).toBe(400);
                expect(response.body).toEqual({ "message": "Some values are missing." });
        });
});

describe('POST /api/track', () => {
        test('responds with status 404', async () => {
                // Mock data for the request payload
                const requestData = {
                        "name": "Valid Track Name",
                        "slope": "Valid Slope",
                        "piste": "Valid Piste Type",
                        "description": "Valid Description",
                        "length_km": 1,
                        "time_mins": 10,
                        "features": [
                                "Multiple Routes"
                        ],
                        "resort": -1
                };

                // Use supertest to send a POST request to the specified route
                const response = await request(app)
                        .post('/api/track')
                        .send(requestData)
                        .set('Accept', 'application/json');

                // Assert the response status and any other relevant information
                expect(response.status).toBe(404);
                expect(response.body).toEqual({ "message": "Resort not found." });
        });
});

// ================================================================
// Tests for Tracks GET
// ================================================================

describe('GET /api/tracks', () => {
        test('responds with status 200 and the expected response with no search query', async () => {
                // This has no query parameter so should get all resorts
                var response = await request(app).get('/api/tracks/');

                // We should take out everything but the IDs as if we have the IDs,
                // we have all the data.
                response.body = response.body.tracks.map(track => track.id)

                expect(response.status).toBe(200);
                expect(response.body).toEqual(consecutiveIntegerArray(response.body.length));
        });
});

describe('GET /api/tracks', () => {
        test('responds with status 200 and the expected response with a matched search query', async () => {
                // Search for the query 'Resort', which should match two resorts.
                var response = await request(app).get('/api/tracks/?search=La');

                // We should take out everything but the IDs as if we have the IDs,
                // we have all the data.
                response.body = response.body.tracks.map(track => track.id)

                expect(response.status).toBe(200);
                expect(response.body).toEqual([2, 3]);
        });
});

describe('GET /api/tracks', () => {
        test('responds with status 200 and the expected response with an unmatched search query', async () => {
                // Search for a query that returns no results
                var response = await request(app).get('/api/tracks/?search=abcdefghijkl');

                // We should take out everything but the IDs as if we have the IDs,
                // we have all the data.
                response.body = response.body.tracks.map(track => track.id)

                expect(response.status).toBe(200);
                expect(response.body).toEqual([]);
        });
});