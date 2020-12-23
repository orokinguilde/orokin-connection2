import { BigBrowserV2, BigBrowserV2UserStats, BigBrowserV2User } from "../BigBrowserV2";
import { TextChannel, VoiceChannel, Message, Attachment } from "discord.js";
import { XPBonusScheduledEvent } from "../ScheduledEvent";
import { IBot } from "../Bot";
import * as moment from 'moment-timezone'

const bannerTemplates = require('../BannerTemplate');
const BigBrowser = require('../BigBrowser');
const globals = require('../globals');
const Banner = require('../Banner');

export class BotBigBrowser extends IBot {
    public constructor(options) {
        super(options);

        this.bigBrowser = new BigBrowser();
        this.bigBrowserV2 = new BigBrowserV2();
    }
    
    public bigBrowser;
    public bigBrowserV2: BigBrowserV2;
    public xpBonusScheduledEvents: XPBonusScheduledEvent[] = [];

    public save() {
        return {
            bigBrowser: this.bigBrowser.save(),
            bigBrowserV2: this.bigBrowserV2.save(),
            xpBonusScheduledEvents: this.xpBonusScheduledEvents.map(item => item.save())
        };
    }

    public _load(obj, ctx) {
        if(obj.bigBrowser) {
            this.bigBrowser.load(obj.bigBrowser, ctx);
        }
        if(obj.bigBrowserV2) {
            this.bigBrowserV2.load(obj.bigBrowserV2, ctx);
        }
        if(obj.xpBonusScheduledEvents) {
            this.xpBonusScheduledEvents = obj.xpBonusScheduledEvents.map(item => new XPBonusScheduledEvent(this.client.guilds.find((c) => c.id === item.guildId), this.bigBrowserV2, item));
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
    
    public onMessage(message: Message, checkForCommand: (regex: RegExp) => boolean, params: string[]) {
        if(!message.author.bot)
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

        if(checkForCommand(/^\s*!ranks$/img)) {

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
                    const attachment = new Attachment(buffer, 'banner.png');
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

        } else if(checkForCommand(/^\s*!server\s+rank\s+reset\s*$/img)) {
            
            BotBigBrowser.adminOnly(message, () => {
                this.bigBrowserV2.resetDayWeekStats(message.guild);
                
                message.reply(`Les stats viennent d'être réinitialisées.`);
            })

        } else if(checkForCommand(/^\s*!server\s+rank\s+ranges\s*$/img)) {

            message.reply(`\`\`\`${this.bigBrowserV2.dayRange.map(range => `::: ${range.name} :::
Jours : ${range.days.map(j => j + 1)}
Début : ${range.start} h
Fin : ${range.end} h`).reduce((p, c) => `${p}\n\n${c}`, '').trim()}\`\`\``);

        } else if(checkForCommand(/^\s*!server\s+rank\s+range\s+([a-zA-Z0-9]+)\s+(\d+)\s+(\d+)\s*$/img)) {

            BotBigBrowser.adminOnly(message, () => {
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

            const createStrLine = (entries: { stats: BigBrowserV2UserStats, user: BigBrowserV2User }[]) => entries
                .map((u, i) => u.stats.xp <= 0 ? `${`${i + 1}.`.padEnd(entries.length.toString().length + 1, ' ')} -` : `${`${i + 1}.`.padEnd(entries.length.toString().length + 1, ' ')} ${(Math.round(u.stats.xp * 100) / 100).toString().padStart(7, ' ')}${Math.round(u.stats.xpBonus * 100) / 100 > 0 ? ` BONNUS (${Math.round(u.stats.xpBonus * 100) / 100})` : ''} :: ${u.user.userData.displayName}`)
                .reduce((p, c) => !p ? c : `${p}\n${c}`, '');
            
            message.delete();
            message.reply('\r\n' + `\`\`\`::: Jour :::
${createStrLine(result.day)}

::: Semaine :::
${createStrLine(result.week)}\`\`\``);
        }
        else if(checkForCommand(/^\s*!dbinfo\s*$/img))
        {
            BotBigBrowser.adminOnly(message, () => {
                const time = (this as any).saver.dataCreationDate;
                message.reply(process.env.APP_SELECTOR + ' :\nDate de création des données : ' + time + ' | ' + moment(time, 'unix').format('DD/MM/Y HH:mm:ss'));
            })
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
            message.channel.send(new Attachment(new Buffer(result), 'stats.csv'));
        }
        else if(checkForCommand(/^\s*!server\s+xp\s+md\s*$/img))
        {
            console.log('SERVER STATS');

            //const result = this.bigBrowser.getTextSummaryByServer(message.guild);
            const result = this.bigBrowserV2.getServerMarkDown(message.guild);

            message.delete();
            message.channel.send(new Attachment(new Buffer(result), 'stats.md'));
        }
        else if(checkForCommand(/^\s*!server\s+xp\s+txt\s*$/img))
        {
            console.log('SERVER STATS');

            //const result = this.bigBrowser.getTextSummaryByServer(message.guild, false);
            const result = this.bigBrowserV2.getServerText(message.guild);

            message.delete();
            message.channel.send(new Attachment(new Buffer(result), 'stats.txt'));
        }
        else if(checkForCommand(/^\s*!global\s+xp\s*$/img))
        {
            console.log('GLOBAL STATS');

            //const result = this.bigBrowser.getTextSummaryByServer();
            const result = this.bigBrowserV2.getServersText(this.client.guilds.map((guild) => guild));

            message.delete();
            message.reply('\r\n' + result);
        }
        else if(checkForCommand(/^\s*!global\s+xp\s+csv\s*$/img))
        {
            console.log('GLOBAL STATS DL');

            //const result = this.bigBrowser.getTextSummaryByServerCSV(undefined, true);
            const result = this.bigBrowserV2.getServersCSV(this.client.guilds.map((guild) => guild), true);

            message.delete();
            message.channel.send(new Attachment(new Buffer(result), 'stats.csv'));
        }
        else if(checkForCommand(/^\s*!global\s+xp\s+md\s*$/img))
        {
            console.log('GLOBAL STATS DL');

            //const result = this.bigBrowser.getTextSummaryByServer();
            const result = this.bigBrowserV2.getServersMarkDown(this.client.guilds.map((guild) => guild));

            message.delete();
            message.channel.send(new Attachment(new Buffer(result), 'stats.md'));
        }
        else if(checkForCommand(/^\s*!global\s+xp\s+txt\s*$/img))
        {
            console.log('GLOBAL STATS DL');

            //const result = this.bigBrowser.getTextSummaryByServer(undefined, false);
            const result = this.bigBrowserV2.getServersText(this.client.guilds.map((guild) => guild));

            message.delete();
            message.channel.send(new Attachment(new Buffer(result), 'stats.txt'));
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

        } else if(checkForCommand(/^\s*!xpbonus\s+pop\s*$/img)) {

            BotBigBrowser.adminOnly(message, () => {
                const xpBonusScheduledEvent = this.xpBonusScheduledEvents.find(item => item.guild.id === message.guild.id);

                if(xpBonusScheduledEvent) {
                    xpBonusScheduledEvent.runtime({
                        periodMs: 0
                    });
                    message.reply(`Pop !`);
                }
            })

        } else if(checkForCommand(/^\s*!xpbonus\s+(enable|disable)\s*$/img)) {

            BotBigBrowser.adminOnly(message, () => {
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

            const propNames = [ 'messageTimeoutSec', 'periodMsMin', 'periodMsMax', 'xpBonusOnPopUp', 'xpBonusOnReact' ]
            const xpBonusScheduledEvent = this.xpBonusScheduledEvents.find(item => item.guild.id === message.guild.id);

            if(xpBonusScheduledEvent) {
                message.reply(`\`\`\`active = ${xpBonusScheduledEvent.active ? 'oui' : 'non'}\n${propNames.map(propName => `${propName} = ${xpBonusScheduledEvent[propName]}`).reduce((p, c) => p + '\n' + c).trim()}\`\`\``)
            }

        } else if(checkForCommand(/^\s*!xpbonus\s+config\s+(messageTimeoutSec|periodMsMin|periodMsMax|xpBonusOnPopUp|xpBonusOnReact)\s+(\d+(?:\.\d+)?)\s*$/img)) {

            BotBigBrowser.adminOnly(message, () => {
                const [, propName, valueStr ] = params;
                const xpBonusScheduledEvent = this.xpBonusScheduledEvents.find(item => item.guild.id === message.guild.id);

                if(xpBonusScheduledEvent) {
                    xpBonusScheduledEvent[propName] = parseFloat(valueStr);
                    message.reply(`Modification confirmée\n\`\`\`${propName} = ${xpBonusScheduledEvent[propName]}\`\`\``)
                }
            })

        } else if(checkForCommand(/^\s*!xpbonus\s+channel\s+(add|remove|list)\s*$/img)) {

            BotBigBrowser.adminOnly(message, () => {
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

        }

        console.log(message.content.trim());
    }
    
    public _initialize() {
    }

    protected ready() {
    }

    protected startRuntime() {
        const updateVoices = () => {
            const voiceChannels = this.client.channels.filter(channel => channel.type === 'voice').array() as VoiceChannel[];

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

            setTimeout(updateVoices, 500);
        }

        setTimeout(updateVoices, 500);

        for(const guild of this.client.guilds.array()) {
            if(!this.xpBonusScheduledEvents.some(item => item.guild.id === guild.id)) {
                this.xpBonusScheduledEvents.push(new XPBonusScheduledEvent(guild, this.bigBrowserV2));
            }
        }
        
        this.xpBonusScheduledEvents.forEach(item => item.start());

        /*if(this.bigBrowser.servers && Object.keys(this.bigBrowser.servers).length > 0)
            this.bigBrowserV2.initWithV1Data(this.bigBrowser.servers);*/

        const updateServersTimeout = 10000;
        const updateServers = async () => {
            await Promise.all(this.client.guilds.array().map(guild => this.bigBrowserV2.updateServer(guild)));

            setTimeout(updateServers, updateServersTimeout);
        }
        
        setTimeout(updateServers, updateServersTimeout);
    }
}
