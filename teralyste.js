const { initialize } = require('./src/globals');
const Bot = require('./src/Bot');
const fs = require('fs');

const bot = new Bot({
    token: process.env.TOKEN || fs.readFileSync('./token').toString().trim()
});
bot.debug = fs.existsSync('./token');

console.log('Debug mode:', bot.debug ? 'on' : 'off');

initialize(bot);

bot.start();
