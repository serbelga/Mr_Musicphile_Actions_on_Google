'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const {dialogflow} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

const i18n = require('i18n');

const initial = require('./initial.js');
const group_info_lastfm = require('./group_info_lastfm')

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

app.intent('given_group_info', group_info_lastfm.groupInfoLastFmHandler);

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
