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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotGeneral = void 0;
var discord_js_1 = require("discord.js");
var Bot_1 = require("../Bot");
var moment = require("moment-timezone");
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
        var embed = new discord_js_1.RichEmbed()
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
    BotGeneral.prototype.helpCommand = function (message, group) {
        var authorIcon = 'https://media.discordapp.net/attachments/473609056163201024/475758769402544128/embleme_alliance.png?width=50&height=50';
        var embed = new discord_js_1.RichEmbed()
            .setColor(BotGeneral.getRandomColor())
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
    BotGeneral.prototype.onMessage = function (message, checkForCommand, params) {
        var _this = this;
        var setCommonSetting = function (message, callback) {
            BotGeneral.adminOnly(message, function () {
                callback();
                message.delete();
                globals.saver.save();
            });
        };
        if (checkForCommand(/^\s*!trio\s*$/img)) {
            this.application.addServerChannel(message.channel);
            message.delete();
            globals.saver.save();
        }
        else if (checkForCommand(/^\s*!mentor .+$/img)) {
            console.log('MENTOR');
            var mentions = message.mentions.members.array();
            if (mentions.length === 1) {
                var disciple = mentions[0];
                if (this.mentoring.setMentor(message.member, disciple)) {
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
            var server_1 = this.mentoring.getServer(message.guild);
            var str = '';
            for (var id in server_1.users) {
                var user = server_1.users[id];
                str += user.displayName + " | " + Object.keys(user.disciples).length + " " + Object.keys(user.disciples).map(function (id) { return server_1.users[id].displayName; }).join(' - ') + " | " + Object.keys(user.mentors).length + " " + Object.keys(user.mentors).map(function (id) { return server_1.users[id].displayName; }).join(' - ') + " | " + (user.mentoringSuccess ? 'V' : '-') + "\r\n";
            }
            message.channel.send(str);
        }
        else if (checkForCommand(/^\s*!mentors pending\s*$/img)) {
            console.log('MENTORS PENDING');
            var server_2 = this.mentoring.getServer(message.guild);
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
            var server_3 = this.mentoring.getServer(message.guild);
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
            var server = this.mentoring.getServer(message.guild);
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
        else if (checkForCommand(/^\s*!(?:help|aide)\s*(?:me|moi)\s*(.*)/img)) {
            var match = /^\s*!(?:help|aide)\s*(?:me|moi)\s*(.*)/img.exec(message.content);
            this.helpCommand(message, match[1]);
        }
        else if (checkForCommand(/^\s*!(?:join|rejoindre)\s+trio\s*$/img)) {
            this.joinTrioCommand(message);
        }
        else if (checkForCommand(/^\s*!(?:leave|quitter)\s+trio\s*$/img)) {
            this.leaveTrioCommand(message);
        }
        else if (checkForCommand(/^\s*!twitch\s+remove\s*.+$/img)) {
            console.log('TWITCH REMOVE');
            var msg = message.content.trim();
            var streamer = msg.split(' ', 2)[1];
            var twitch = this.application.removeTwitch(streamer);
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
            var _a = this.application.addTwitch(streamer, message.channel, message), twitch_1 = _a.twitch, created = _a.created;
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
        else if (message.author.id !== this.client.user.id && message.channel.name === 'orokin-connection') {
            this.ocCommand(message);
        }
        console.log(message.content.trim());
    };
    BotGeneral.prototype._initialize = function () {
        var _this = this;
        var managerRoleByMessage = function (message, user, callback) {
            if (message.message.channel.name === 'éditez-vos-grades' || message.message.channel.id.toString() === '532671748059955200') {
                var guild = message.message.guild;
                guild.fetchMember(user).then(function (member) {
                    callback(member, message.message.mentions.roles);
                }).catch(function () { });
            }
        };
        this.client.on('messageReactionAdd', function (message, user) {
            managerRoleByMessage(message, user, function (member, roles) {
                member.addRoles(roles);
            });
        });
        this.client.on('messageReactionRemove', function (message, user) {
            managerRoleByMessage(message, user, function (member, roles) {
                member.removeRoles(roles);
            });
        });
        this.client.on('guildMemberAdd', function (member) {
            if (!_this.stops.memberRemove[member.guild.id]) {
                var channelGeneral = BotGeneral.findGeneralChannel(member.guild.channels);
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
            _this.client.user.setAvatar('./embleme alliance.png').catch(function () { });
        }, 5000);
        this.client.user.setActivity('connecter la guilde');
    };
    BotGeneral.prototype.startRuntime = function () {
        this.application.start();
    };
    return BotGeneral;
}(Bot_1.IBot));
exports.BotGeneral = BotGeneral;
