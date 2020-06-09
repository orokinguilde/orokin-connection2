"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bot = void 0;
var BigBrowserV2_1 = require("./BigBrowserV2");
var discord_js_1 = require("discord.js");
var ScheduledEvent_1 = require("./ScheduledEvent");
var bannerTemplates = require('./BannerTemplate');
var Application = require('./Application');
var BigBrowser = require('./BigBrowser');
var Mentoring = require('./Mentoring');
var Discord = require('discord.js');
var Message = require('./Message');
var globals = require('./globals');
var Banner = require('./Banner');
var util = require('util');
var Bot = /** @class */ (function () {
    function Bot(options) {
        var _this = this;
        this.debug = false;
        this.xpBonusScheduledEvents = [];
        if (!options)
            options = {};
        this.options = options;
        this.application = new Application(this, this.options);
        this.bigBrowser = new BigBrowser();
        this.bigBrowserV2 = new BigBrowserV2_1.BigBrowserV2();
        this.mentoring = new Mentoring();
        this.errorCounters = {};
        this.stops = {
            memberAdd: {},
            memberRemove: {},
            eidolonsWarning: {}
        };
        if (!this.noAutoInitialization)
            this.initialize();
        var lasts = {};
        var totals = {};
        setInterval(function () {
            var _a;
            var objs = {
                application: _this.application,
                bigBrowser: _this.bigBrowser,
                bigBrowserV2: _this.bigBrowserV2,
                mentoring: _this.mentoring,
                errorCounters: _this.errorCounters,
                stops: _this.stops,
                xpBonusScheduledEvents: _this.xpBonusScheduledEvents,
                saver: globals.saver,
                client: _this.client
            };
            console.log('************************************* MEM STAT **');
            for (var name_1 in objs) {
                var obj = objs[name_1];
                var str = util.inspect(obj, {
                    depth: name_1 === 'client' ? 4 : 5
                });
                var value = str.length;
                if (lasts[name_1] !== undefined) {
                    totals[name_1] = ((_a = totals[name_1]) !== null && _a !== void 0 ? _a : 0) + (value - lasts[name_1]);
                }
                console.log(name_1 + ':', value, lasts[name_1] !== undefined ? "(" + lasts[name_1] + " | " + (value - lasts[name_1]) + ")" : '', totals[name_1] !== undefined ? "(total: " + totals[name_1] + ")" : '');
                lasts[name_1] = value;
            }
            console.log('*************************************************');
        }, 5000);
    }
    Bot.prototype.save = function () {
        return {
            application: this.application.save(),
            bigBrowser: this.bigBrowser.save(),
            bigBrowserV2: this.bigBrowserV2.save(),
            mentoring: this.mentoring.save(),
            stops: this.stops,
            xpBonusScheduledEvents: this.xpBonusScheduledEvents.map(function (item) { return item.save(); })
        };
    };
    Bot.prototype.load = function (obj) {
        var _this = this;
        var ctx = {
            bot: this
        };
        this.application.load(obj.application, ctx);
        this.stops = obj.stops;
        if (obj.bigBrowser)
            this.bigBrowser.load(obj.bigBrowser, ctx);
        if (obj.bigBrowserV2) {
            this.bigBrowserV2.load(obj.bigBrowserV2, ctx);
        }
        if (obj.mentoring)
            this.mentoring.load(obj.mentoring, ctx);
        if (obj.xpBonusScheduledEvents) {
            this.xpBonusScheduledEvents = obj.xpBonusScheduledEvents.map(function (item) { return new ScheduledEvent_1.XPBonusScheduledEvent(_this.client.guilds.find(function (c) { return c.id === item.guildId; }), _this.bigBrowserV2, item); });
        }
    };
    Bot.prototype.start = function (token) {
        this.client.login(token || this.options.token);
    };
    Bot.getRandomColor = function () {
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
    Bot.prototype.ocCommand = function (message) {
        Message.deleteMessage(message);
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
            for (var _i = 0, _a = this.client.users.array(); _i < _a.length; _i++) {
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
        var embed = new Discord.RichEmbed()
            .setColor(Bot.getRandomColor())
            .setAuthor(message.guild.name + ' / ' + message.author.username, message.guild.iconURL)
            .setThumbnail('https://media.discordapp.net/attachments/473609056163201024/475828867979018240/Capturecc2.PNG');
        this.client.channels.findAll('name', 'orokin-connection').map(function (channel) {
            console.log('SENDING message to ', channel.guild.name);
            channel.send(embed).then(function () { return channel.send(messageContent); });
        });
    };
    Bot.findTrioTeamRole = function (guild) {
        return guild.roles.find(function (role) { return role.name.toLowerCase().indexOf('trio') >= 0 && role.name.toLowerCase().indexOf('team') >= 0; });
    };
    Bot.prototype.joinTrioCommand = function (message) {
        var role = Bot.findTrioTeamRole(message.guild);
        message.member.addRole(role);
        message.delete();
        message.channel.send(message.author + " a rejoint Trio Team ! :tada: ");
    };
    Bot.prototype.leaveTrioCommand = function (message) {
        var role = Bot.findTrioTeamRole(message.guild);
        message.member.removeRole(role);
        message.delete();
        message.channel.send(message.author + " a quitt\u00E9 Trio Team ! :cry: ");
    };
    Bot.prototype.helpCommand = function (message, group) {
        var authorIcon = 'https://media.discordapp.net/attachments/473609056163201024/475758769402544128/embleme_alliance.png?width=50&height=50';
        var embed = new Discord.RichEmbed()
            .setColor(Bot.getRandomColor())
            .setThumbnail('https://cdn.discordapp.com/attachments/473609056163201024/479491701853913095/Help.png');
        if (!group) {
            embed
                .setAuthor('Help me!', authorIcon)
                .addField('Tridolon', '`trio`, `join trio`, `leave trio`, `nonotif eidolonswarning`,\r\n`notif eidolonswarning`\r\n\r\n*Plus de détails :* `!helpme tridolon`\r\n¯¯¯¯¯¯¯¯¯¯¯¯¯¯')
                .addField('Membres', '`nonotif memberadd`, `notif memberadd`, `nonotif memberleave`,\r\n`notif memberleave`\r\n\r\n*Plus de détails :* `!helpme membres`\r\n¯¯¯¯¯¯¯¯¯¯¯¯¯¯')
                .addField('Twitch', '`twitch <name>`, `twitch remove <name>`\r\n\r\n*Plus de détails :* `!helpme twitch`\r\n¯¯¯¯¯¯¯¯¯¯¯¯¯¯')
                .addField('XP Vocal/Textuel', '`rank`, `rank templates`, `rank template <name>`, `ranks`, `server xp`, `server xp md`, `server xp csv`, `server xp txt`,\r\n`start server xp`, `stop server xp`, `start xp`, `stop xp`\r\n\r\n*Plus de détails :* `!helpme xp`\r\n¯¯¯¯¯¯¯¯¯¯¯')
                .addField('Leaderboard', '`server rank <nb>`, `server last rank <nb>`, `server rank reset`, `server rank ranges`, `server rank range <name> <start> <end>`\r\n\r\n*Plus de détails :* `!helpme leaderboard`\r\n¯¯¯¯¯¯¯¯¯¯¯')
                .addField('XP Bonus', '`xpbonus <enable|disable>`, `xpbonus pop`, `xpbonus config <messageTimeoutSec|periodMsMin|periodMsMax|xpBonusOnPopUp|xpBonusOnReact> <value>`, `xpbonus config`, `xpbonus channel <add|remove|list>`\r\n\r\n*Plus de détails :* `!helpme xpbonus`\r\n¯¯¯¯¯¯¯¯¯¯¯')
                .setDescription('**Utilisation** : `!<ma_commande>`');
        }
        else if (group.toLowerCase() === 'xpbonus') {
            embed
                .setAuthor('XP Bonus\r\n¯¯¯¯¯¯¯¯', authorIcon)
                .setThumbnail('https://media.discordapp.net/attachments/514178068835860498/718771841476460604/XP-bonus_1.gif')
                .setDescription("\n    :small_orange_diamond: **!xpbonus <enable|disable>** | Active ou d\u00E9sactive l'XP Bonus\n    :small_orange_diamond: **!xpbonus config <messageTimeoutSec|periodMsMin|periodMsMax|xpBonusOnPopUp|xpBonusOnReact> <value>** | Modifie la configuration\n    :small_blue_diamond: **!xpbonus config** | Affiche la configuration\n    :small_orange_diamond: **!xpbonus channel <add|remove|list>** | Ajoute/supprime/liste les salons\n    :small_orange_diamond: **!xpbonus pop** | Fait apparaitre manuellement le bonus dans un salon de la liste".trim());
        }
        else if (group.toLowerCase() === 'leaderboard') {
            embed
                .setAuthor('Leaderboard\r\n¯¯¯¯¯¯¯¯', authorIcon)
                .setThumbnail('https://media.discordapp.net/attachments/514178068835860498/718771841476460604/XP-bonus_1.gif')
                .setDescription("\n    :small_blue_diamond: **!server rank <nb>** | Affiche le leaderboard\n    :small_blue_diamond: **!server last rank <nb>** | Affiche le leaderboard de la derni\u00E8re fois (jour dernier et semaine derni\u00E8re)\n    :small_orange_diamond: **!server rank reset** | R\u00E9initialise le leaderboard\n    :small_blue_diamond: **!server rank ranges** | Affiche les plages horaires pour recevoir de l'exp\n    :small_orange_diamond: **!server rank range <name> <start> <end>** | Modifie une plage horaire".trim());
        }
        else if (group.toLowerCase() === 'tridolon') {
            embed
                .setAuthor('Tridolon\r\n¯¯¯¯¯¯¯¯', authorIcon)
                .setThumbnail('https://cdn.discordapp.com/attachments/473609056163201024/479613651918127114/Teralyst_1.png')
                .setDescription("\n    :small_blue_diamond: **!trio** | Affiche les informations sur le trio\n    :small_blue_diamond: **!join trio** | Rejoindre le role @Trio Team\n    :small_orange_diamond: **!leave trio** | Quitter le role @Trio Team\n    :small_orange_diamond: **!nonotif eidolonswarning** | D\u00E9sactive les notifications de l'arriv\u00E9e des Eidolons\n    :small_blue_diamond: **!notif eidolonswarning** | Active les notifications de l'arriv\u00E9e des Eidolons".trim());
        }
        else if (group.toLowerCase() === 'membres') {
            embed
                .setAuthor('Membres\r\n¯¯¯¯¯¯¯¯¯', authorIcon)
                .setThumbnail('https://cdn.discordapp.com/attachments/473609056163201024/479619902161027072/unnamed3.png')
                .setDescription("\n    :small_blue_diamond: **!notif memberadd** | Active les notifications lors de l'ajout d'un nouveau membre\n    :small_orange_diamond: **!nonotif memberadd** | D\u00E9sactive les notifications lors de l'ajout d'un nouveau membre\n    :small_blue_diamond: **!notif memberleave** | Active les notifications lorsqu'un membre quitte le clan\n    :small_orange_diamond: **!nonotif memberleave** | D\u00E9sactive les notifications lorsqu'un membre quitte le clan".trim());
        }
        else if (group.toLowerCase() === 'twitch') {
            embed
                .setAuthor('Twitch\r\n¯¯¯¯¯¯¯', authorIcon)
                .setThumbnail('https://cdn.discordapp.com/attachments/473609056163201024/479614334805213185/1280px-Twitch_logo.png')
                .setDescription("\n    :small_blue_diamond: **!twitch** <name> | Obtenir des informations sur une chaine Twitch\n    :small_orange_diamond: **!twitch remove** <name> | Supprime un message Twitch pr\u00E9c\u00E9dement ajout\u00E9".trim());
        }
        else if (group.toLowerCase() === 'xp') {
            embed
                .setAuthor('XP Vocal/Textuel\r\n¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯', authorIcon)
                .setThumbnail('https://cdn.discordapp.com/attachments/473609056163201024/479614949220548610/xp-logo.png')
                .setDescription("\n    :small_blue_diamond: **!rank** | Affiche l'exp\u00E9rience de l'utilisateur\n    :small_blue_diamond: **!rank templates** | Affiche la liste des templates\n    :small_blue_diamond: **!rank template <name>** | S\u00E9lectionne un template\n    :small_blue_diamond: **!ranks** | Affiche la liste des rangs\n    :small_blue_diamond: **!server xp** | Affiche les statistiques du serveur\n    :small_blue_diamond: **!server xp md** | T\u00E9l\u00E9charge les stats du serveur au format [MD](https://www.commentcamarche.net/download/telecharger-34055333-notepad)\n    :small_blue_diamond: **!server xp csv** | T\u00E9l\u00E9charge les stats du serveur au format [CSV](https://www.commentcamarche.net/download/telecharger-209-excel-viewer)\n    :small_blue_diamond: **!server xp txt** | T\u00E9l\u00E9charge les stats du serveur au format TXT\n    :small_blue_diamond: **!start server xp** | D\u00E9marre le stockage de l'exp du serveur\n    :small_orange_diamond: **!stop server xp** | Arr\u00EAte le stockage de l'exp du serveur\n    :small_blue_diamond: **!start xp** | D\u00E9marre le stockage de l'exp\u00E9rience\n    :small_orange_diamond: **!stop xp** | Arr\u00EAte le stockage de l'exp\u00E9rience".trim());
        }
        message.delete();
        message.channel.send(embed);
    };
    Bot.findGeneralChannel = function (channels) {
        var channelNames = [
            /^[^a-zA-Z0-9]*g[eé]n[eé]ral[^a-zA-Z0-9]*$/img,
            /^[^a-zA-Z0-9]*discussion[^a-zA-Z0-9]*$/img,
            /^[^a-zA-Z0-9]*warframe[^a-zA-Z0-9]*$/img
        ];
        var matchingChannels = channels
            .filter(function (channel) { return channel.constructor.name === 'TextChannel'; })
            .filter(function (channel) { return channelNames.some(function (regex) { return regex.test(channel.name); }); })
            .array();
        if (matchingChannels.length > 0) {
            var firstMatchingChannel = matchingChannels[0];
            return firstMatchingChannel;
        }
        else {
            return undefined;
        }
    };
    Bot.isAdmin = function (member) {
        return member.hasPermission('ADMINISTRATOR');
    };
    Bot.adminOnly = function (message, callback) {
        if (Bot.isAdmin(message.member)) {
            callback();
        }
        else {
            message.reply(':small_orange_diamond: Tu n\'as pas les droits pour cette commande');
        }
    };
    Bot.prototype.initialize = function () {
        var _this = this;
        var client = new discord_js_1.Client();
        this.client = client;
        var managerRoleByMessage = function (message, user, callback) {
            if (message.message.channel.name === 'éditez-vos-grades' || message.message.channel.id.toString() === '532671748059955200') {
                var guild = message.message.guild;
                guild.fetchMember(user).then(function (member) {
                    callback(member, message.message.mentions.roles);
                }).catch(function () { });
            }
        };
        client.on('messageReactionAdd', function (message, user) {
            managerRoleByMessage(message, user, function (member, roles) {
                member.addRoles(roles);
            });
        });
        client.on('messageReactionRemove', function (message, user) {
            managerRoleByMessage(message, user, function (member, roles) {
                member.removeRoles(roles);
            });
        });
        client.on('raw', function (packet) {
            // We don't want this to run on unrelated packets
            if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t))
                return;
            // Grab the channel to check the message from
            var channel = client.channels.get(packet.d.channel_id);
            // There's no need to emit if the message is cached, because the event will fire anyway for that
            if (channel.messages.has(packet.d.message_id))
                return;
            // Since we have confirmed the message is not cached, let's fetch it
            channel.fetchMessage(packet.d.message_id).then(function (message) {
                // Emojis can have identifiers of name:id format, so we have to account for that case as well
                var emoji = packet.d.emoji.id ? packet.d.emoji.name + ":" + packet.d.emoji.id : packet.d.emoji.name;
                // This gives us the reaction we need to emit the event properly, in top of the message object
                var reaction = message.reactions.get(emoji);
                // Check which type of event it is before emitting
                if (packet.t === 'MESSAGE_REACTION_ADD') {
                    client.emit('messageReactionAdd', reaction, client.users.get(packet.d.user_id));
                }
                if (packet.t === 'MESSAGE_REACTION_REMOVE') {
                    client.emit('messageReactionRemove', reaction, client.users.get(packet.d.user_id));
                }
            });
        });
        client.on('message', function (message) {
            var params;
            var checkForCommand = function (regexCmd) {
                params = regexCmd.exec(message.content);
                return !!params;
            };
            if (!message.author.bot)
                _this.bigBrowser.increaseTextActivity(message.guild, message.author, 0.5);
            _this.bigBrowserV2.updateUserText(message);
            if (_this.debug) {
                if (message.content[0] !== '@')
                    return;
                message.content = message.content.slice(1);
            }
            var setCommonSetting = function (message, callback) {
                Bot.adminOnly(message, function () {
                    callback();
                    message.delete();
                    globals.saver.save();
                });
            };
            if (checkForCommand(/^\s*!trio\s*$/img)) {
                _this.application.addServerChannel(message.channel);
                message.delete();
                globals.saver.save();
            }
            else if (checkForCommand(/^\s*!mentor .+$/img)) {
                console.log('MENTOR');
                var mentions = message.mentions.members.array();
                if (mentions.length === 1) {
                    var disciple = mentions[0];
                    if (_this.mentoring.setMentor(message.member, disciple)) {
                        message.reply("recrutement enregistr\u00E9 !");
                        globals.saver.save();
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
                var server_1 = _this.mentoring.getServer(message.guild);
                var str = '';
                for (var id in server_1.users) {
                    var user = server_1.users[id];
                    str += user.displayName + " | " + Object.keys(user.disciples).length + " " + Object.keys(user.disciples).map(function (id) { return server_1.users[id].displayName; }).join(' - ') + " | " + Object.keys(user.mentors).length + " " + Object.keys(user.mentors).map(function (id) { return server_1.users[id].displayName; }).join(' - ') + " | " + (user.mentoringSuccess ? 'V' : '-') + "\r\n";
                }
                message.channel.send(str);
            }
            else if (checkForCommand(/^\s*!mentors pending\s*$/img)) {
                console.log('MENTORS PENDING');
                var server_2 = _this.mentoring.getServer(message.guild);
                var str = '';
                for (var id in server_2.users) {
                    var user = server_2.users[id];
                    if (!user.mentoringSuccess) {
                        str += user.displayName + " | " + Object.keys(user.disciples).length + " " + Object.keys(user.disciples).map(function (id) { return server_2.users[id].displayName; }).join(' - ') + " | " + Object.keys(user.mentors).length + " " + Object.keys(user.mentors).map(function (id) { return server_2.users[id].displayName; }).join(' - ') + "\r\n";
                    }
                }
                message.channel.send(str);
            }
            else if (checkForCommand(/^\s*!mentors success\s*$/img)) {
                console.log('MENTORS PENDING');
                var server_3 = _this.mentoring.getServer(message.guild);
                var str = '';
                for (var id in server_3.users) {
                    var user = server_3.users[id];
                    if (user.mentoringSuccess) {
                        str += user.displayName + " | " + Object.keys(user.disciples).length + " " + Object.keys(user.disciples).map(function (id) { return server_3.users[id].displayName; }).join(' - ') + " | " + Object.keys(user.mentors).length + " " + Object.keys(user.mentors).map(function (id) { return server_3.users[id].displayName; }).join(' - ') + "\r\n";
                    }
                }
                message.channel.send(str);
            }
            else if (checkForCommand(/^\s*!mentoring\s*$/img)) {
                console.log('MENTORING');
                var server = _this.mentoring.getServer(message.guild);
                var success = 0;
                var unsuccess = 0;
                for (var id in server.users) {
                    var user = server.users[id];
                    if (user.mentoringSuccess) {
                        ++success;
                    }
                    else {
                        ++unsuccess;
                    }
                }
                message.channel.send("**" + success + "** chaine(s) de recrutement r\u00E9ussie(s) / **" + (unsuccess + success) + "** chaine(s) au total (**" + unsuccess + "** en attente)\r\n**" + Math.round(success / (unsuccess + success) * 10000) / 100 + "%** de r\u00E9ussite");
            }
            else if (checkForCommand(/^\s*!ranks$/img)) {
                var user = _this.bigBrowserV2.getUser(message.member);
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
                var name_2 = /^\s*!rank template (.+)$/img.exec(message.content)[1].trim().toLowerCase();
                var user = _this.bigBrowserV2.getUser(message.member);
                var template = undefined;
                for (var _i = 0, _a = bannerTemplates.list; _i < _a.length; _i++) {
                    var templateItem = _a[_i];
                    if (templateItem.key.toString().toLowerCase() == name_2) {
                        template = templateItem;
                        break;
                    }
                }
                if (!template) {
                    for (var _b = 0, _c = bannerTemplates.list; _b < _c.length; _b++) {
                        var templateItem = _c[_b];
                        if (templateItem.name.toString().toLowerCase().indexOf(name_2) > -1) {
                            template = templateItem;
                            break;
                        }
                    }
                }
                if (!template) {
                    for (var _d = 0, _e = bannerTemplates.list; _d < _e.length; _d++) {
                        var templateItem = _e[_d];
                        if ((templateItem.key + ". " + templateItem.name).toLowerCase().indexOf(name_2) > -1) {
                            template = templateItem;
                            break;
                        }
                    }
                }
                if (!template) {
                    message.channel.send(message.member + ", le template \"" + name_2 + "\" n'a pas \u00E9t\u00E9 trouv\u00E9 \uD83D\uDE22");
                }
                else {
                    user.bannerTemplateKey = template.key;
                    message.channel.send(message.member + ", le template \"" + name_2 + "\" t'a \u00E9t\u00E9 assign\u00E9 \uD83D\uDC4D");
                    message.delete();
                    globals.saver.save();
                }
            }
            else if (checkForCommand(/^\s*!rank\s*$/img)) {
                var user = _this.bigBrowserV2.getUser(message.member);
                var voiceExp = user.stats.voiceXp;
                var textExp = user.stats.textXp;
                var ranking = user.stats.rank;
                var rank = _this.bigBrowserV2.getUserRanking(user, message.guild);
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
                        var attachment = new Discord.Attachment(buffer, 'banner.png');
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
            else if (checkForCommand(/^\s*!(?:help|aide)\s*(?:me|moi)\s*(.*)/img)) {
                var match = /^\s*!(?:help|aide)\s*(?:me|moi)\s*(.*)/img.exec(message.content);
                _this.helpCommand(message, match[1]);
            }
            else if (checkForCommand(/^\s*!(?:join|rejoindre)\s+trio\s*$/img)) {
                _this.joinTrioCommand(message);
            }
            else if (checkForCommand(/^\s*!(?:leave|quitter)\s+trio\s*$/img)) {
                _this.leaveTrioCommand(message);
            }
            else if (checkForCommand(/^\s*!server\s+rank\s+reset\s*$/img)) {
                Bot.adminOnly(message, function () {
                    _this.bigBrowserV2.resetDayWeekStats(message.guild);
                    message.reply("Les stats viennent d'\u00EAtre r\u00E9initialis\u00E9es.");
                });
            }
            else if (checkForCommand(/^\s*!server\s+rank\s+ranges\s*$/img)) {
                message.reply("```" + _this.bigBrowserV2.dayRange.map(function (range) { return "::: " + range.name + " :::\n    Jours : " + range.days.map(function (j) { return j + 1; }) + "\n    D\u00E9but : " + range.start + " h\n    Fin : " + range.end + " h"; }).reduce(function (p, c) { return p + "\n\n" + c; }, '').trim() + "```");
            }
            else if (checkForCommand(/^\s*!server\s+rank\s+range\s+([a-zA-Z0-9]+)\s+(\d+)\s+(\d+)\s*$/img)) {
                Bot.adminOnly(message, function () {
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
                var result = _this.bigBrowserV2.getRosterRanks(message.guild, nbRoster, !!getLast);
                var createStrLine = function (entries) { return entries
                    .map(function (u, i) { return u.stats.xp <= 0 ? (i + 1 + ".").padEnd(entries.length.toString().length + 1, ' ') + " -" : (i + 1 + ".").padEnd(entries.length.toString().length + 1, ' ') + " " + (Math.round(u.stats.xp * 100) / 100).toString().padStart(7, ' ') + (Math.round(u.stats.xpBonus * 100) / 100 > 0 ? " BONNUS (" + Math.round(u.stats.xpBonus * 100) / 100 + ")" : '') + " :: " + u.user.userData.displayName; })
                    .reduce(function (p, c) { return !p ? c : p + "\n" + c; }, ''); };
                message.delete();
                message.reply('\r\n' + ("```::: Jour :::\n" + createStrLine(result.day) + "\n\n::: Semaine :::\n" + createStrLine(result.week) + "```"));
            }
            else if (checkForCommand(/^\s*!server\s+xp\s*$/img)) {
                console.log('SERVER STATS');
                //const result = this.bigBrowser.getTextSummaryByServer(message.guild);
                var result = _this.bigBrowserV2.getServerText(message.guild);
                message.delete();
                message.reply('\r\n' + result);
            }
            else if (checkForCommand(/^\s*!server\s+xp\s+csv\s*$/img)) {
                console.log('SERVER STATS');
                //const result = this.bigBrowser.getTextSummaryByServerCSV(message.guild, true);
                var result = _this.bigBrowserV2.getServerCSV(message.guild, true);
                message.delete();
                message.channel.send(new Discord.Attachment(new Buffer(result), 'stats.csv'));
            }
            else if (checkForCommand(/^\s*!server\s+xp\s+md\s*$/img)) {
                console.log('SERVER STATS');
                //const result = this.bigBrowser.getTextSummaryByServer(message.guild);
                var result = _this.bigBrowserV2.getServerMarkDown(message.guild);
                message.delete();
                message.channel.send(new Discord.Attachment(new Buffer(result), 'stats.md'));
            }
            else if (checkForCommand(/^\s*!server\s+xp\s+txt\s*$/img)) {
                console.log('SERVER STATS');
                //const result = this.bigBrowser.getTextSummaryByServer(message.guild, false);
                var result = _this.bigBrowserV2.getServerText(message.guild);
                message.delete();
                message.channel.send(new Discord.Attachment(new Buffer(result), 'stats.txt'));
            }
            else if (checkForCommand(/^\s*!global\s+xp\s*$/img)) {
                console.log('GLOBAL STATS');
                //const result = this.bigBrowser.getTextSummaryByServer();
                var result = _this.bigBrowserV2.getServersText(client.guilds.map(function (guild) { return guild; }));
                message.delete();
                message.reply('\r\n' + result);
            }
            else if (checkForCommand(/^\s*!global\s+xp\s+csv\s*$/img)) {
                console.log('GLOBAL STATS DL');
                //const result = this.bigBrowser.getTextSummaryByServerCSV(undefined, true);
                var result = _this.bigBrowserV2.getServersCSV(client.guilds.map(function (guild) { return guild; }), true);
                message.delete();
                message.channel.send(new Discord.Attachment(new Buffer(result), 'stats.csv'));
            }
            else if (checkForCommand(/^\s*!global\s+xp\s+md\s*$/img)) {
                console.log('GLOBAL STATS DL');
                //const result = this.bigBrowser.getTextSummaryByServer();
                var result = _this.bigBrowserV2.getServersMarkDown(client.guilds.map(function (guild) { return guild; }));
                message.delete();
                message.channel.send(new Discord.Attachment(new Buffer(result), 'stats.md'));
            }
            else if (checkForCommand(/^\s*!global\s+xp\s+txt\s*$/img)) {
                console.log('GLOBAL STATS DL');
                //const result = this.bigBrowser.getTextSummaryByServer(undefined, false);
                var result = _this.bigBrowserV2.getServersText(client.guilds.map(function (guild) { return guild; }));
                message.delete();
                message.channel.send(new Discord.Attachment(new Buffer(result), 'stats.txt'));
            }
            else if (checkForCommand(/^\s*!stop\s+server\s+xp\s*$/img)) {
                console.log('STOP SERVER XP');
                _this.bigBrowserV2.setTrackingServer(message.guild, false);
                _this.bigBrowser.setServerTracking(message.guild, false);
                message.delete();
                message.reply(':small_orange_diamond: arrêt du stockage de l\'expérience du serveur.');
            }
            else if (checkForCommand(/^\s*!start\s+server\s+xp\s*$/img)) {
                console.log('START SERVER XP');
                _this.bigBrowserV2.setTrackingServer(message.guild, true);
                _this.bigBrowser.setServerTracking(message.guild, true);
                message.delete();
                message.reply(':small_blue_diamond: démarrage du stockage de l\'expérience du serveur.');
            }
            else if (checkForCommand(/^\s*!stop\s+xp\s*$/img)) {
                console.log('STOP XP');
                _this.bigBrowserV2.setTrackingUser(message.member, false);
                _this.bigBrowser.setTracking(message.guild, message.author, false);
                message.delete();
                message.reply(':small_orange_diamond: arrêt du stockage de ton expérience.');
            }
            else if (checkForCommand(/^\s*!start\s+xp\s*$/img)) {
                console.log('START XP');
                _this.bigBrowserV2.setTrackingUser(message.member, true);
                _this.bigBrowser.setTracking(message.guild, message.author, true);
                message.delete();
                message.reply(':small_blue_diamond: démarrage du stockage de ton expérience.');
            }
            else if (checkForCommand(/^\s*!xpbonus\s+pop\s*$/img)) {
                Bot.adminOnly(message, function () {
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
                Bot.adminOnly(message, function () {
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
                var xpBonusScheduledEvent_1 = _this.xpBonusScheduledEvents.find(function (item) { return item.guild.id === message.guild.id; });
                if (xpBonusScheduledEvent_1) {
                    message.reply("```active = " + (xpBonusScheduledEvent_1.active ? 'oui' : 'non') + "\n" + propNames.map(function (propName) { return propName + " = " + xpBonusScheduledEvent_1[propName]; }).reduce(function (p, c) { return p + '\n' + c; }).trim() + "```");
                }
            }
            else if (checkForCommand(/^\s*!xpbonus\s+config\s+(messageTimeoutSec|periodMsMin|periodMsMax|xpBonusOnPopUp|xpBonusOnReact)\s+(\d+(?:\.\d+)?)\s*$/img)) {
                Bot.adminOnly(message, function () {
                    var propName = params[1], valueStr = params[2];
                    var xpBonusScheduledEvent = _this.xpBonusScheduledEvents.find(function (item) { return item.guild.id === message.guild.id; });
                    if (xpBonusScheduledEvent) {
                        xpBonusScheduledEvent[propName] = parseFloat(valueStr);
                        message.reply("Modification confirm\u00E9e\n```" + propName + " = " + xpBonusScheduledEvent[propName] + "```");
                    }
                });
            }
            else if (checkForCommand(/^\s*!xpbonus\s+channel\s+(add|remove|list)\s*$/img)) {
                Bot.adminOnly(message, function () {
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
                                    message.reply(("```::: Channels :::\n                                        " + xpBonusScheduledEvent.channels.map(function (c) { return c.name; }).reduce(function (p, c) { return p + '\n' + c; }, '').trim() + "\n                                    ```").replace(/^ +/img, ''));
                                }
                                break;
                        }
                    }
                });
            }
            else if (checkForCommand(/^\s*!twitch\s+remove\s*.+$/img)) {
                console.log('TWITCH REMOVE');
                var msg = message.content.trim();
                var streamer = msg.split(' ', 2)[1];
                var twitch = _this.application.removeTwitch(streamer);
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
                var msg = message.content.trim();
                var streamer = msg.split(' ', 2)[1];
                var _g = _this.application.addTwitch(streamer, message.channel, message), twitch_1 = _g.twitch, created = _g.created;
                if (created) {
                    twitch_1.update();
                }
                else {
                    twitch_1.isLive(function (isLive) {
                        message.channel.send("Le twitch existe deja sur le channel `" + twitch_1.message.channel.name + "` ! (`" + twitch_1.streamer + "` " + (isLive ? 'est en live' : 'n\'est pas en live') + ")");
                    });
                }
                globals.saver.save();
            } /*
            else if(checkForCommand(/^\s*![twitch]+\s*.+$/img))
            {
                const msg = message.content.trim();
                const streamer = msg.split(' ', 2)[1];

                message.reply('Tu voulais dire `!twitch ' + streamer + '`?');
            }*/
            else if (message.author.id !== _this.client.user.id && message.channel.name === 'orokin-connection') {
                _this.ocCommand(message);
            }
            console.log(message.content.trim());
        });
        client.on('guildMemberAdd', function (member) {
            if (!_this.stops.memberRemove[member.guild.id]) {
                var channelGeneral = Bot.findGeneralChannel(member.guild.channels);
                if (channelGeneral) {
                    console.log('SENDING WELCOME');
                    channelGeneral.send(" Bienvenue " + member + " ! have fun :wink: !");
                }
            }
        });
        client.on('guildMemberRemove', function (member) {
            console.log('guildMemberRemove');
            if (!_this.stops.memberRemove[member.guild.id]) {
                member.createDM().then(function (channel) {
                    console.log('SENDING BYE BYE');
                    return channel.send('hey! ben c\'est dommage de partir :( bonne continuation ...');
                });
            }
        });
        client.on('error', function (value) {
            console.error(value);
        });
        client.on('warn', function (value) {
            console.log(value);
        });
        client.on('ready', function () {
            console.log('READY');
            setTimeout(function () {
                client.user.setAvatar('./embleme alliance.png').catch(function () { });
            }, 5000);
            client.user.setActivity('connecter la guilde');
            var startRuntime = function () {
                _this.application.start();
                setInterval(function () {
                    var voiceChannels = client.channels.filter(function (channel) { return channel.type === 'voice'; }).array();
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
                }, 500);
                var _loop_1 = function (guild) {
                    if (!_this.xpBonusScheduledEvents.some(function (item) { return item.guild.id === guild.id; })) {
                        _this.xpBonusScheduledEvents.push(new ScheduledEvent_1.XPBonusScheduledEvent(guild, _this.bigBrowserV2));
                    }
                };
                for (var _i = 0, _a = _this.client.guilds.array(); _i < _a.length; _i++) {
                    var guild = _a[_i];
                    _loop_1(guild);
                }
                _this.xpBonusScheduledEvents.forEach(function (item) { return item.start(); });
                /*if(this.bigBrowser.servers && Object.keys(this.bigBrowser.servers).length > 0)
                    this.bigBrowserV2.initWithV1Data(this.bigBrowser.servers);*/
                setInterval(function () {
                    _this.client.guilds.forEach(function (guild) {
                        //if(guild.name === 'Orokin Guilde Académie')
                        _this.bigBrowserV2.updateServer(guild);
                    });
                }, 1000);
            };
            if (_this._onReady)
                _this._onReady(startRuntime);
            else
                startRuntime();
        });
    };
    Bot.prototype.onReady = function (fn) {
        this._onReady = fn;
    };
    return Bot;
}());
exports.Bot = Bot;
