import { TextChannel, Message, RichEmbed, Attachment } from "discord.js";
import { IBot } from "../Bot";
import * as moment from 'moment-timezone'

const Application = require('../Application');
const Mentoring = require('../Mentoring');
const MessageThis = require('../Message');
const globals = require('../globals');

export class BotGeneral extends IBot {
    public constructor(options) {
        super(options);

        this.application = new Application(this, this.options);
        this.mentoring = new Mentoring();

        this.errorCounters = {};
        this.stops = {
            memberAdd: {},
            memberRemove: {},
            eidolonsWarning: {}
        };
    }
    
    public application;
    public mentoring;
    public errorCounters;
    public stops: {
        memberAdd: any,
        memberRemove: any,
        eidolonsWarning: any
    };

    public save() {
        return {
            application: this.application.save(),
            mentoring: this.mentoring.save(),
            stops: this.stops,
        };
    }

    public _load(obj, ctx) {
        if(obj.application) {
            this.application.load(obj.application, ctx);
        }

        if(obj.stops) {
            this.stops = obj.stops;
        }

        if(obj.mentoring) {
            this.mentoring.load(obj.mentoring, ctx);
        }
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

        MessageThis.deleteMessage(message);

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
        
        var embed = new RichEmbed()
            .setColor(BotGeneral.getRandomColor())
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
        const role = BotGeneral.findTrioTeamRole(message.guild);
        message.member.addRole(role);

        message.delete();
        message.channel.send(`${message.author} a rejoint Trio Team ! :tada: `);
    }
    public leaveTrioCommand(message) {
        const role = BotGeneral.findTrioTeamRole(message.guild);
        message.member.removeRole(role);
        
        message.delete();
        message.channel.send(`${message.author} a quitté Trio Team ! :cry: `);
    }
    public helpCommand(message, group) {

        const authorIcon = 'https://media.discordapp.net/attachments/473609056163201024/475758769402544128/embleme_alliance.png?width=50&height=50';
        
        const embed = new RichEmbed()
            .setColor(BotGeneral.getRandomColor())
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
                .addField('XP Bonus', '`xpbonus <enable|disable>`, `xpbonus pop`, `xpbonus config <messageTimeoutSec|periodMsMin|periodMsMax|xpBonusOnPopUp|xpBonusOnReact> <value>`, `xpbonus config`, `xpbonus channel <add|remove|list>`\r\n\r\n*Plus de détails :* `!helpme xpbonus`\r\n¯¯¯¯¯¯¯¯¯¯¯')
                .setDescription('**Utilisation** : `!<ma_commande>`');
        }
        else if(group.toLowerCase() === 'xpbonus')
        {
            embed
                .setAuthor('XP Bonus\r\n¯¯¯¯¯¯¯¯', authorIcon)
                .setThumbnail('https://media.discordapp.net/attachments/514178068835860498/718771841476460604/XP-bonus_1.gif')
                .setDescription(`
    :small_orange_diamond: **!xpbonus <enable|disable>** | Active ou désactive l'XP Bonus
    :small_orange_diamond: **!xpbonus config <messageTimeoutSec|periodMsMin|periodMsMax|xpBonusOnPopUp|xpBonusOnReact> <value>** | Modifie la configuration
    :small_blue_diamond: **!xpbonus config** | Affiche la configuration
    :small_orange_diamond: **!xpbonus channel <add|remove|list>** | Ajoute/supprime/liste les salons
    :small_orange_diamond: **!xpbonus pop** | Fait apparaitre manuellement le bonus dans un salon de la liste`.trim());
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

    public onMessage(message: Message, checkForCommand: (regex: RegExp) => boolean, params: string[]) {

        const setCommonSetting = (message, callback) => {
            BotGeneral.adminOnly(message, () => {
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

        }
        else if(checkForCommand(/^\s*!dbinfo\s*$/img))
        {
            BotGeneral.adminOnly(message, () => {
                const time = (this as any).saver.dataCreationDate;
                message.reply(process.env.APP_SELECTOR + ' :\nDate de création des données : ' + time + ' | ' + moment(time, 'unix').format('DD/MM/Y HH:mm:ss'));
            })
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
    }
    
    public _initialize() {
        const managerRoleByMessage = (message, user, callback) => {
            if(message.message.channel.name === 'éditez-vos-grades' || message.message.channel.id.toString() === '532671748059955200')
            {
                const guild = message.message.guild;

                guild.fetchMember(user).then((member) => {
                    callback(member, message.message.mentions.roles);
                }).catch(() => {});
            }
        }

        this.client.on('messageReactionAdd', (message, user) => {
            managerRoleByMessage(message, user, (member, roles) => {
                member.addRoles(roles);
            })
        })

        this.client.on('messageReactionRemove', (message, user) => {
            managerRoleByMessage(message, user, (member, roles) => {
                member.removeRoles(roles);
            })
        })
        
        this.client.on('guildMemberAdd', member => {
            
            if(!this.stops.memberRemove[member.guild.id])
            {
                const channelGeneral = BotGeneral.findGeneralChannel(member.guild.channels);
                
                if(channelGeneral)
                {
                    console.log('SENDING WELCOME');
                    channelGeneral.send(` Bienvenue ${member} ! have fun :wink: !`);
                }
            }
        })

        this.client.on('guildMemberRemove', member => {
            console.log('guildMemberRemove');

            if(!this.stops.memberRemove[member.guild.id])
            {
                member.createDM().then(channel => {
                    console.log('SENDING BYE BYE');
                    return channel.send('hey! ben c\'est dommage de partir :( bonne continuation ...')
                })
            }
        })
    }

    protected ready() {
        setTimeout(() => {
            this.client.user.setAvatar('./embleme alliance.png').catch(() => {});
        }, 5000);

        this.client.user.setActivity('connecter la guilde');
    }

    protected startRuntime() {
        
        this.application.start();

    }
}
