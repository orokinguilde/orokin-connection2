import { BigBrowserV2 } from "./BigBrowserV2";
import { Client, TextChannel, VoiceChannel } from "discord.js";
import { XPBonusScheduledEvent } from "./ScheduledEvent";

const bannerTemplates = require('./BannerTemplate');
const Application = require('./Application');
const BigBrowser = require('./BigBrowser');
const Mentoring = require('./Mentoring');
const Discord = require('discord.js');
const Message = require('./Message');
const globals = require('./globals');
const Banner = require('./Banner');

export class Bot {
    public constructor(options) {
        if(!options)
            options = {};
        
        this.options = options;

        this.application = new Application(this, this.options);
        this.bigBrowser = new BigBrowser();
        this.bigBrowserV2 = new BigBrowserV2();
        this.mentoring = new Mentoring();

        this.errorCounters = {};
        this.stops = {
            memberAdd: {},
            memberRemove: {},
            eidolonsWarning: {}
        };

        if(!this.noAutoInitialization)
            this.initialize();
    }
    
    public _onReady;
    public options;
    public application;
    public bigBrowser;
    public bigBrowserV2: BigBrowserV2;
    public mentoring;
    public errorCounters;
    public stops;
    public noAutoInitialization;
    public client: Client;
    public debug = false;

    public xpBonusScheduledEvents: XPBonusScheduledEvent[] = [];

    public save() {
        return {
            application: this.application.save(),
            bigBrowser: this.bigBrowser.save(),
            bigBrowserV2: this.bigBrowserV2.save(),
            mentoring: this.mentoring.save(),
            stops: this.stops,
            xpBonusScheduledEvents: this.xpBonusScheduledEvents.map(item => item.save())
        };
    }

    public load(obj) {
        const ctx = {
            bot: this
        };

        this.application.load(obj.application, ctx);
        this.stops = obj.stops;

        if(obj.bigBrowser)
            this.bigBrowser.load(obj.bigBrowser, ctx);
        if(obj.bigBrowserV2)
            this.bigBrowserV2.load(obj.bigBrowserV2, ctx);
        if(obj.mentoring)
            this.mentoring.load(obj.mentoring, ctx);

        if(obj.xpBonusScheduledEvents) {
            this.xpBonusScheduledEvents = obj.xpBonusScheduledEvents.map(item => new XPBonusScheduledEvent(this.client.guilds.find((c) => c.id === item.guildId), this.bigBrowserV2, item));
        }
    }

    public start(token) {
        this.client.login(token || this.options.token);
    }

