const axios = require('axios');
const {BasicCard, Button, Image, Suggestions} = require('actions-on-google');
const cheerio = require('cheerio');
const {getTrackUrl} = require('./spotify_functions.js');
const index = require('./index.js');
const api = "https://api.genius.com/search";
const token = 'Hox7GrDz-vs1ySUUnz3wmugYMhEwP99ohD3YkdaCdmaRf0elwBYgc-9hbamFRhIZ';

const getTrackLyrics = async (group, track) => {
    return axios.get(api, {
        params: {
            q: `${group} ${track}`
        },
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(async response => {
        const json = response.data;
        console.log("json", response.data);
        if (json['response']['hits'].length === 0) {
            throw new Error()
        }
        const trackUrl = json['response']['hits'][0]['result']['url'];
        const imageTrackUrl = json['response']['hits'][0]['result']['song_art_image_thumbnail_url'];
        const trackFullTitle = json['response']['hits'][0]['result']['full_title'];

        //Scraping
        try {
            const res = await axios.get(trackUrl);
            const $ = cheerio.load(res.data);
            const element = $('.lyrics');
            const trackSpotifyUrl = await getTrackUrl(track, group);
            return {lyrics: element.text(), imageTrackUrl, trackFullTitle, trackSpotifyUrl};
        } catch (e) {
            console.log(e);
            return e;
        }
    })
};

exports.groupTrackLyricsGeniusHandler = (conv, {track, group}) => {
    track = conv.arguments.get('OPTION') || track;
    return getTrackLyrics(group, track)
        .then(info => {
            conv.ask(index.i18n.__("ANSWER"), new BasicCard({
                    text: info.lyrics,
                    title: info.trackFullTitle,
                    image: new Image({
                        url: info.imageTrackUrl,
                        alt: 'Image alternate text',
                    }),
                    buttons: new Button({
                        title: index.i18n.__("SPOTIFY"),
                        url: info.trackSpotifyUrl,
                    }),
                })
            );

            conv.ask(new Suggestions(
                index.i18n.__("OTHER")
            ));
            return null;
        }).catch(() => conv.close(index.i18n.__("LYRICS_ERROR", track, group)));
};
