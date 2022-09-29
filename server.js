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
// const axios = require('axios');
const { response } = require('express');
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
    console.log(`this is req.query ${req.query}`);
    let searchQuery = req.query.searchQuery;
    let place = data.find( item => item.city_name.toLowerCase() === searchQuery.toLowerCase());
    try { 
        res.send(weatherData(place.data));
    } catch (error) {
        place = 'Error, we don\'t have data for that location';
    }
});

let weatherData = data => {
    let weatherOfCity = [];
    data.forEach(item => {
        weatherOfCity.push(
            new Forecast(
                item.valid_date,
                `High of ${item.high_temp}, Low of ${item.low_temp} with ${item.weather.description}`
            )
        );
    });
    return weatherOfCity;
}

class Forecast {
    constructor(date, description){
        this.date = date,
        this.description = description;
    }
};
// in-class Example for lab 08

// app.get('/photos', getPhotos);

// troubleshooting
// 1. check server is running
// 2. in frontend, check the network tab
// 3. in the backend visit the url || thunderclient GET request
// = should see json data from the API


// async function getPhotos(req, res) {
//     const searchQuery = req.query.searchQuery;
//     const url = `https://api.unsplash.com/search/photos/?client_id=${process.env.UNSPLASH_ACCESS_KEY}&query=${searchQuery}`;
//     try {
//         const photoResponse = await axios.get(url);
//         const photoArray = photoResponse.data.results.map(photo => new Photo(photo));
//         res.status(200).send(photoArray);
//     } catch (error) {
//         console.log('error messages error with get photos');
//         response.status(500).send(`server error ${error}`);
//     }

// class Photo {
//     constructor(obj) {
//         this.img_url = obj.urls.regular;
//         this.photographer = obj.user.name;
//     }
// }

// }
// Catch all endpoint:

app.get('*', (req, res) => {
    res.status(404).send('uh oh, Ya Done 404');
})
