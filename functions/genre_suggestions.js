const {Suggestions} = require('actions-on-google');
const index = require('./index.js')
const suggestionsList = ["Pop", "Rock", "Reggae", "Jazz", "Reggaeton", "Rap", "Blues", "Soul"];
const suggestions = new Suggestions(
    suggestionsList,
);

exports.genreSuggestionsHandler = (conv) => {
    conv.ask(index.i18n.__("EXAMPLES"));
    conv.ask(suggestions);
};
