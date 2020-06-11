import * as moment from 'moment-timezone'
import * as fs from 'fs'

moment.locale('fr')

process.env = fs.existsSync('./env.json') ? JSON.parse(fs.readFileSync('./env.json').toString()) : process.env;

import { initialize } from './globals'
import { IBot } from './Bot'
import { BotBigBrowser } from './bots/BotBigBrowser'
import { BotGeneral } from './bots/BotGeneral';

const bots: { [name: string]: new(options: any) => IBot } = {
    BigBrowser: BotBigBrowser,
    General: BotGeneral
}

const botClass = bots[process.env.APP_SELECTOR];

if(!botClass) {
    console.error(`No APP called "${process.env.APP_SELECTOR}"; check env variable APP_SELECTOR (allowed: ${Object.keys(bots)})`);
    process.exit();
}

const bot = new botClass({
    token: process.env.TOKEN
});
bot.debug = fs.existsSync('./env.json');

console.log('Debug mode:', bot.debug ? 'on' : 'off');

initialize(bot);

bot.start();
