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
const data = require('./data/weather.json');
//start our server
const app = express();

//Middleware
app.use(cors());

//Declare our PORT variable
const PORT = process.env.PORT || 3001;

// Listening for connection
app.listen(PORT, () => console.log(`listening on Port ${PORT}`));

// Endpoints:
// ------------------

app.get('/weather', (req, res) => {
    console.log(req.query);
    let place = data.find( data => data.city_name === req.query.searchQuery);
    try { 
        res.send(weatherData(place.data));
    } catch (error) {
        place = 'Error, we don\'t have data for that location';
    }
});


function weatherData(arr) {
    return arr.map(data => {
        return new Forecast(data.datetime, data.weather.description)
    });
};

class Forecast {
    constructor(date, description){
        this.date = date,
        this.description = description;
    }
};

// Catch all endpoint:

app.get('*', (req, res) => {
    res.status(404).send('uh oh, Ya Done 404');
})
