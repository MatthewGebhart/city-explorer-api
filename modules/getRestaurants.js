'use strict'
// stretch goal to add restraunts with Yelp API. Ran out of time to implement. 
const axios = require ('axios');
const cache = require('./cache.js');

async function getRestaurants(req, res) {
    let searchQuery = req.query.query.toLowerCase();
    let { lat, lon, } = req.query;
    let weatherURL = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&days=3&units=I&key=${process.env.WEATHER_API_KEY}`;
    // console.log(`this is restaurantURL ${weatherURL}`);
    // console.log(`this is restaurant search query ${searchQuery}`)
    try {
        const key = searchQuery + 'restaurants';
        if (cache[key] && (Date.now() - cache[key].timeStamp < 10000 )) {
            console.log('Cache was hit, RESTAURANT data present in Cache');
            res.status(200).send(cache[key].data);
        } else {
        let restaurantsFetched = await axios.get(weatherURL);
        let restaurantsFetchedArray = restaurantsFetched.data.data.map((obj) => {
            let date = obj.datetime;
            let low = obj.min_temp;
            let high = obj.max_temp;
            let weather = obj.weather.description;
            let description = `${weather} with a high of ${high} and a low of ${low}`;
            return new Forecast(date, description);
        });
            cache[key] = {
                timeStamp: Date.now(),
                data: restaurantsFetchedArray
            }
        console.log('Cache is;', cache);
        res.status(200).send(restaurantsFetchedArray);
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

module.exports = getRestaurants;