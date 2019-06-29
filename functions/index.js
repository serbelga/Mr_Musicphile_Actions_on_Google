'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const {dialogflow} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

const i18n = require('i18n');

const initial = require('./initial.js');
const group_info_lastfm = require('./group_info_lastfm');
const genre_suggestions = require('./genre_suggestions');
const genre_songs = require('./songs_by_genre');
const song_lyrics = require('./song_lyrics_genius');
const songs_group_word = require('./songs_by_group_and_word');

i18n.configure({
    locales: ['es-ES', 'en-US'],
    directory: __dirname + '/locales',
    defaultLocale: 'es-ES'
});

// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});

app.middleware((conv) => {
    i18n.setLocale(conv.user.locale);
});

exports.i18n = i18n;

app.intent('Default Welcome Intent', initial.welcomeHandler);
app.intent('main_options', initial.mainOptionsHandler);

app.intent('group_info_next', group_info_lastfm.groupInfoLastFmHandler);
app.intent('given_group_info', group_info_lastfm.groupInfoLastFmHandler);
app.intent('given_group_info_next', group_info_lastfm.groupInfoLastFmHandler);

app.intent('genre_songs', genre_suggestions.genreSuggestionsHandler);
app.intent('genre_songs_next', genre_songs.songsByGenreHandler);
app.intent('given_genre_songs', genre_songs.songsByGenreHandler);

app.intent('given_genre_songs_option', song_lyrics.groupTrackLyricsGeniusHandler);
app.intent('given_song_lyrics', song_lyrics.groupTrackLyricsGeniusHandler);
app.intent('song_lyrics_next', song_lyrics.groupTrackLyricsGeniusHandler);

app.intent('songs_group_word', songs_group_word.songsByGroupAndWordHandler);
app.intent('songs_group_word_option', song_lyrics.groupTrackLyricsGeniusHandler);

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
