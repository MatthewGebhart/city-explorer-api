'use strict'
//This will be our server

//Set Up:
// ----------


require('dotenv').config();
//express server
const express = require('express');
// allows for Cross Origin Resource Sharing
const cors = require('cors');
// load data
const axios = require('axios');
// const data = require('./data/weather.json');
const { response } = require('express');
//start our server
const app = express();
const getWeather = require('./modules/getWeather.js');
const getMovies = require('./modules/getMovies.js');


//Middleware
app.use(cors());

//Declare our PORT variable
const PORT = process.env.PORT || 3001;

// Listening for connection
app.listen(PORT, () => console.log(`listening on Port ${PORT}`));

// Endpoints:
// ------------------

app.get('/', (req, res) => {
    res.send('Hello from the home route!');
});

app.get('/weather', getWeather);
app.get('/movies', getMovies);





// troubleshooting
// 1. check server is running
// 2. in frontend, check the network tab
// 3. in the backend visit the url || thunderclient GET request
// = should see json data from the API



// Catch all endpoint:

app.get('*', (req, res) => {
    res.status(404).send('uh oh, Ya Done 404');
})
