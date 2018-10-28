const moment = require('moment');
const fs = require('fs');

moment.locale('fr');

console.log(moment(new Date()).format('LT'));
console.log(moment(new Date()).format('H:mm'));


process.env = fs.existsSync('./env.json') ? JSON.parse(fs.readFileSync('./env.json')) : process.env;

const { initialize } = require('./src/globals');
const Bot = require('./src/Bot');

const bot = new Bot({
    token: process.env.TOKEN
});
bot.debug = fs.existsSync('./env.json');

console.log('Debug mode:', bot.debug ? 'on' : 'off');

initialize(bot);

bot.start();
