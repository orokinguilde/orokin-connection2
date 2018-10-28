const moment = require('moment');
const Saver = require('./Saver');

moment.locale('fr');

console.log(moment(new Date()).tz('Europe/Paris').format('LT'));
console.log(moment(new Date()).tz('Europe/Paris').format('H:mm'));

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
