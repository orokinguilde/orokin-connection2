const moment = require('moment');
const Saver = require('./Saver');

moment.locale('fr');

module.exports = {
    initialize: function(bot) {
        const saver = new Saver(process.env.STORAGE_FILE_ID, bot);
        bot.saver = saver;
        bot.onReady((callback) => {
            saver.load(callback);
        });
        
        module.exports.bot = bot;
        module.exports.saver = saver;
    },
    pad: function(value)
    {
        value = value.toString();
        while(value.length < 2)
            value = '0' + value;
        return value;
    },
    findById: function(collection, id)
    {
        return collection.filter(item => item.id === id).first();
    }
};
