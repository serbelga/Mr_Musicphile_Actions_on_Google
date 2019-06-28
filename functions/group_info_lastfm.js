const axios = require('axios');
const {BasicCard, Button, Image, Suggestions} = require('actions-on-google');
const functions = require('firebase-functions');
const {getArtistImageUrl, getArtistUrl} = require('./spotify_functions')
const index = require('./index.js');
const api = "http://ws.audioscrobbler.com/2.0/"; // Last.fm API endpoint
const key = functions.config().lastfm.key;

const getGroupInfo = async (group) => {
    return axios.get(api, {
        params: {
            method: 'artist.getinfo',
            artist: group,
            api_key: key,
            format: 'json',
            lang: index.i18n.getLocale().substr(0,2)
        }
    }).then(async response => {
        const json = response.data;
        const artist = json.artist.name;
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
        return {artist, bio, similar, imageGroupUrl, artistSpotifyUrl};
    })
};

exports.groupInfoLastFmHandler = function (conv, {group}) {
    return getGroupInfo(group).then(
        info => {
            const items = [];
            for (const artist of info.similar) {
                if (artist.name.length <= 25)
                    items.push(artist.name);
            }

            const spotifyButton = info.artistSpotifyUrl ? new Button({
                title: index.i18n.__("SPOTIFY"),
                url: info.artistSpotifyUrl,
            }) : null;

            conv.ask(index.i18n.__("ANSWER"),
                new BasicCard({
                    text: info.bio,
                    title: info.artist,
                    image: new Image({
                        url: info.imageGroupUrl,
                        alt: info.artist
                    }),
                    buttons: spotifyButton
                }));

            conv.ask(new Suggestions(
                index.i18n.__("OTHER")
            ));

            conv.ask(new Suggestions(items));

            return;
        }
    ).catch(error => {
        conv.close(index.i18n.__("GROUP_ERROR", error))
        console.error("error:", error);
    })
};
