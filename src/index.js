"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moment = require("moment-timezone");
var fs = require("fs");
moment.locale('fr');
process.env = fs.existsSync('./env.json') ? JSON.parse(fs.readFileSync('./env.json').toString()) : process.env;
var globals_1 = require("./globals");
var BotBigBrowser_1 = require("./bots/BotBigBrowser");
var BotGeneral_1 = require("./bots/BotGeneral");
var bots = {
    BigBrowser: BotBigBrowser_1.BotBigBrowser,
    General: BotGeneral_1.BotGeneral
};
var botClass = bots[process.env.APP_SELECTOR];
if (!botClass) {
    console.error("No APP called \"" + process.env.APP_SELECTOR + "\"; check env variable APP_SELECTOR (allowed: " + Object.keys(bots) + ")");
    process.exit();
}
var bot = new botClass({
    token: process.env.TOKEN
});
bot.debug = fs.existsSync('./env.json');
console.log('Debug mode:', bot.debug ? 'on' : 'off');
globals_1.initialize(bot);
bot.start();
