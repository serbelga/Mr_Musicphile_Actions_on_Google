const {List, Image, Suggestions} = require('actions-on-google');
const {getTracksByGenre} = require('./spotify_functions');
const index = require('./index.js');
const api = "https://api.spotify.com/v1";

const getGenreTracks = async (genre) => {
    return getTracksByGenre(genre);
};

exports.songsByGenreHandler = (conv, {genre}) => {
    return getGenreTracks(genre)
        .then(tracks => {
            const items = {};

            tracks.forEach((track) => {
                const title = track.name;
                const group = `${track.artists.map((artist) => artist.name).join(', ') || index.i18n.__("UNKNOWN_ARTIST")}`;
                const description = `${group} - ${track.album.name || index.i18n.__("UNKNOWN_ALBUM")}`;
                items[title + ' ' + group] = {
                    title: title,
                    description: description,
                    image: new Image({
                        url: track.album.images[track.album.images.length - 1].url,
                        alt: 'Album cover'
                    })
                }
            });

            conv.ask(index.i18n.__("ANSWER"), new List({
                title: index.i18n.__("GENRE_SONGS", genre),
                items: items
            }));

            conv.ask(new Suggestions(
                index.i18n.__("OTHER")
            ));

            return null;
        }).catch(error => conv.close(index.i18n.__("GENRE_SONGS_ERROR")));
}
