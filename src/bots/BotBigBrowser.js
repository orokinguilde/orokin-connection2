"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotBigBrowser = void 0;
var BigBrowserV2_1 = require("../BigBrowserV2");
var discord_js_1 = require("discord.js");
var ScheduledEvent_1 = require("../ScheduledEvent");
var Bot_1 = require("../Bot");
var moment = require("moment-timezone");
var bannerTemplates = require('../BannerTemplate');
var BigBrowser = require('../BigBrowser');
var globals = require('../globals');
var Banner = require('../Banner');
var BotBigBrowser = /** @class */ (function (_super) {
    __extends(BotBigBrowser, _super);
    function BotBigBrowser(options) {
        var _this = _super.call(this, options) || this;
        _this.xpBonusScheduledEvents = [];
        _this.bigBrowser = new BigBrowser();
        _this.bigBrowserV2 = new BigBrowserV2_1.BigBrowserV2();
        return _this;
    }
    BotBigBrowser.prototype.save = function () {
        return {
            bigBrowser: this.bigBrowser.save(),
            bigBrowserV2: this.bigBrowserV2.save(),
            xpBonusScheduledEvents: this.xpBonusScheduledEvents.map(function (item) { return item.save(); })
        };
    };
    BotBigBrowser.prototype._load = function (obj, ctx) {
        var _this = this;
        if (obj.bigBrowser) {
            this.bigBrowser.load(obj.bigBrowser, ctx);
        }
        if (obj.bigBrowserV2) {
            this.bigBrowserV2.load(obj.bigBrowserV2, ctx);
        }
        if (obj.xpBonusScheduledEvents) {
            this.xpBonusScheduledEvents = obj.xpBonusScheduledEvents.map(function (item) { return new ScheduledEvent_1.XPBonusScheduledEvent(_this.client.guilds.find(function (c) { return c.id === item.guildId; }), _this.bigBrowserV2, item); });
        }
    };
    BotBigBrowser.getRandomColor = function () {
        var colors = [
            '#01FEDC',
            '#FE0101',
            '#FE6F01',
            '#FEF601',
            '#6FFE01',
            '#1201FE',
            '#7F01FE',
            '#FE01C3',
            '#0166FE',
            '#FE0177'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    };
    BotBigBrowser.prototype.onMessage = function (message, checkForCommand, params) {
        var _this = this;
        if (!message.author.bot)
            this.bigBrowser.increaseTextActivity(message.guild, message.author, 0.5);
        this.bigBrowserV2.updateUserText(message);
        /*
        const setCommonSetting = (message, callback) => {
            BotBigBrowser.adminOnly(message, () => {
                callback();

                message.delete();
                globals.saver.save();
            });
        }*/
        if (checkForCommand(/^\s*!ranks$/img)) {
            var user = this.bigBrowserV2.getUser(message.member);
            var exp_1 = user.stats.xp;
            var userRank_1 = user.stats.rank;
            var msg = message.member + ", voici la liste des rangs disponibles :\r\n" + Object.keys(BigBrowserV2_1.BigBrowserV2.ranks)
                .map(function (key) { return BigBrowserV2_1.BigBrowserV2.ranks[key]; })
                .map(function (rank) { return "`[" + globals.padN(rank.start, 4) + ", " + globals.padN(rank.end || '∞', 4) + "[ " + rank.name + "`" + (rank === userRank_1.currentRank ? " \u21E6 **" + message.member.displayName + "**, tu es ici avec **" + Math.floor(exp_1) + " exp** !" : ''); })
                .join('\r\n');
            message.delete();
            message.channel.send(msg);
        }
        else if (checkForCommand(/^\s*!rank templates$/img)) {
            var msg = message.member + ", voici la liste des templates disponibles (`!rank template ...`) :\r\n" + bannerTemplates.list.map(function (bannerTemplate) {
                return "**" + bannerTemplate.key + ".** " + bannerTemplate.name;
            }).join('\r\n');
            message.delete();
            message.channel.send(msg);
        }
        else if (checkForCommand(/^\s*!rank template (.+)$/img)) {
            var name_1 = /^\s*!rank template (.+)$/img.exec(message.content)[1].trim().toLowerCase();
            var user = this.bigBrowserV2.getUser(message.member);
            var template = undefined;
            for (var _i = 0, _a = bannerTemplates.list; _i < _a.length; _i++) {
                var templateItem = _a[_i];
                if (templateItem.key.toString().toLowerCase() == name_1) {
                    template = templateItem;
                    break;
                }
            }
            if (!template) {
                for (var _b = 0, _c = bannerTemplates.list; _b < _c.length; _b++) {
                    var templateItem = _c[_b];
                    if (templateItem.name.toString().toLowerCase().indexOf(name_1) > -1) {
                        template = templateItem;
                        break;
                    }
                }
            }
            if (!template) {
                for (var _d = 0, _e = bannerTemplates.list; _d < _e.length; _d++) {
                    var templateItem = _e[_d];
                    if ((templateItem.key + ". " + templateItem.name).toLowerCase().indexOf(name_1) > -1) {
                        template = templateItem;
                        break;
                    }
                }
            }
            if (!template) {
                message.channel.send(message.member + ", le template \"" + name_1 + "\" n'a pas \u00E9t\u00E9 trouv\u00E9 \uD83D\uDE22");
            }
            else {
                user.bannerTemplateKey = template.key;
                message.channel.send(message.member + ", le template \"" + name_1 + "\" t'a \u00E9t\u00E9 assign\u00E9 \uD83D\uDC4D");
                message.delete();
                globals.saver.save();
            }
        }
        else if (checkForCommand(/^\s*!rank\s*$/img)) {
            var user = this.bigBrowserV2.getUser(message.member);
            var voiceExp = user.stats.voiceXp;
            var textExp = user.stats.textXp;
            var ranking = user.stats.rank;
            var rank = this.bigBrowserV2.getUserRanking(user, message.guild);
            var banner = new Banner({
                avatarUrl: message.member.user.avatarURL.replace('?size=2048', '?size=128'),
                nickname: message.member.displayName,
                rankIndex: rank.index,
                rankTotal: rank.total,
                level: ranking.currentRank.index,
                levelName: ranking.currentRank ? ranking.currentRank.name : '?',
                exp: ranking.expInCurrentRank,
                expText: textExp,
                expVocal: voiceExp,
                maxExp: ranking.expFromCurrentToNextRank
            });
            var template = undefined;
            if (user.bannerTemplateKey) {
                template = bannerTemplates.indexed[user.bannerTemplateKey];
            }
            if (!template) {
                template = bannerTemplates.default;
            }
            message.react('🐰');
            banner.createBuffer(template, function (e, buffer) {
                if (e) {
                    console.log(e);
                    message.channel.send("D\u00E9sol\u00E9, une erreur s'est produite lors de la g\u00E9n\u00E9ration de l'image.");
                }
                else {
                    var attachment = new discord_js_1.Attachment(buffer, 'banner.png');
                    message.delete();
                    message.channel.send('', attachment);
                }
            });
            /*
            banner.createStream(template, (e, stream) => {
                if(e)
                {
                    console.log(e);
                    message.channel.send(`Désolé, une erreur s'est produite lors de la génération de l'image.`);
                }
                else
                {
                    message.delete();
                    message.channel.send({
                        files: [{
                            attachment: stream,
                            name: 'ranking.png'
                        }]
                    });
                }
            });*/
        }
        else if (checkForCommand(/^\s*!server\s+rank\s+reset\s*$/img)) {
            BotBigBrowser.adminOnly(message, function () {
                _this.bigBrowserV2.resetDayWeekStats(message.guild);
                message.reply("Les stats viennent d'\u00EAtre r\u00E9initialis\u00E9es.");
            });
        }
        else if (checkForCommand(/^\s*!server\s+rank\s+ranges\s*$/img)) {
            message.reply("```" + this.bigBrowserV2.dayRange.map(function (range) { return "::: " + range.name + " :::\nJours : " + range.days.map(function (j) { return j + 1; }) + "\nD\u00E9but : " + range.start + " h\nFin : " + range.end + " h"; }).reduce(function (p, c) { return p + "\n\n" + c; }, '').trim() + "```");
        }
        else if (checkForCommand(/^\s*!server\s+rank\s+range\s+([a-zA-Z0-9]+)\s+(\d+)\s+(\d+)\s*$/img)) {
            BotBigBrowser.adminOnly(message, function () {
                var regex = /^\s*!server\s+rank\s+range\s+([a-zA-Z0-9]+)\s+(\d+)\s+(\d+)\s*$/img;
                var _a = regex.exec(message.content), name = _a[1], startStr = _a[2], endStr = _a[3];
                var start = parseInt(startStr);
                var end = parseInt(endStr);
                if (isNaN(start) || isNaN(end)) {
                    message.reply('Paramètres invalides. Exemple : !server rank range Semaine 9 23');
                }
                else {
                    var range = _this.bigBrowserV2.dayRange.find(function (range) { return range.name.toLowerCase().includes(name.toLowerCase().trim()); });
                    if (!range) {
                        message.reply("Impossible de trouver la plage \"" + name.trim() + "\"");
                    }
                    else {
                        range.start = start;
                        range.end = end;
                        globals.saver.save();
                        message.reply("Plage chang\u00E9e : [" + start + " h, " + end + " h]");
                    }
                }
            });
        }
        else if (checkForCommand(/^\s*!server\s+(last\s+)?rank(\s+\d+)?\s*$/img)) {
            console.log('SERVER RANK');
            var _f = /^\s*!server\s+(last\s+)?rank(\s+\d+)?\s*$/img.exec(message.content), getLast = _f[1], nbRosterStr = _f[2];
            var nbRoster = nbRosterStr && parseInt(nbRosterStr);
            var result = this.bigBrowserV2.getRosterRanks(message.guild, nbRoster, !!getLast);
            var createStrLine = function (entries) { return entries
                .map(function (u, i) { return u.stats.xp <= 0 ? (i + 1 + ".").padEnd(entries.length.toString().length + 1, ' ') + " -" : (i + 1 + ".").padEnd(entries.length.toString().length + 1, ' ') + " " + (Math.round(u.stats.xp * 100) / 100).toString().padStart(7, ' ') + (Math.round(u.stats.xpBonus * 100) / 100 > 0 ? " BONNUS (" + Math.round(u.stats.xpBonus * 100) / 100 + ")" : '') + " :: " + u.user.userData.displayName; })
                .reduce(function (p, c) { return !p ? c : p + "\n" + c; }, ''); };
            message.delete();
            message.reply('\r\n' + ("```::: Jour :::\n" + createStrLine(result.day) + "\n\n::: Semaine :::\n" + createStrLine(result.week) + "```"));
        }
        else if (checkForCommand(/^\s*!dbinfo\s*$/img)) {
            BotBigBrowser.adminOnly(message, function () {
                var time = _this.saver.dataCreationDate;
                message.reply(process.env.APP_SELECTOR + ' :\nDate de création des données : ' + time + ' | ' + moment(time, 'unix').format('DD/MM/Y HH:mm:ss'));
            });
        }
        else if (checkForCommand(/^\s*!server\s+xp\s*$/img)) {
            console.log('SERVER STATS');
            //const result = this.bigBrowser.getTextSummaryByServer(message.guild);
            var result = this.bigBrowserV2.getServerText(message.guild);
            message.delete();
            message.reply('\r\n' + result);
        }
        else if (checkForCommand(/^\s*!server\s+xp\s+csv\s*$/img)) {
            console.log('SERVER STATS');
            //const result = this.bigBrowser.getTextSummaryByServerCSV(message.guild, true);
            var result = this.bigBrowserV2.getServerCSV(message.guild, true);
            message.delete();
            message.channel.send(new discord_js_1.Attachment(new Buffer(result), 'stats.csv'));
        }
        else if (checkForCommand(/^\s*!server\s+xp\s+md\s*$/img)) {
            console.log('SERVER STATS');
            //const result = this.bigBrowser.getTextSummaryByServer(message.guild);
            var result = this.bigBrowserV2.getServerMarkDown(message.guild);
            message.delete();
            message.channel.send(new discord_js_1.Attachment(new Buffer(result), 'stats.md'));
        }
        else if (checkForCommand(/^\s*!server\s+xp\s+txt\s*$/img)) {
            console.log('SERVER STATS');
            //const result = this.bigBrowser.getTextSummaryByServer(message.guild, false);
            var result = this.bigBrowserV2.getServerText(message.guild);
            message.delete();
            message.channel.send(new discord_js_1.Attachment(new Buffer(result), 'stats.txt'));
        }
        else if (checkForCommand(/^\s*!global\s+xp\s*$/img)) {
            console.log('GLOBAL STATS');
            //const result = this.bigBrowser.getTextSummaryByServer();
            var result = this.bigBrowserV2.getServersText(this.client.guilds.map(function (guild) { return guild; }));
            message.delete();
            message.reply('\r\n' + result);
        }
        else if (checkForCommand(/^\s*!global\s+xp\s+csv\s*$/img)) {
            console.log('GLOBAL STATS DL');
            //const result = this.bigBrowser.getTextSummaryByServerCSV(undefined, true);
            var result = this.bigBrowserV2.getServersCSV(this.client.guilds.map(function (guild) { return guild; }), true);
            message.delete();
            message.channel.send(new discord_js_1.Attachment(new Buffer(result), 'stats.csv'));
        }
        else if (checkForCommand(/^\s*!global\s+xp\s+md\s*$/img)) {
            console.log('GLOBAL STATS DL');
            //const result = this.bigBrowser.getTextSummaryByServer();
            var result = this.bigBrowserV2.getServersMarkDown(this.client.guilds.map(function (guild) { return guild; }));
            message.delete();
            message.channel.send(new discord_js_1.Attachment(new Buffer(result), 'stats.md'));
        }
        else if (checkForCommand(/^\s*!global\s+xp\s+txt\s*$/img)) {
            console.log('GLOBAL STATS DL');
            //const result = this.bigBrowser.getTextSummaryByServer(undefined, false);
            var result = this.bigBrowserV2.getServersText(this.client.guilds.map(function (guild) { return guild; }));
            message.delete();
            message.channel.send(new discord_js_1.Attachment(new Buffer(result), 'stats.txt'));
        }
        else if (checkForCommand(/^\s*!stop\s+server\s+xp\s*$/img)) {
            console.log('STOP SERVER XP');
            this.bigBrowserV2.setTrackingServer(message.guild, false);
            this.bigBrowser.setServerTracking(message.guild, false);
            message.delete();
            message.reply(':small_orange_diamond: arrêt du stockage de l\'expérience du serveur.');
        }
        else if (checkForCommand(/^\s*!start\s+server\s+xp\s*$/img)) {
            console.log('START SERVER XP');
            this.bigBrowserV2.setTrackingServer(message.guild, true);
            this.bigBrowser.setServerTracking(message.guild, true);
            message.delete();
            message.reply(':small_blue_diamond: démarrage du stockage de l\'expérience du serveur.');
        }
        else if (checkForCommand(/^\s*!stop\s+xp\s*$/img)) {
            console.log('STOP XP');
            this.bigBrowserV2.setTrackingUser(message.member, false);
            this.bigBrowser.setTracking(message.guild, message.author, false);
            message.delete();
            message.reply(':small_orange_diamond: arrêt du stockage de ton expérience.');
        }
        else if (checkForCommand(/^\s*!start\s+xp\s*$/img)) {
            console.log('START XP');
            this.bigBrowserV2.setTrackingUser(message.member, true);
            this.bigBrowser.setTracking(message.guild, message.author, true);
            message.delete();
            message.reply(':small_blue_diamond: démarrage du stockage de ton expérience.');
        }
        else if (checkForCommand(/^\s*!xpbonus\s+pop\s*$/img)) {
            BotBigBrowser.adminOnly(message, function () {
                var xpBonusScheduledEvent = _this.xpBonusScheduledEvents.find(function (item) { return item.guild.id === message.guild.id; });
                if (xpBonusScheduledEvent) {
                    xpBonusScheduledEvent.runtime({
                        periodMs: 0
                    });
                    message.reply("Pop !");
                }
            });
        }
        else if (checkForCommand(/^\s*!xpbonus\s+(enable|disable)\s*$/img)) {
            BotBigBrowser.adminOnly(message, function () {
                var action = params[1];
                var xpBonusScheduledEvent = _this.xpBonusScheduledEvents.find(function (item) { return item.guild.id === message.guild.id; });
                if (xpBonusScheduledEvent) {
                    if (action.toLowerCase() === 'enable') {
                        xpBonusScheduledEvent.active = true;
                        message.reply("XP Bonus activ\u00E9");
                    }
                    else {
                        xpBonusScheduledEvent.active = false;
                        message.reply("XP Bonus d\u00E9sactiv\u00E9");
                    }
                }
            });
        }
        else if (checkForCommand(/^\s*!xpbonus\s+config\s*$/img)) {
            var propNames = ['messageTimeoutSec', 'periodMsMin', 'periodMsMax', 'xpBonusOnPopUp', 'xpBonusOnReact'];
            var xpBonusScheduledEvent_1 = this.xpBonusScheduledEvents.find(function (item) { return item.guild.id === message.guild.id; });
            if (xpBonusScheduledEvent_1) {
                message.reply("```active = " + (xpBonusScheduledEvent_1.active ? 'oui' : 'non') + "\n" + propNames.map(function (propName) { return propName + " = " + xpBonusScheduledEvent_1[propName]; }).reduce(function (p, c) { return p + '\n' + c; }).trim() + "```");
            }
        }
        else if (checkForCommand(/^\s*!xpbonus\s+config\s+(messageTimeoutSec|periodMsMin|periodMsMax|xpBonusOnPopUp|xpBonusOnReact)\s+(\d+(?:\.\d+)?)\s*$/img)) {
            BotBigBrowser.adminOnly(message, function () {
                var propName = params[1], valueStr = params[2];
                var xpBonusScheduledEvent = _this.xpBonusScheduledEvents.find(function (item) { return item.guild.id === message.guild.id; });
                if (xpBonusScheduledEvent) {
                    xpBonusScheduledEvent[propName] = parseFloat(valueStr);
                    message.reply("Modification confirm\u00E9e\n```" + propName + " = " + xpBonusScheduledEvent[propName] + "```");
                }
            });
        }
        else if (checkForCommand(/^\s*!xpbonus\s+channel\s+(add|remove|list)\s*$/img)) {
            BotBigBrowser.adminOnly(message, function () {
                var _a = /^\s*!xpbonus\s+channel\s+(add|remove|list)\s*$/img.exec(message.content), action = _a[1];
                var xpBonusScheduledEvent = _this.xpBonusScheduledEvents.find(function (item) { return item.guild.id === message.guild.id; });
                if (xpBonusScheduledEvent) {
                    var channel = message.channel;
                    switch (action.toLowerCase().trim()) {
                        case 'add':
                            xpBonusScheduledEvent.addChannel(channel);
                            message.reply("Salon `" + channel.name + "` ajout\u00E9 \u00E0 la liste.");
                            break;
                        case 'remove':
                            xpBonusScheduledEvent.removeChannel(channel);
                            message.reply("Salon `" + channel.name + "` supprim\u00E9 de la liste.");
                            break;
                        case 'list':
                            if (xpBonusScheduledEvent.channels.length === 0) {
                                message.reply('Aucun salon dans la liste.');
                            }
                            else {
                                message.reply(("```::: Channels :::\n                                    " + xpBonusScheduledEvent.channels.map(function (c) { return c.name; }).reduce(function (p, c) { return p + '\n' + c; }, '').trim() + "\n                                ```").replace(/^ +/img, ''));
                            }
                            break;
                    }
                }
            });
        }
        console.log(message.content.trim());
    };
    BotBigBrowser.prototype._initialize = function () {
    };
    BotBigBrowser.prototype.ready = function () {
    };
    BotBigBrowser.prototype.startRuntime = function () {
        var _this = this;
        var updateVoices = function () {
            var voiceChannels = _this.client.channels.filter(function (channel) { return channel.type === 'voice'; }).array();
            for (var _i = 0, voiceChannels_1 = voiceChannels; _i < voiceChannels_1.length; _i++) {
                var voiceChannel = voiceChannels_1[_i];
                if (!/([^a-zA-Z]|^)[aA][fF][kK]([^a-zA-Z]|$)/img.test(voiceChannel.name)) {
                    for (var _a = 0, _b = voiceChannel.members.array(); _a < _b.length; _a++) {
                        var member = _b[_a];
                        if (!member.user.bot && !member.deaf) {
                            _this.bigBrowser.increaseVocalActivity(voiceChannel.guild, member.user, 1 / (30 * 60 * 2));
                            if (member.user.presence && member.user.presence.game && member.user.presence.game.name) {
                                _this.bigBrowser.pingWarframeActivity(voiceChannel.guild, member.user, member.user.presence.game.name.toLowerCase() === 'warframe');
                            }
                        }
                    }
                }
            }
            setTimeout(updateVoices, 500);
        };
        setTimeout(updateVoices, 500);
        var _loop_1 = function (guild) {
            if (!this_1.xpBonusScheduledEvents.some(function (item) { return item.guild.id === guild.id; })) {
                this_1.xpBonusScheduledEvents.push(new ScheduledEvent_1.XPBonusScheduledEvent(guild, this_1.bigBrowserV2));
            }
        };
        var this_1 = this;
        for (var _i = 0, _a = this.client.guilds.array(); _i < _a.length; _i++) {
            var guild = _a[_i];
            _loop_1(guild);
        }
        this.xpBonusScheduledEvents.forEach(function (item) { return item.start(); });
        /*if(this.bigBrowser.servers && Object.keys(this.bigBrowser.servers).length > 0)
            this.bigBrowserV2.initWithV1Data(this.bigBrowser.servers);*/
        var updateServersTimeout = 10000;
        var updateServers = function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all(this.client.guilds.array().map(function (guild) { return _this.bigBrowserV2.updateServer(guild); }))];
                    case 1:
                        _a.sent();
                        setTimeout(updateServers, updateServersTimeout);
                        return [2 /*return*/];
                }
            });
        }); };
        setTimeout(updateServers, updateServersTimeout);
    };
    return BotBigBrowser;
}(Bot_1.IBot));
exports.BotBigBrowser = BotBigBrowser;
