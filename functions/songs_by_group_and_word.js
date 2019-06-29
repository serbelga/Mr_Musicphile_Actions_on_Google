const axios = require('axios');
const {List, Suggestions} = require('actions-on-google');
const functions = require('firebase-functions');
const index = require('./index.js');
const api = "http://api.musixmatch.com/ws/1.1/track.search";
const key = functions.config().musixmatch.key;

const getSongsByGroupAndWord = async (group, word) => {
    console.log('Artist word', group + ' ' + word);
    return axios.get(api, {
        params: {
            q_artist: group,
            q_lyrics: word,
            s_track_rating: 'desc',
            apikey: key
        }
    }).then(async response => {
        const json = response.data;
        const tracks = json['message']['body']['track_list'];
        console.log(tracks);
        return tracks;
    }).catch(error => {
        console.error(error.response.data);
        return error;
    });
};

exports.songsByGroupAndWordHandler = (conv, { group, word }) => {
    return getSongsByGroupAndWord(group, word)
        .then(tracks => {
            const items = {};

            tracks.forEach((element) => {
                const track = element['track'];
                const title = track.track_name;
                const artist = track.artist_name;
                items[title + ' ' + artist] = {
                    title: title,
                    description: artist,
                }
            });

            conv.ask(index.i18n.__("ANSWER"), new List({
                title: group,
                items: items
            }));

            conv.ask(new Suggestions(
                index.i18n.__("OTHER")
            ));

            return null;
        })
        .catch(error => {
            console.error("error" + error);
            conv.close(index.i18n.__("GROUP_LYRICS_ERROR"))
        });
};