    public static getRandomColor() {
        const colors = [
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
    }
    public ocCommand(message) {

        Message.deleteMessage(message);

        //let argson = message.content.split(" ").slice(1);
        //let vcsmsg = argson.join(" ")
        let messageContent = message.content;
        if(!message.guild.channels.find('name', 'orokin-connection'))
            return message.reply('Erreur: le channel `orokin connection` est introuvable');
        if(message.channel.name !== 'orokin-connection')
            return message.reply('Commande a effectuer dans `orokin-connection`');
        if(!messageContent)
            return message.reply('Merci d\'envoyer un "message" à envoyer dans la globalité des discords');

        const regex = /@([^@]+)/img;

        let newText = messageContent;
        let match = regex.exec(messageContent);
        while(match && match.length > 1) {
            const nameAndText = match[1];

            for(const user of this.client.users.array()) {
                let nameFound;
                if(nameAndText.indexOf(user.tag) === 0) {
                    nameFound = user.tag;
                } else if(nameAndText.indexOf(user.username) === 0) {
                    nameFound = user.username;
                }

                if(nameFound) {
                    while(newText.indexOf(`@${nameFound}`) !== -1) {
                        newText = newText.replace(`@${nameFound}`, `<@${user.id}>`);
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
        
        (this.client.channels as any).findAll('name', 'orokin-connection').map(channel => {
            console.log('SENDING message to ', channel.guild.name);
            
            channel.send(embed).then(() => channel.send(messageContent));
        })
    }
    public static findTrioTeamRole(guild) {
        return guild.roles.find(role => role.name.toLowerCase().indexOf('trio') >= 0 && role.name.toLowerCase().indexOf('team') >= 0);
    }
    public joinTrioCommand(message) {
        const role = Bot.findTrioTeamRole(message.guild);
        message.member.addRole(role);

        message.delete();
        message.channel.send(`${message.author} a rejoint Trio Team ! :tada: `);
    }
    public leaveTrioCommand(message) {
        const role = Bot.findTrioTeamRole(message.guild);
        message.member.removeRole(role);
        
        message.delete();
        message.channel.send(`${message.author} a quitté Trio Team ! :cry: `);
    }
    public helpCommand(message, group) {

        const authorIcon = 'https://media.discordapp.net/attachments/473609056163201024/475758769402544128/embleme_alliance.png?width=50&height=50';
        
        const embed = new Discord.RichEmbed()
            .setColor(Bot.getRandomColor())
            .setThumbnail('https://cdn.discordapp.com/attachments/473609056163201024/479491701853913095/Help.png');

        if(!group)
        {
            embed
                .setAuthor('Help me!', authorIcon)
                .addField('Tridolon', '`trio`, `join trio`, `leave trio`, `nonotif eidolonswarning`,\r\n`notif eidolonswarning`\r\n\r\n*Plus de détails :* `!helpme tridolon`\r\n¯¯¯¯¯¯¯¯¯¯¯¯¯¯')
                .addField('Membres', '`nonotif memberadd`, `notif memberadd`, `nonotif memberleave`,\r\n`notif memberleave`\r\n\r\n*Plus de détails :* `!helpme membres`\r\n¯¯¯¯¯¯¯¯¯¯¯¯¯¯')
                .addField('Twitch', '`twitch <name>`, `twitch remove <name>`\r\n\r\n*Plus de détails :* `!helpme twitch`\r\n¯¯¯¯¯¯¯¯¯¯¯¯¯¯')
                .addField('XP Vocal/Textuel', '`rank`, `rank templates`, `rank template <name>`, `ranks`, `server xp`, `server xp md`, `server xp csv`, `server xp txt`,\r\n`start server xp`, `stop server xp`, `start xp`, `stop xp`\r\n\r\n*Plus de détails :* `!helpme xp`\r\n¯¯¯¯¯¯¯¯¯¯¯')
                .addField('Leaderboard', '`server rank <nb>`, `server last rank <nb>`, `server rank reset`, `server rank ranges`, `server rank range <name> <start> <end>`\r\n\r\n*Plus de détails :* `!helpme leaderboard`\r\n¯¯¯¯¯¯¯¯¯¯¯')
                .addField('XP Bonus', '`xpbonus <enable|disable>`, `xpbonus config <periodMsMin|periodMsMax|xpBonusOnPopUp|xpBonusOnReact> <value>`, `xpbonus config`, `xpbonus channel <add|remove|list>`\r\n\r\n*Plus de détails :* `!helpme xpbonus`\r\n¯¯¯¯¯¯¯¯¯¯¯')
                .setDescription('**Utilisation** : `!<ma_commande>`');
        }
        else if(group.toLowerCase() === 'xpbonus')
        {
            embed
                .setAuthor('XP Bonus\r\n¯¯¯¯¯¯¯¯', authorIcon)
                .setThumbnail('https://media.discordapp.net/attachments/514178068835860498/718771841476460604/XP-bonus_1.gif')
                .setDescription(`
    :small_orange_diamond: **!xpbonus <enable|disable>** | Active ou désactive l'XP Bonus
    :small_orange_diamond: **!xpbonus config <periodMsMin|periodMsMax|xpBonusOnPopUp|xpBonusOnReact> <value>** | Modifie la configuration
    :small_blue_diamond: **!xpbonus config** | Affiche la configuration
    :small_orange_diamond: **!xpbonus channel <add|remove|list>** | Ajoute/supprime/liste les salons`.trim());
        }
        else if(group.toLowerCase() === 'leaderboard')
        {
            embed
                .setAuthor('Leaderboard\r\n¯¯¯¯¯¯¯¯', authorIcon)
                .setThumbnail('https://media.discordapp.net/attachments/514178068835860498/718771841476460604/XP-bonus_1.gif')
                .setDescription(`
    :small_blue_diamond: **!server rank <nb>** | Affiche le leaderboard
    :small_blue_diamond: **!server last rank <nb>** | Affiche le leaderboard de la dernière fois (jour dernier et semaine dernière)
    :small_orange_diamond: **!server rank reset** | Réinitialise le leaderboard
    :small_blue_diamond: **!server rank ranges** | Affiche les plages horaires pour recevoir de l'exp
    :small_orange_diamond: **!server rank range <name> <start> <end>** | Modifie une plage horaire`.trim());
        }
        else if(group.toLowerCase() === 'tridolon')
        {
            embed
                .setAuthor('Tridolon\r\n¯¯¯¯¯¯¯¯', authorIcon)
                .setThumbnail('https://cdn.discordapp.com/attachments/473609056163201024/479613651918127114/Teralyst_1.png')
                .setDescription(`
    :small_blue_diamond: **!trio** | Affiche les informations sur le trio
    :small_blue_diamond: **!join trio** | Rejoindre le role @Trio Team
    :small_orange_diamond: **!leave trio** | Quitter le role @Trio Team
    :small_orange_diamond: **!nonotif eidolonswarning** | Désactive les notifications de l'arrivée des Eidolons
    :small_blue_diamond: **!notif eidolonswarning** | Active les notifications de l'arrivée des Eidolons`.trim());
        }
        else if(group.toLowerCase() === 'membres')
        {
            embed
                .setAuthor('Membres\r\n¯¯¯¯¯¯¯¯¯', authorIcon)
                .setThumbnail('https://cdn.discordapp.com/attachments/473609056163201024/479619902161027072/unnamed3.png')
                .setDescription(`
    :small_blue_diamond: **!notif memberadd** | Active les notifications lors de l'ajout d'un nouveau membre
    :small_orange_diamond: **!nonotif memberadd** | Désactive les notifications lors de l'ajout d'un nouveau membre
    :small_blue_diamond: **!notif memberleave** | Active les notifications lorsqu'un membre quitte le clan
    :small_orange_diamond: **!nonotif memberleave** | Désactive les notifications lorsqu'un membre quitte le clan`.trim());
        }
        else if(group.toLowerCase() === 'twitch')
        {
            embed
                .setAuthor('Twitch\r\n¯¯¯¯¯¯¯', authorIcon)
                .setThumbnail('https://cdn.discordapp.com/attachments/473609056163201024/479614334805213185/1280px-Twitch_logo.png')
                .setDescription(`
    :small_blue_diamond: **!twitch** <name> | Obtenir des informations sur une chaine Twitch
    :small_orange_diamond: **!twitch remove** <name> | Supprime un message Twitch précédement ajouté`.trim());
        }
        else if(group.toLowerCase() === 'xp')
        {
            embed
                .setAuthor('XP Vocal/Textuel\r\n¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯', authorIcon)
                .setThumbnail('https://cdn.discordapp.com/attachments/473609056163201024/479614949220548610/xp-logo.png')
                .setDescription(`
    :small_blue_diamond: **!rank** | Affiche l'expérience de l'utilisateur
    :small_blue_diamond: **!rank templates** | Affiche la liste des templates
    :small_blue_diamond: **!rank template <name>** | Sélectionne un template
    :small_blue_diamond: **!ranks** | Affiche la liste des rangs
    :small_blue_diamond: **!server xp** | Affiche les statistiques du serveur
    :small_blue_diamond: **!server xp md** | Télécharge les stats du serveur au format [MD](https://www.commentcamarche.net/download/telecharger-34055333-notepad)
    :small_blue_diamond: **!server xp csv** | Télécharge les stats du serveur au format [CSV](https://www.commentcamarche.net/download/telecharger-209-excel-viewer)
    :small_blue_diamond: **!server xp txt** | Télécharge les stats du serveur au format TXT
    :small_blue_diamond: **!start server xp** | Démarre le stockage de l'exp du serveur
    :small_orange_diamond: **!stop server xp** | Arrête le stockage de l'exp du serveur
    :small_blue_diamond: **!start xp** | Démarre le stockage de l'expérience
    :small_orange_diamond: **!stop xp** | Arrête le stockage de l'expérience`.trim());
        }

        message.delete();
        message.channel.send(embed);
    }
    public static findGeneralChannel(channels) {
        const channelNames = [
            /^[^a-zA-Z0-9]*g[eé]n[eé]ral[^a-zA-Z0-9]*$/img,
            /^[^a-zA-Z0-9]*discussion[^a-zA-Z0-9]*$/img,
            /^[^a-zA-Z0-9]*warframe[^a-zA-Z0-9]*$/img
        ];
        
        const matchingChannels = channels
            .filter(channel => channel.constructor.name === 'TextChannel')
            .filter(channel => channelNames.some(regex => regex.test(channel.name)))
            .array();
                    
        if(matchingChannels.length > 0)
        {
            const firstMatchingChannel = matchingChannels[0];
            return firstMatchingChannel;
        }
        else
        {
            return undefined;
        }
    }
    public static isAdmin(member) {
        return member.hasPermission('ADMINISTRATOR');
    }
    public static adminOnly(message, callback) {
        if(Bot.isAdmin(message.member))
        {
            callback();
        }
        else
        {
            message.reply(':small_orange_diamond: Tu n\'as pas les droits pour cette commande');
        }
    }
    public initialize() {
        const client = new Client();
        this.client = client;

        const managerRoleByMessage = (message, user, callback) => {
            if(message.message.channel.name === 'éditez-vos-grades' || message.message.channel.id.toString() === '532671748059955200')
            {
                const guild = message.message.guild;

                guild.fetchMember(user).then((member) => {
                    callback(member, message.message.mentions.roles);
                }).catch(() => {});
            }
        }

        client.on('messageReactionAdd', (message, user) => {
            managerRoleByMessage(message, user, (member, roles) => {
                member.addRoles(roles);
            })
        })

        client.on('messageReactionRemove', (message, user) => {
            managerRoleByMessage(message, user, (member, roles) => {
                member.removeRoles(roles);
            })
        })
        
        client.on('raw', packet => {
            // We don't want this to run on unrelated packets
            if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
            // Grab the channel to check the message from
            const channel = client.channels.get(packet.d.channel_id) as TextChannel;
            // There's no need to emit if the message is cached, because the event will fire anyway for that
            if (channel.messages.has(packet.d.message_id)) return;
            // Since we have confirmed the message is not cached, let's fetch it
            channel.fetchMessage(packet.d.message_id).then(message => {
                // Emojis can have identifiers of name:id format, so we have to account for that case as well
                const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
                // This gives us the reaction we need to emit the event properly, in top of the message object
                const reaction = message.reactions.get(emoji);
                // Check which type of event it is before emitting
                if (packet.t === 'MESSAGE_REACTION_ADD') {
                    client.emit('messageReactionAdd', reaction, client.users.get(packet.d.user_id));
                }
                if (packet.t === 'MESSAGE_REACTION_REMOVE') {
                    client.emit('messageReactionRemove', reaction, client.users.get(packet.d.user_id));
                }
            });
        });

        client.on('message', message => {
            let params: string[];

            const checkForCommand = (regexCmd) => {
                params = regexCmd.exec(message.content);
                return !!params;
            };
            
            if(!message.author.bot)
                this.bigBrowser.increaseTextActivity(message.guild, message.author, 0.5);

            this.bigBrowserV2.updateUserText(message);
            
            if(this.debug) {
                if(message.content[0] !== '@')
                    return;
                
                message.content = message.content.slice(1);
            }

            const setCommonSetting = (message, callback) => {
                Bot.adminOnly(message, () => {
                    callback();

                    message.delete();
                    globals.saver.save();
                });
            }

            if(checkForCommand(/^\s*!trio\s*$/img))
            {
                this.application.addServerChannel(message.channel);
                message.delete();
                globals.saver.save();
            }
            else if(checkForCommand(/^\s*!mentor .+$/img))
            {
                console.log('MENTOR');
                const mentions = message.mentions.members.array();

                if(mentions.length === 1)
                {
                    const disciple = mentions[0];

                    if(this.mentoring.setMentor(message.member, disciple))
                    {
                        message.reply(`recrutement enregistré !`);
                        globals.saver.save();
                    }
                    else
                    {
                        message.reply(`recrutement refusé !`);
                    }
                }/*
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
                    message.reply(`tu dois mentionner le/la disciple !`);
                }

            } else if(checkForCommand(/^\s*!mentors\s*$/img)) {

                console.log('MENTORS');
                
                const server = this.mentoring.getServer(message.guild);

                let str = '';
                for(const id in server.users) {
                    const user = server.users[id];

                    str += `${user.displayName} | ${Object.keys(user.disciples).length} ${Object.keys(user.disciples).map((id) => server.users[id].displayName).join(' - ')} | ${Object.keys(user.mentors).length} ${Object.keys(user.mentors).map((id) => server.users[id].displayName).join(' - ')} | ${user.mentoringSuccess ? 'V' : '-'}\r\n`;
                }

                message.channel.send(str);

            } else if(checkForCommand(/^\s*!mentors pending\s*$/img)) {

                console.log('MENTORS PENDING');
                
                const server = this.mentoring.getServer(message.guild);

                let str = '';
                for(const id in server.users) {
                    const user = server.users[id];

                    if(!user.mentoringSuccess) {
                        str += `${user.displayName} | ${Object.keys(user.disciples).length} ${Object.keys(user.disciples).map((id) => server.users[id].displayName).join(' - ')} | ${Object.keys(user.mentors).length} ${Object.keys(user.mentors).map((id) => server.users[id].displayName).join(' - ')}\r\n`;
                    }
                }

                message.channel.send(str);

            } else if(checkForCommand(/^\s*!mentors success\s*$/img)) {

                console.log('MENTORS PENDING');
                
                const server = this.mentoring.getServer(message.guild);

                let str = '';
                for(const id in server.users) {
                    const user = server.users[id];

                    if(user.mentoringSuccess) {
                        str += `${user.displayName} | ${Object.keys(user.disciples).length} ${Object.keys(user.disciples).map((id) => server.users[id].displayName).join(' - ')} | ${Object.keys(user.mentors).length} ${Object.keys(user.mentors).map((id) => server.users[id].displayName).join(' - ')}\r\n`;
                    }
                }

                message.channel.send(str);

            } else if(checkForCommand(/^\s*!mentoring\s*$/img)) {

                console.log('MENTORING');
                
                const server = this.mentoring.getServer(message.guild);

                let success = 0;
                let unsuccess = 0;
                for(const id in server.users) {
                    const user = server.users[id];

                    if(user.mentoringSuccess) {
                        ++success;
                    } else {
                        ++unsuccess;
                    }
                }

                message.channel.send(`**${success}** chaine(s) de recrutement réussie(s) / **${unsuccess + success}** chaine(s) au total (**${unsuccess}** en attente)\r\n**${Math.round(success / (unsuccess + success) * 10000) / 100}%** de réussite`);

            } else if(checkForCommand(/^\s*!ranks$/img)) {

                const user = this.bigBrowserV2.getUser(message.member);
                const exp = user.stats.xp;
                const userRank = user.stats.rank;

                const msg = `${message.member}, voici la liste des rangs disponibles :\r\n` + Object.keys(BigBrowserV2.ranks)
                    .map((key) => BigBrowserV2.ranks[key])
                    .map((rank) => `\`[${globals.padN(rank.start, 4)}, ${globals.padN(rank.end || '∞', 4)}[ ${rank.name}\`${rank === userRank.currentRank ? ` ⇦ **${message.member.displayName}**, tu es ici avec **${Math.floor(exp)} exp** !` : ''}`)
                    .join('\r\n');

                message.delete();
                message.channel.send(msg);

            } else if(checkForCommand(/^\s*!rank templates$/img)) {

                const msg = `${message.member}, voici la liste des templates disponibles (\`!rank template ...\`) :\r\n` + bannerTemplates.list.map((bannerTemplate) => {
                    return `**${bannerTemplate.key}.** ${bannerTemplate.name}`
                }).join('\r\n');

                message.delete();
                message.channel.send(msg);
            } else if(checkForCommand(/^\s*!rank template (.+)$/img)) {
                const name = /^\s*!rank template (.+)$/img.exec(message.content)[1].trim().toLowerCase();

                const user = this.bigBrowserV2.getUser(message.member);
                let template = undefined;

                for(const templateItem of bannerTemplates.list) {
                    if(templateItem.key.toString().toLowerCase() == name) {
                        template = templateItem;
                        break;
                    }
                }

                if(!template) {
                    for(const templateItem of bannerTemplates.list) {
                        if(templateItem.name.toString().toLowerCase().indexOf(name) > -1) {
                            template = templateItem;
                            break;
                        }
                    }
                }

                if(!template) {
                    for(const templateItem of bannerTemplates.list) {
                        if(`${templateItem.key}. ${templateItem.name}`.toLowerCase().indexOf(name) > -1) {
                            template = templateItem;
                            break;
                        }
                    }
                }

                if(!template) {
                    message.channel.send(`${message.member}, le template "${name}" n'a pas été trouvé 😢`);
                } else {
                    user.bannerTemplateKey = template.key;
                    message.channel.send(`${message.member}, le template "${name}" t'a été assigné 👍`);
                    message.delete();
                    globals.saver.save();
                }
            }
            else if(checkForCommand(/^\s*!rank\s*$/img))
            {
                const user = this.bigBrowserV2.getUser(message.member);
                const voiceExp = user.stats.voiceXp;
                const textExp = user.stats.textXp;
                const ranking = user.stats.rank;
                const rank = this.bigBrowserV2.getUserRanking(user, message.guild);
                
                const banner = new Banner({
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

                let template = undefined;
                
                if(user.bannerTemplateKey) {
                    template = bannerTemplates.indexed[user.bannerTemplateKey];
                }
                if(!template) {
                    template = bannerTemplates.default;
                }

                message.react('🐰');
                
                banner.createBuffer(template, (e, buffer) => {
                    if(e) {
                        console.log(e);
                        message.channel.send(`Désolé, une erreur s'est produite lors de la génération de l'image.`);
                    } else {
                        const attachment = new Discord.Attachment(buffer, 'banner.png');
                        message.delete();
                        message.channel.send('', attachment);
                    }
                })
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
            else if(checkForCommand(/^\s*!nonotif\s+memberadd\s*$/img))
            {
                setCommonSetting(message, () => {
                    this.stops.memberAdd[message.guild.id] = true;
                    message.reply(':small_orange_diamond: Désactivation des notifications lorsqu\'un membre rejoint le clan');
                });
            }
            else if(checkForCommand(/^\s*!notif\s+memberadd\s*$/img))
            {
                setCommonSetting(message, () => {
                    delete this.stops.memberAdd[message.guild.id];
                    message.reply(':small_blue_diamond: Activation des notifications lorsqu\'un membre rejoint le clan');
                });
            }
            else if(checkForCommand(/^\s*!nonotif\s+memberleave\s*$/img))
            {
                setCommonSetting(message, () => {
                    this.stops.memberRemove[message.guild.id] = true;
                    message.reply(':small_orange_diamond: Désactivation des notifications lorsqu\'un membre quitte le clan');
                });
            }
            else if(checkForCommand(/^\s*!notif\s+memberleave\s*$/img))
            {
                setCommonSetting(message, () => {
                    delete this.stops.memberRemove[message.guild.id];
                    message.reply(':small_blue_diamond: Activation des notifications lorsqu\'un membre quitte le clan');
                });
            }
            else if(checkForCommand(/^\s*!nonotif\s+eidolonswarning\s*$/img))
            {
                setCommonSetting(message, () => {
                    this.stops.eidolonsWarning[message.guild.id] = true;
                    message.reply(':small_orange_diamond: Désactivation des notifications pour les Eidolons');
                });
            }
            else if(checkForCommand(/^\s*!notif\s+eidolonswarning\s*$/img))
            {
                setCommonSetting(message, () => {
                    delete this.stops.eidolonsWarning[message.guild.id];
                    message.reply(':small_blue_diamond: Activation des notifications pour les Eidolons')
                });
            }
            else if(checkForCommand(/^\s*!(?:help|aide)\s*(?:me|moi)\s*(.*)/img))
            {
                const match = /^\s*!(?:help|aide)\s*(?:me|moi)\s*(.*)/img.exec(message.content);

                this.helpCommand(message, match[1]);
            }
            else if(checkForCommand(/^\s*!(?:join|rejoindre)\s+trio\s*$/img))
            {
                this.joinTrioCommand(message);
            }
            else if(checkForCommand(/^\s*!(?:leave|quitter)\s+trio\s*$/img)) {
                
                this.leaveTrioCommand(message);

            } else if(checkForCommand(/^\s*!server\s+rank\s+reset\s*$/img)) {
                
                Bot.adminOnly(message, () => {
                    this.bigBrowserV2.resetDayWeekStats(message.guild);
                    
                    message.reply(`Les stats viennent d'être réinitialisées.`);
                })

            } else if(checkForCommand(/^\s*!server\s+rank\s+ranges\s*$/img)) {

                message.reply(`\`\`\`${this.bigBrowserV2.dayRange.map(range => `::: ${range.name} :::
    Jours : ${range.days.map(j => j + 1)}
    Début : ${range.start} h
    Fin : ${range.end} h`).reduce((p, c) => `${p}\n\n${c}`, '').trim()}\`\`\``);

            } else if(checkForCommand(/^\s*!server\s+rank\s+range\s+([a-zA-Z0-9]+)\s+(\d+)\s+(\d+)\s*$/img)) {

                Bot.adminOnly(message, () => {
                    const regex = /^\s*!server\s+rank\s+range\s+([a-zA-Z0-9]+)\s+(\d+)\s+(\d+)\s*$/img;
                    const [, name, startStr, endStr ] = regex.exec(message.content);
                    const start = parseInt(startStr);
                    const end = parseInt(endStr);
                    
                    if(isNaN(start) || isNaN(end)) {
                        message.reply('Paramètres invalides. Exemple : !server rank range Semaine 9 23');
                    } else {
                        const range = this.bigBrowserV2.dayRange.find(range => range.name.toLowerCase().includes(name.toLowerCase().trim()));

                        if(!range) {
                            message.reply(`Impossible de trouver la plage "${name.trim()}"`);
                        } else {
                            range.start = start;
                            range.end = end;
                            globals.saver.save();
                            message.reply(`Plage changée : [${start} h, ${end} h]`);
                        }
                    }
                })

            } else if(checkForCommand(/^\s*!server\s+(last\s+)?rank(\s+\d+)?\s*$/img)) {

                console.log('SERVER RANK');

                const [, getLast, nbRosterStr ] = /^\s*!server\s+(last\s+)?rank(\s+\d+)?\s*$/img.exec(message.content);
                const nbRoster = nbRosterStr && parseInt(nbRosterStr);

                const result = this.bigBrowserV2.getRosterRanks(message.guild, nbRoster, !!getLast);

                const createStrLine = (entries: any[]) => entries
                    .map((u, i) => u.stats.xp <= 0 ? `${`${i + 1}.`.padEnd(entries.length.toString().length + 1, ' ')} -` : `${`${i + 1}.`.padEnd(entries.length.toString().length + 1, ' ')} ${Math.round(u.stats.xp * 100) / 100} :: ${u.user.userData.displayName}`)
                    .reduce((p, c) => !p ? c : `${p}\n${c}`, '');
                
                message.delete();
                message.reply('\r\n' + `\`\`\`::: Jour :::
${createStrLine(result.day)}

::: Semaine :::
${createStrLine(result.week)}\`\`\``);
            }
            else if(checkForCommand(/^\s*!server\s+xp\s*$/img))
            {
                console.log('SERVER STATS');

                //const result = this.bigBrowser.getTextSummaryByServer(message.guild);
                const result = this.bigBrowserV2.getServerText(message.guild);
                
                message.delete();
                message.reply('\r\n' + result);
            }
            else if(checkForCommand(/^\s*!server\s+xp\s+csv\s*$/img))
            {
                console.log('SERVER STATS');

                //const result = this.bigBrowser.getTextSummaryByServerCSV(message.guild, true);
                const result = this.bigBrowserV2.getServerCSV(message.guild, true);

                message.delete();
                message.channel.send(new Discord.Attachment(new Buffer(result), 'stats.csv'));
            }
            else if(checkForCommand(/^\s*!server\s+xp\s+md\s*$/img))
            {
                console.log('SERVER STATS');

                //const result = this.bigBrowser.getTextSummaryByServer(message.guild);
                const result = this.bigBrowserV2.getServerMarkDown(message.guild);

                message.delete();
                message.channel.send(new Discord.Attachment(new Buffer(result), 'stats.md'));
            }
            else if(checkForCommand(/^\s*!server\s+xp\s+txt\s*$/img))
            {
                console.log('SERVER STATS');

                //const result = this.bigBrowser.getTextSummaryByServer(message.guild, false);
                const result = this.bigBrowserV2.getServerText(message.guild);

                message.delete();
                message.channel.send(new Discord.Attachment(new Buffer(result), 'stats.txt'));
            }
            else if(checkForCommand(/^\s*!global\s+xp\s*$/img))
            {
                console.log('GLOBAL STATS');

                //const result = this.bigBrowser.getTextSummaryByServer();
                const result = this.bigBrowserV2.getServersText(client.guilds.map((guild) => guild));

                message.delete();
                message.reply('\r\n' + result);
            }
            else if(checkForCommand(/^\s*!global\s+xp\s+csv\s*$/img))
            {
                console.log('GLOBAL STATS DL');

                //const result = this.bigBrowser.getTextSummaryByServerCSV(undefined, true);
                const result = this.bigBrowserV2.getServersCSV(client.guilds.map((guild) => guild), true);

                message.delete();
                message.channel.send(new Discord.Attachment(new Buffer(result), 'stats.csv'));
            }
            else if(checkForCommand(/^\s*!global\s+xp\s+md\s*$/img))
            {
                console.log('GLOBAL STATS DL');

                //const result = this.bigBrowser.getTextSummaryByServer();
                const result = this.bigBrowserV2.getServersMarkDown(client.guilds.map((guild) => guild));

                message.delete();
                message.channel.send(new Discord.Attachment(new Buffer(result), 'stats.md'));
            }
            else if(checkForCommand(/^\s*!global\s+xp\s+txt\s*$/img))
            {
                console.log('GLOBAL STATS DL');

                //const result = this.bigBrowser.getTextSummaryByServer(undefined, false);
                const result = this.bigBrowserV2.getServersText(client.guilds.map((guild) => guild));

                message.delete();
                message.channel.send(new Discord.Attachment(new Buffer(result), 'stats.txt'));
            }
            else if(checkForCommand(/^\s*!stop\s+server\s+xp\s*$/img))
            {
                console.log('STOP SERVER XP');

                this.bigBrowserV2.setTrackingServer(message.guild, false);
                this.bigBrowser.setServerTracking(message.guild, false);

                message.delete();
                message.reply(':small_orange_diamond: arrêt du stockage de l\'expérience du serveur.');
            }
            else if(checkForCommand(/^\s*!start\s+server\s+xp\s*$/img))
            {
                console.log('START SERVER XP');

                this.bigBrowserV2.setTrackingServer(message.guild, true);
                this.bigBrowser.setServerTracking(message.guild, true);

                message.delete();
                message.reply(':small_blue_diamond: démarrage du stockage de l\'expérience du serveur.');
            }
            else if(checkForCommand(/^\s*!stop\s+xp\s*$/img))
            {
                console.log('STOP XP');

                this.bigBrowserV2.setTrackingUser(message.member, false);
                this.bigBrowser.setTracking(message.guild, message.author, false);

                message.delete();
                message.reply(':small_orange_diamond: arrêt du stockage de ton expérience.');
            }
            else if(checkForCommand(/^\s*!start\s+xp\s*$/img))
            {
                console.log('START XP');

                this.bigBrowserV2.setTrackingUser(message.member, true);
                this.bigBrowser.setTracking(message.guild, message.author, true);

                message.delete();
                message.reply(':small_blue_diamond: démarrage du stockage de ton expérience.');

            } else if(checkForCommand(/^\s*!xpbonus\s+(enable|disable)\s*$/img)) {

                Bot.adminOnly(message, () => {
                    const [, action] = params;
                    const xpBonusScheduledEvent = this.xpBonusScheduledEvents.find(item => item.guild.id === message.guild.id);
    
                    if(xpBonusScheduledEvent) {
                        if(action.toLowerCase() === 'enable') {
                            xpBonusScheduledEvent.active = true;
                            message.reply(`XP Bonus activé`);
                        } else {
                            xpBonusScheduledEvent.active = false;
                            message.reply(`XP Bonus désactivé`);
                        }
                    }
                })

            } else if(checkForCommand(/^\s*!xpbonus\s+config\s*$/img)) {

                const propNames = [ 'periodMsMin', 'periodMsMax', 'xpBonusOnPopUp', 'xpBonusOnReact' ]
                const xpBonusScheduledEvent = this.xpBonusScheduledEvents.find(item => item.guild.id === message.guild.id);

                if(xpBonusScheduledEvent) {
                    message.reply(`\`\`\`active = ${xpBonusScheduledEvent.active ? 'oui' : 'non'}\n${propNames.map(propName => `${propName} = ${xpBonusScheduledEvent[propName]}`).reduce((p, c) => p + '\n' + c).trim()}\`\`\``)
                }

            } else if(checkForCommand(/^\s*!xpbonus\s+config\s+(periodMsMin|periodMsMax|xpBonusOnPopUp|xpBonusOnReact)\s+(\d+(?:\.\d+)?)\s*$/img)) {

                Bot.adminOnly(message, () => {
                    const [, propName, valueStr ] = params;
                    const xpBonusScheduledEvent = this.xpBonusScheduledEvents.find(item => item.guild.id === message.guild.id);

                    if(xpBonusScheduledEvent) {
                        xpBonusScheduledEvent[propName] = parseFloat(valueStr);
                        message.reply(`Modification confirmée\n\`\`\`${propName} = ${xpBonusScheduledEvent[propName]}\`\`\``)
                    }
                })

            } else if(checkForCommand(/^\s*!xpbonus\s+channel\s+(add|remove|list)\s*$/img)) {

                Bot.adminOnly(message, () => {
                    const [, action] = /^\s*!xpbonus\s+channel\s+(add|remove|list)\s*$/img.exec(message.content);
                    
                    const xpBonusScheduledEvent = this.xpBonusScheduledEvents.find(item => item.guild.id === message.guild.id);

                    if(xpBonusScheduledEvent) {
                        const channel = message.channel as TextChannel;

                        switch(action.toLowerCase().trim()) {
                            case 'add':
                                xpBonusScheduledEvent.addChannel(channel);
                                message.reply(`Salon \`${channel.name}\` ajouté à la liste.`);
                                break;

                            case 'remove':
                                xpBonusScheduledEvent.removeChannel(channel);
                                message.reply(`Salon \`${channel.name}\` supprimé de la liste.`);
                                break;

                            case 'list':
                                if(xpBonusScheduledEvent.channels.length === 0) {
                                    message.reply('Aucun salon dans la liste.');
                                } else {
                                    message.reply(`\`\`\`::: Channels :::
                                        ${xpBonusScheduledEvent.channels.map(c => c.name).reduce((p, c) => p + '\n' + c, '').trim()}
                                    \`\`\``.replace(/^ +/img, ''))
                                }
                                break;
                        }
                    }
                })

            } else if(checkForCommand(/^\s*!twitch\s+remove\s*.+$/img)) {

                console.log('TWITCH REMOVE');

                const msg = message.content.trim();
                const streamer = msg.split(' ', 2)[1];

                const twitch = this.application.removeTwitch(streamer);
                
                if(twitch) {
                    twitch.delete();
                    message.channel.send(`Le message du twitch \`${twitch.streamer}\` a été supprimé`);
                } else {
                    message.channel.send(`Pas de message du twitch \`${streamer}\` a supprimer`);
                }

            } else if(checkForCommand(/^\s*!twitch\s*.+$/img)) {
                console.log('TWITCH');
                
                const msg = message.content.trim();
                const streamer = msg.split(' ', 2)[1];
                
                const { twitch, created } = this.application.addTwitch(streamer, message.channel, message);
                if(created)
                {
                    twitch.update();
                }
                else
                {
                    twitch.isLive(isLive => {
                        message.channel.send(`Le twitch existe deja sur le channel \`${twitch.message.channel.name}\` ! (\`${twitch.streamer}\` ${isLive ? 'est en live' : 'n\'est pas en live'})`);
                    })
                }

                globals.saver.save();
            }/*
            else if(checkForCommand(/^\s*![twitch]+\s*.+$/img))
            {
                const msg = message.content.trim();
                const streamer = msg.split(' ', 2)[1];

                message.reply('Tu voulais dire `!twitch ' + streamer + '`?');
            }*/
            else if(message.author.id !== this.client.user.id && (message.channel as TextChannel).name === 'orokin-connection') {
                this.ocCommand(message);
            }

            console.log(message.content.trim());
        })
        
        client.on('guildMemberAdd', member => {
            
            if(!this.stops.memberRemove[member.guild.id])
            {
                const channelGeneral = Bot.findGeneralChannel(member.guild.channels);
                
                if(channelGeneral)
                {
                    console.log('SENDING WELCOME');
                    channelGeneral.send(` Bienvenue ${member} ! have fun :wink: !`);
                }
            }
        })

        client.on('guildMemberRemove', member => {
            console.log('guildMemberRemove');

            if(!this.stops.memberRemove[member.guild.id])
            {
                member.createDM().then(channel => {
                    console.log('SENDING BYE BYE');
                    return channel.send('hey! ben c\'est dommage de partir :( bonne continuation ...')
                })
            }
        })
        
        client.on('error', (value) => {
            console.error(value);
        });
        client.on('warn', (value) => {
            console.log(value);
        });

        client.on('ready', () => {
            console.log('READY');

            setTimeout(() => {
                client.user.setAvatar('./embleme alliance.png').catch(() => {});
            }, 5000);

            client.user.setActivity('connecter la guilde');

            const startRuntime = () => {
                this.application.start();
                
                setInterval(() => {
                    const voiceChannels = client.channels.filter(channel => channel.type === 'voice').array() as VoiceChannel[];

                    for(const voiceChannel of voiceChannels) {
                        if(!/([^a-zA-Z]|^)[aA][fF][kK]([^a-zA-Z]|$)/img.test(voiceChannel.name)) {
                            for(const member of voiceChannel.members.array()) {
                                if(!member.user.bot && !member.deaf) {
                                    this.bigBrowser.increaseVocalActivity(voiceChannel.guild, member.user, 1 / (30 * 60 * 2));

                                    if(member.user.presence && member.user.presence.game && member.user.presence.game.name) {
                                        this.bigBrowser.pingWarframeActivity(voiceChannel.guild, member.user, member.user.presence.game.name.toLowerCase() === 'warframe');
                                    }
                                }
                            }
                        }
                    }
                }, 500);

                for(const guild of this.client.guilds.array()) {
                    if(!this.xpBonusScheduledEvents.some(item => item.guild.id === guild.id)) {
                        this.xpBonusScheduledEvents.push(new XPBonusScheduledEvent(guild, this.bigBrowserV2));
                    }
                }
                
                this.xpBonusScheduledEvents.forEach(item => item.start());

                /*if(this.bigBrowser.servers && Object.keys(this.bigBrowser.servers).length > 0)
                    this.bigBrowserV2.initWithV1Data(this.bigBrowser.servers);*/
                
                setInterval(() => {
                    this.client.guilds.forEach((guild) => {
                        //if(guild.name === 'Orokin Guilde Académie')
                        this.bigBrowserV2.updateServer(guild);
                    })
                }, 1000)
            }

            if(this._onReady)
                this._onReady(startRuntime);
            else
                startRuntime();
        })
    }

    public onReady(fn) {
        this._onReady = fn;
    }
}
