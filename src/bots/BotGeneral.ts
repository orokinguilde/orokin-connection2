import { TextChannel, Message, MessageEmbed, GuildChannel } from "discord.js";
import { IBot } from "../Bot";
import * as moment from 'moment-timezone'
import config from '../config'
import { Help } from "../Help";

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
        const colors: [number, number, number][] = [
            [ 0x01, 0xFE, 0xDC ],
            [ 0xFE, 0x01, 0x01 ],
            [ 0xFE, 0x6F, 0x01 ],
            [ 0xFE, 0xF6, 0x01 ],
            [ 0x6F, 0xFE, 0x01 ],
            [ 0x12, 0x01, 0xFE ],
            [ 0x7F, 0x01, 0xFE ],
            [ 0xFE, 0x01, 0xC3 ],
            [ 0x01, 0x66, 0xFE ],
            [ 0xFE, 0x01, 0x77 ]
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

            for(const user of this.client.users.valueOf().map(u => u)) {
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
        
        var embed = new MessageEmbed()
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
    
    public async onMessage(message: Message, checkForCommand: (regex: RegExp) => boolean, params: string[]) {

        const setCommonSetting = (message, callback) => {
            BotGeneral.adminOnly(message, () => {
                callback();

                message.delete();
            });
        }

        if(checkForCommand(/^\s*!trio\s*$/img))
        {
            this.application.addServerChannel(message.channel);
            message.delete();
        }
        else if(checkForCommand(/^\s*!mentor .+$/img))
        {
            console.log('MENTOR');
            const mentions = message.mentions.members.map(m => m);

            if(mentions.length === 1)
            {
                const disciple = mentions[0];

                if(this.mentoring.setMentor(message.member, disciple))
                {
                    message.reply(`recrutement enregistré !`);
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
        else if(checkForCommand(Help.instance.regex))
        {
            Help.instance.manageMessage(message, params[1]);
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
        this.client.on('guildMemberAdd', member => {
            console.log('GA');
            
            if(!this.stops.memberRemove[member.guild.id])
            {
                const channelGeneral = BotGeneral.findGeneralChannel(member.guild.channels.valueOf().map(g => g as GuildChannel));
                
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
            this.client.user.setAvatar(`./server/${process.env.SERVER_FOLDER_NAME}/icon.png`).catch(() => {});
        }, 5000);

        this.client.user.setActivity(config.server.info.activity);
    }

    protected _startRuntime() {
        
        this.application.start();

    }
}
