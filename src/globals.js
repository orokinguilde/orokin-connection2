const moment = require('moment-timezone');
const Saver = require('./Saver').Saver;

moment.locale('fr');

var getPeriod = function() {
    var now = new Date(Date.now());
    var month = now.getMonth() + 1;
    var day = now.getDate();

    return {
        halloween: month === 10 && day > 20 || month === 11 && day < 2,
        christmas: month === 11 && day > 25 || month === 12 && day < 28,
        newYear: month === 12 && day >= 28 || month === 1 && day < 3
    };
}

module.exports = {
    initialize: function(bot) {
        const saver = new Saver(process.env.STORAGE_FILE_ID, bot, process.env.STORAGE_FILE_ID_FALLBACK);
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
    padN: (value, nb, char) => {
        value = value === undefined || value === null ? '' : value.toString();
        nb = nb || 0;
        
        if(char === undefined)
            char = ' ';

        while(value.length < nb)
            value = `${char}${value}`;

        return value;
    },
    findById: function(collection, id)
    {
        return collection.filter(item => item.id === id).first();
    },
    iconBefore: function() {
        var period = getPeriod();
        
        var icon = undefined;
        if(period.halloween) icon = ':jack_o_lantern:'
        if(period.christmas) icon = ':christmas_tree:'
        if(period.newYear) icon = ':confetti_ball:'

        return icon ? `${icon} ` : '';
    },
    iconAfter: function() {
        var period = getPeriod();
        
        var icon = undefined;
        if(period.halloween) icon = ':jack_o_lantern:'
        if(period.christmas) icon = ':christmas_tree:'
        if(period.newYear) icon = ':tada:'

        return icon ? ` ${icon}` : '';
    }
};
