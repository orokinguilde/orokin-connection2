const fs = require('fs');

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
