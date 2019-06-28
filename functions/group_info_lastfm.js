const axios = require('axios');
const {BasicCard, Button, Image, Suggestions} = require('actions-on-google');
const functions = require('firebase-functions');
const {getArtistImageUrl, getArtistUrl} = require('./spotify_functions')

const api = "http://ws.audioscrobbler.com/2.0/"; // Last.fm API endpoint
const key = functions.config().lastfm.key;

const getGroupInfo = async (group) => {
    return axios.get(api, {
        params: {
            method: 'artist.getinfo',
            artist: group,
            api_key: key,
            format: 'json',
            lang: 'es'
        }
    }).then(async response => {
        const json = response.data;
        const artist = json.artist.name;
        //const imageGroupUrl = json.artist.image[2]['#text']; //Large image
        const similar = json.artist.similar.artist;
        const bio = json.artist.bio.content;
        let imageGroupUrl;
        let artistSpotifyUrl;
        try {
            imageGroupUrl = await getArtistImageUrl(group);
            artistSpotifyUrl = await getArtistUrl(group);
        } catch (e) {
            return console.error("Error", e)
        }
        return { artist, bio, similar, imageGroupUrl };
    })
};

exports.groupInfoLastFmHandler = function(conv, {group}) {
    return getGroupInfo(group).then(
        info => {
            const items = [];

            conv.ask('Aquí tienes', new BasicCard({
                text: info.bio,
                title: info.artist,
                image: new Image({
                    url: info.imageGroupUrl,
                    alt: info.artist
                })
            }));

            conv.ask(new Suggestions(
               'Otras consultas'
            ));
            return;
        }
    ).catch(error => {
        conv.close(`☹️ No he podido encontrar información sobre ${group} \n`)
        console.error("error:", error);
    })
};
