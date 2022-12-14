'use strict'

const axios = require ('axios');
const cache = require('./cache.js');

async function getMovies(req, res) {
    let searchQuery = req.query.query.toLowerCase();
    console.log(`movie search query is ${searchQuery}`);
    let movieURL = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${searchQuery}`;
    // console.log(`this is movieURL ${movieURL}`);
    // console.log(process.env.REACT_APP_SERVER_LOCAL);
    try {
        const key = searchQuery + 'movies';
        if (cache[key] && (Date.now() - cache[key].timeStamp < 10000 )) {
            console.log('Cache was hit, MOVIE data present in Cache');
            res.status(200).send(cache[key].data);
        } else {
        let moviesFetched = await axios.get(movieURL);
        let moviesArray = [];
        for (let i = 0; i < moviesFetched.data.results.length - 12; i++) {
            let result = moviesFetched.data.results[i];
            moviesArray.push( new Movie(result.title, result.release_date, result.overview, result.popularity, result.vote_average, result.vote_count, 'https://image.tmdb.org/t/p/w500'+result.poster_path, result.id));
        }
            cache[key] = {
                timeStamp: Date.now(),
                data: moviesArray,
            }
            console.log('Cache is:', cache);
            res.send(moviesArray);
    }
    } catch (error) {
        res.status(500).send("Error retrieving Movie data from Server", error);
    };
};

class Movie {
    constructor(title, release_date, overview, popularity,  vote_average, vote_count, image_url, id) {
        this.title = title;
        this.release_date = release_date;
        this.overview = overview;
        this.popularity = popularity;
        this.vote_average = vote_average;
        this.vote_count = vote_count;
        this.image_url = image_url;
        this.id = id;
    }
};



module.exports = getMovies;