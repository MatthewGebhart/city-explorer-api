'use strict'

const axios = require ('axios');

async function getMovies(req, res) {
    let searchQuery = req.query;
    console.log(`movie search query is ${req.query}`);
    let movieURL = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${searchQuery}`;
    console.log(`this is movieURL ${movieURL}`);
    // console.log(process.env.REACT_APP_SERVER_LOCAL);
    try {
        let moviesFetched = await axios.get(movieURL);
        let moviesArray = [];
        for (let i = 0; i < moviesFetched.data.results.length; i++) {
            let result = moviesFetched.data.results[i];
            moviesArray.push( new Movie(result.title, result.release_date, result.overview, result.popularity, result.vote_average, result.vote_count, 'https://image.tmdb.org/t/p/w500'+result.poster_path));
        }
            res.send(moviesArray);
    } catch (error) {
        res.status(500).send("Error retrieving Movie data from Server", error);
    };
};

class Movie {
    constructor(title, release_date, overview, popularity,  vote_average, vote_count, image_url) {
        this.title = title;
        this.release_date = release_date;
        this.overview = overview;
        this.popularity = popularity;
        this.vote_average = vote_average;
        this.vote_count = vote_count;
        this.image_url = image_url;
    }
};



module.exports = getMovies;