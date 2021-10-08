"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
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
exports.BotGeneral = void 0;
var discord_js_1 = require("discord.js");
var Bot_1 = require("../Bot");
var moment = require("moment-timezone");
var config_1 = require("../config");
var Help_1 = require("../Help");
var Application = require('../Application');
var Mentoring = require('../Mentoring');
var MessageThis = require('../Message');
var globals = require('../globals');
var BotGeneral = /** @class */ (function (_super) {
    __extends(BotGeneral, _super);
    function BotGeneral(options) {
        var _this = _super.call(this, options) || this;
        _this.application = new Application(_this, _this.options);
        _this.mentoring = new Mentoring();
        _this.errorCounters = {};
        _this.stops = {
            memberAdd: {},
            memberRemove: {},
            eidolonsWarning: {}
        };
        return _this;
    }
    BotGeneral.prototype.save = function () {
        return {
            application: this.application.save(),
            mentoring: this.mentoring.save(),
            stops: this.stops,
        };
    };
    BotGeneral.prototype._load = function (obj, ctx) {
        if (obj.application) {
            this.application.load(obj.application, ctx);
        }
        if (obj.stops) {
            this.stops = obj.stops;
        }
        if (obj.mentoring) {
            this.mentoring.load(obj.mentoring, ctx);
        }
    };
    BotGeneral.getRandomColor = function () {
        var colors = [
            [0x01, 0xFE, 0xDC],
            [0xFE, 0x01, 0x01],
            [0xFE, 0x6F, 0x01],
            [0xFE, 0xF6, 0x01],
            [0x6F, 0xFE, 0x01],
            [0x12, 0x01, 0xFE],
            [0x7F, 0x01, 0xFE],
            [0xFE, 0x01, 0xC3],
            [0x01, 0x66, 0xFE],
            [0xFE, 0x01, 0x77]
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    };
    BotGeneral.prototype.ocCommand = function (message) {
        MessageThis.deleteMessage(message);
        //let argson = message.content.split(" ").slice(1);
        //let vcsmsg = argson.join(" ")
        var messageContent = message.content;
        if (!message.guild.channels.find('name', 'orokin-connection'))
            return message.reply('Erreur: le channel `orokin connection` est introuvable');
        if (message.channel.name !== 'orokin-connection')
            return message.reply('Commande a effectuer dans `orokin-connection`');
        if (!messageContent)
            return message.reply('Merci d\'envoyer un "message" à envoyer dans la globalité des discords');
        var regex = /@([^@]+)/img;
        var newText = messageContent;
        var match = regex.exec(messageContent);
        while (match && match.length > 1) {
            var nameAndText = match[1];
            for (var _i = 0, _a = this.client.users.valueOf().map(function (u) { return u; }); _i < _a.length; _i++) {
                var user = _a[_i];
                var nameFound = void 0;
                if (nameAndText.indexOf(user.tag) === 0) {
                    nameFound = user.tag;
                }
                else if (nameAndText.indexOf(user.username) === 0) {
                    nameFound = user.username;
                }
                if (nameFound) {
                    while (newText.indexOf("@" + nameFound) !== -1) {
                        newText = newText.replace("@" + nameFound, "<@" + user.id + ">");
                    }
                    break;
                }
            }
            match = regex.exec(messageContent);
        }
        messageContent = newText;
        var embed = new discord_js_1.MessageEmbed()
            .setColor(BotGeneral.getRandomColor())
            .setAuthor(message.guild.name + ' / ' + message.author.username, message.guild.iconURL)
            .setThumbnail('https://media.discordapp.net/attachments/473609056163201024/475828867979018240/Capturecc2.PNG');
        this.client.channels.findAll('name', 'orokin-connection').map(function (channel) {
            console.log('SENDING message to ', channel.guild.name);
            channel.send(embed).then(function () { return channel.send(messageContent); });
        });
    };
    BotGeneral.findTrioTeamRole = function (guild) {
        return guild.roles.find(function (role) { return role.name.toLowerCase().indexOf('trio') >= 0 && role.name.toLowerCase().indexOf('team') >= 0; });
    };
    BotGeneral.prototype.joinTrioCommand = function (message) {
        var role = BotGeneral.findTrioTeamRole(message.guild);
        message.member.addRole(role);
        message.delete();
        message.channel.send(message.author + " a rejoint Trio Team ! :tada: ");
    };
    BotGeneral.prototype.leaveTrioCommand = function (message) {
        var role = BotGeneral.findTrioTeamRole(message.guild);
        message.member.removeRole(role);
        message.delete();
        message.channel.send(message.author + " a quitt\u00E9 Trio Team ! :cry: ");
    };
    BotGeneral.prototype.onMessage = function (message, checkForCommand, params) {
        return __awaiter(this, void 0, void 0, function () {
            var setCommonSetting, mentions, disciple, server_1, str, id, user, server_2, str, id, user, server_3, str, id, user, server, success, unsuccess, id, user, msg, streamer, twitch, msg, streamer, _a, twitch_1, created;
            var _this = this;
            return __generator(this, function (_b) {
                setCommonSetting = function (message, callback) {
                    BotGeneral.adminOnly(message, function () {
                        callback();
                        message.delete();
                    });
                };
                if (checkForCommand(/^\s*!trio\s*$/img)) {
                    this.application.addServerChannel(message.channel);
                    message.delete();
                }
                else if (checkForCommand(/^\s*!mentor .+$/img)) {
                    console.log('MENTOR');
                    mentions = message.mentions.members.map(function (m) { return m; });
                    if (mentions.length === 1) {
                        disciple = mentions[0];
                        if (this.mentoring.setMentor(message.member, disciple)) {
                            message.reply("recrutement enregistr\u00E9 !");
                        }
                        else {
                            message.reply("recrutement refus\u00E9 !");
                        }
                    } /*
                    else if(mentions.length === 2)
                    {
                        const mentor = mentions[0];
                        const disciple = mentions[1];
        
                        if(this.mentoring.setMentor(mentor, disciple))
                        {
                            message.reply(`recrutement enregistré !`);
                            globals.saver.save();
                        }
                        else
                        {
                            message.reply(`recrutement refusé !`);
                        }
                    }*/
                    else {
                        message.reply("tu dois mentionner le/la disciple !");
                    }
                }
                else if (checkForCommand(/^\s*!mentors\s*$/img)) {
                    console.log('MENTORS');
                    server_1 = this.mentoring.getServer(message.guild);
                    str = '';
                    for (id in server_1.users) {
                        user = server_1.users[id];
                        str += user.displayName + " | " + Object.keys(user.disciples).length + " " + Object.keys(user.disciples).map(function (id) { return server_1.users[id].displayName; }).join(' - ') + " | " + Object.keys(user.mentors).length + " " + Object.keys(user.mentors).map(function (id) { return server_1.users[id].displayName; }).join(' - ') + " | " + (user.mentoringSuccess ? 'V' : '-') + "\r\n";
                    }
                    message.channel.send(str);
                }
                else if (checkForCommand(/^\s*!mentors pending\s*$/img)) {
                    console.log('MENTORS PENDING');
                    server_2 = this.mentoring.getServer(message.guild);
                    str = '';
                    for (id in server_2.users) {
                        user = server_2.users[id];
                        if (!user.mentoringSuccess) {
                            str += user.displayName + " | " + Object.keys(user.disciples).length + " " + Object.keys(user.disciples).map(function (id) { return server_2.users[id].displayName; }).join(' - ') + " | " + Object.keys(user.mentors).length + " " + Object.keys(user.mentors).map(function (id) { return server_2.users[id].displayName; }).join(' - ') + "\r\n";
                        }
                    }
                    message.channel.send(str);
                }
                else if (checkForCommand(/^\s*!mentors success\s*$/img)) {
                    console.log('MENTORS PENDING');
                    server_3 = this.mentoring.getServer(message.guild);
                    str = '';
                    for (id in server_3.users) {
                        user = server_3.users[id];
                        if (user.mentoringSuccess) {
                            str += user.displayName + " | " + Object.keys(user.disciples).length + " " + Object.keys(user.disciples).map(function (id) { return server_3.users[id].displayName; }).join(' - ') + " | " + Object.keys(user.mentors).length + " " + Object.keys(user.mentors).map(function (id) { return server_3.users[id].displayName; }).join(' - ') + "\r\n";
                        }
                    }
                    message.channel.send(str);
                }
                else if (checkForCommand(/^\s*!mentoring\s*$/img)) {
                    console.log('MENTORING');
                    server = this.mentoring.getServer(message.guild);
                    success = 0;
                    unsuccess = 0;
                    for (id in server.users) {
                        user = server.users[id];
                        if (user.mentoringSuccess) {
                            ++success;
                        }
                        else {
                            ++unsuccess;
                        }
                    }
                    message.channel.send("**" + success + "** chaine(s) de recrutement r\u00E9ussie(s) / **" + (unsuccess + success) + "** chaine(s) au total (**" + unsuccess + "** en attente)\r\n**" + Math.round(success / (unsuccess + success) * 10000) / 100 + "%** de r\u00E9ussite");
                }
                else if (checkForCommand(/^\s*!dbinfo\s*$/img)) {
                    BotGeneral.adminOnly(message, function () {
                        var time = _this.saver.dataCreationDate;
                        message.reply(process.env.APP_SELECTOR + ' :\nDate de création des données : ' + time + ' | ' + moment(time, 'unix').format('DD/MM/Y HH:mm:ss'));
                    });
                }
                else if (checkForCommand(/^\s*!nonotif\s+memberadd\s*$/img)) {
                    setCommonSetting(message, function () {
                        _this.stops.memberAdd[message.guild.id] = true;
                        message.reply(':small_orange_diamond: Désactivation des notifications lorsqu\'un membre rejoint le clan');
                    });
                }
                else if (checkForCommand(/^\s*!notif\s+memberadd\s*$/img)) {
                    setCommonSetting(message, function () {
                        delete _this.stops.memberAdd[message.guild.id];
                        message.reply(':small_blue_diamond: Activation des notifications lorsqu\'un membre rejoint le clan');
                    });
                }
                else if (checkForCommand(/^\s*!nonotif\s+memberleave\s*$/img)) {
                    setCommonSetting(message, function () {
                        _this.stops.memberRemove[message.guild.id] = true;
                        message.reply(':small_orange_diamond: Désactivation des notifications lorsqu\'un membre quitte le clan');
                    });
                }
                else if (checkForCommand(/^\s*!notif\s+memberleave\s*$/img)) {
                    setCommonSetting(message, function () {
                        delete _this.stops.memberRemove[message.guild.id];
                        message.reply(':small_blue_diamond: Activation des notifications lorsqu\'un membre quitte le clan');
                    });
                }
                else if (checkForCommand(/^\s*!nonotif\s+eidolonswarning\s*$/img)) {
                    setCommonSetting(message, function () {
                        _this.stops.eidolonsWarning[message.guild.id] = true;
                        message.reply(':small_orange_diamond: Désactivation des notifications pour les Eidolons');
                    });
                }
                else if (checkForCommand(/^\s*!notif\s+eidolonswarning\s*$/img)) {
                    setCommonSetting(message, function () {
                        delete _this.stops.eidolonsWarning[message.guild.id];
                        message.reply(':small_blue_diamond: Activation des notifications pour les Eidolons');
                    });
                }
                else if (checkForCommand(Help_1.Help.instance.regex)) {
                    Help_1.Help.instance.manageMessage(message, params[1]);
                }
                else if (checkForCommand(/^\s*!(?:join|rejoindre)\s+trio\s*$/img)) {
                    this.joinTrioCommand(message);
                }
                else if (checkForCommand(/^\s*!(?:leave|quitter)\s+trio\s*$/img)) {
                    this.leaveTrioCommand(message);
                }
                else if (checkForCommand(/^\s*!twitch\s+remove\s*.+$/img)) {
                    console.log('TWITCH REMOVE');
                    msg = message.content.trim();
                    streamer = msg.split(' ', 2)[1];
                    twitch = this.application.removeTwitch(streamer);
                    if (twitch) {
                        twitch.delete();
                        message.channel.send("Le message du twitch `" + twitch.streamer + "` a \u00E9t\u00E9 supprim\u00E9");
                    }
                    else {
                        message.channel.send("Pas de message du twitch `" + streamer + "` a supprimer");
                    }
                }
                else if (checkForCommand(/^\s*!twitch\s*.+$/img)) {
                    console.log('TWITCH');
                    msg = message.content.trim();
                    streamer = msg.split(' ', 2)[1];
                    _a = this.application.addTwitch(streamer, message.channel, message), twitch_1 = _a.twitch, created = _a.created;
                    if (created) {
                        twitch_1.update();
                    }
                    else {
                        twitch_1.isLive(function (isLive) {
                            message.channel.send("Le twitch existe deja sur le channel `" + twitch_1.message.channel.name + "` ! (`" + twitch_1.streamer + "` " + (isLive ? 'est en live' : 'n\'est pas en live') + ")");
                        });
                    }
                } /*
                else if(checkForCommand(/^\s*![twitch]+\s*.+$/img))
                {
                    const msg = message.content.trim();
                    const streamer = msg.split(' ', 2)[1];
        
                    message.reply('Tu voulais dire `!twitch ' + streamer + '`?');
                }*/
                else if (message.author.id !== this.client.user.id && message.channel.name === 'orokin-connection') {
                    this.ocCommand(message);
                }
                console.log(message.content.trim());
                return [2 /*return*/];
            });
        });
    };
    BotGeneral.prototype._initialize = function () {
        var _this = this;
        this.client.on('guildMemberAdd', function (member) {
            console.log('GA');
            if (!_this.stops.memberRemove[member.guild.id]) {
                var channelGeneral = BotGeneral.findGeneralChannel(member.guild.channels.valueOf().map(function (g) { return g; }));
                if (channelGeneral) {
                    console.log('SENDING WELCOME');
                    channelGeneral.send(" Bienvenue " + member + " ! have fun :wink: !");
                }
            }
        });
        this.client.on('guildMemberRemove', function (member) {
            console.log('guildMemberRemove');
            if (!_this.stops.memberRemove[member.guild.id]) {
                member.createDM().then(function (channel) {
                    console.log('SENDING BYE BYE');
                    return channel.send('hey! ben c\'est dommage de partir :( bonne continuation ...');
                });
            }
        });
    };
    BotGeneral.prototype.ready = function () {
        var _this = this;
        setTimeout(function () {
            _this.client.user.setAvatar("./server/" + process.env.SERVER_FOLDER_NAME + "/icon.png").catch(function () { });
        }, 5000);
        this.client.user.setActivity(config_1.default.server.info.activity);
    };
    BotGeneral.prototype._startRuntime = function () {
        this.application.start();
    };
    return BotGeneral;
}(Bot_1.IBot));
exports.BotGeneral = BotGeneral;
