'use strict'

const axios = require ('axios');
const cache = require('./cache.js');

async function getWeather(req, res) {
    let searchQuery = req.query.query.toLowerCase();
    let { lat, lon, } = req.query;
    let weatherURL = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&days=3&units=I&key=${process.env.WEATHER_API_KEY}`;
    // console.log(`this is weatherURL ${weatherURL}`);
    // console.log(`this is weather search query ${searchQuery}`)
    try {
        const key = searchQuery + 'weather';
        if (cache[key] && (Date.now() - cache[key].timeStamp < 10000 )) {
            console.log('Cache was hit, WEATHER data present in Cache');
            res.status(200).send(cache[key].data);
        } else {
        let weatherFetched = await axios.get(weatherURL);
        let weatherFetchedArray = weatherFetched.data.data.map((obj) => {
            let date = obj.datetime;
            let low = obj.min_temp;
            let high = obj.max_temp;
            let weather = obj.weather.description;
            let description = `${weather} with a high of ${high} and a low of ${low}`;
            return new Forecast(date, description);
        });
            cache[key] = {
                timeStamp: Date.now(),
                data: weatherFetchedArray
            }
        console.log('Cache is;', cache);
        res.status(200).send(weatherFetchedArray);
    }
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