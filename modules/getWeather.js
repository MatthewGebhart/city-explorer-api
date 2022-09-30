'use strict'

const axios = require ('axios');

async function getWeather(req, res) {
    let { lat, lon, } = req.query;
    let weatherURL = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&days=3&units=I&key=${process.env.WEATHER_API_KEY}`;
    console.log(`this is weatherURL ${weatherURL}`);
    console.log(`this is search query ${req.query}`)
    try {
        let weatherFetched = await axios.get(weatherURL);
        let weatherFetchedArray = weatherFetched.data.data.map((obj) => {
            let date = obj.datetime;
            let low = obj.min_temp;
            let high = obj.max_temp;
            let weather = obj.weather.description;
            let description = `Low of ${low}, high of ${high} with ${weather}`;
            return new Forecast(date, description);
        });
        res.status(200).send(weatherFetchedArray);
    } catch (error) {
        res.status(500).send("Error retrieving data from Server", error);
    }
};

class Forecast {
    constructor(date, description){
        this.date = date,
        this.description = description;
    }
};

module.exports = getWeather;