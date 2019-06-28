const {Suggestions} = require('actions-on-google');
const index = require('./index.js');

/**
 * Shows a welcome message and suggestions related with the main actions
 * @param conv Conversation
 */
exports.welcomeHandler = (conv) => {
    conv.ask(index.i18n.__('WELCOME_BASIC'));
    conv.ask(new Suggestions(
        index.i18n.__('SUGGESTIONS')
    ));
};
