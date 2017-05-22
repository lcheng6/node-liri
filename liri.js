'use strict';

var twitterAPI = require('twitter');
var spotifyAPI = require('spotify');
var request = require('request');
var imdbAPI = require('imdb');
var keys = require('./keys.js');
var fs = require('fs');

//console.log('hi this is Liang')


var command = process.argv[2];
var name = process.argv[3];

var commands = {
	"my-tweets": getTweets, 
	"spotify-this-song": spotify_this_song,
	"movie-this": null, 
	"do-what-it-says": null
}

var twitterClient = new twitterAPI({
    consumer_key: keys.twitterKeys.consumer_key,
    consumer_secret: keys.twitterKeys.consumer_secret,
    access_token_key: keys.twitterKeys.access_token_key,
    access_token_secret: keys.twitterKeys.access_token_secret
});


function getTweets() {
    twitterClient.get('statuses/user_timeline', { count: 20 }, function(error, tweets, response) {
        if (!error) {
            tweets.forEach(function(tweet) {
                console.log('---------------------------------------------- \n Created: '
                	+ tweet.created_at + "\n" + "Tweet: " + tweet.text);
            });
        } else {
            console.log(error);
        }
    })
};

function spotify_this_song(name) {
	if(name ===null) {
		name = "'The Sign Ace of Base'"
	}

	spotifyAPI.search({ type: "track", query: name }, function(err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            log(err);
            return;
        } else {
            var songs = data.tracks.items;

            songs.forEach(function(song) {
                // console.log(JSON.stringify(song, null, 4));
                var artistsNames = "";
                artistsNames =song.artists.map(function(artist) {
                    return artist.name;
                }).join(", ");
                console.log("---------------------------------------------------------");
                console.log("Artists: " + artistsNames);
                console.log("Song name: " + song.name);
                console.log("Preview link: " + song.preview_url);
                console.log("Album name: " + song.album.name);
            });
        }
    })
}

if (commands[command] != undefined) {
	var func = commands[command];
	if (func != null) {
		func(name);
	}
}
