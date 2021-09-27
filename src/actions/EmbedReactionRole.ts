import { Client, Guild, GuildMember, Message, MessageEmbed, TextChannel } from "discord.js";
import moment = require("moment");
import { BigBrowserV2 } from "../BigBrowserV2";
import { Ticker } from "../Ticker";

interface EmbedReactionRole_Info {
    id: string
    name: string
    role: string
    desc: string
    emoji: string
}

interface EmbedReactionRole_InfoGroup {
    id: string
    color: string
    name: string
    infos: EmbedReactionRole_Info[]
}

type EmbedReactionRole_ConfigFrequency = 'week' | 'day' | 'test' | 'minute' | 'hour'
export interface EmbedReactionRole_Config {
    channelId: string
    userDataKey: string
    frequency?: EmbedReactionRole_ConfigFrequency
    frequencyNb?: number
    frequencyOffset?: number
    messageOnReset?: {
        channelId: string
        message: string
    },
    entries: EmbedReactionRole_InfoGroup[]
    deadlineMode?: 'push-new' | 'flush-reactions'
}

interface UserItems_EmbedReactionRole {
    [id: string]: UserItem_EmbedReactionRole
}
interface UserItem_EmbedReactionRole {
    [index: number | string]: UserEntry_EmbedReactionRole
}
interface UserEntry_EmbedReactionRole {
    id: string
}

interface Server_EmbedReactionRole {
    [index: number | string]: ServerItems_EmbedReactionRole
}
interface ServerItems_EmbedReactionRole {
    [id: string]: ServerEntry_EmbedReactionRole
}
interface ServerEntry_EmbedReactionRole {
    messageId?: string
}

const defaultUserCustomData: () => UserItems_EmbedReactionRole = () => ({});

export class EmbedReactionRole {
    public start(cconf: EmbedReactionRole_Config, params: { client: Client, bigBrowser: BigBrowserV2 }) {
        Ticker.start(4000, () => this.run(cconf, params.client, params.bigBrowser), 1000);
    }
    
    protected createEmbed(info: EmbedReactionRole_InfoGroup) {
        const embed = new MessageEmbed();

        embed.setTitle(info.name);

        if(info.color) {
            embed.setColor(info.color as any);
        }
        
        for(const item of info.infos) {
            embed.addField(`${item.name} ${item.emoji}`, item.desc, true);
        }

        return embed;
    }

    protected embedEquals(embed: MessageEmbed, info: EmbedReactionRole_InfoGroup) {
        return embed
        && embed.title === info.name
        && (!info.color || embed.hexColor === info.color)
        && embed.fields.every(f => info.infos.some(i => f.value === i.desc && f.name === `${i.name} ${i.emoji}`))
    }

    protected frequencyToIndex(freq?: EmbedReactionRole_ConfigFrequency, frequencyNb: number = 1, frequencyOffset: number = 0) {
        const getBase = () => {
            const m = moment();
            switch(freq) {
                case 'week':    return m.year() * 1000 + m.week();
                case 'day':     return m.year() * 1000 + m.dayOfYear();
                case 'hour':    return (m.year() * 1000 + m.dayOfYear()) * 100 + m.hour();
                case 'minute':  return ((m.year() * 1000 + m.dayOfYear()) * 100 + m.hour()) * 100 + m.minute();
                case 'test':    return Math.floor((((m.year() * 1000 + m.dayOfYear()) * 100 + m.hour()) * 100 + m.minute()) / 2);
                default:        return '_';
            }
        }

        let value = getBase();
        if(typeof value === 'number') {
            value = Math.floor((value + frequencyOffset) / frequencyNb);
        }
        return value;
    }
    
    public async run(cconf: EmbedReactionRole_Config, client: Client, bigBrowser: BigBrowserV2) {
        cconf.deadlineMode = cconf.deadlineMode ?? 'push-new';

        const index = this.frequencyToIndex(cconf.frequency, cconf.frequencyNb, cconf.frequencyOffset);
        const userDataKey: string = cconf.userDataKey;
    
        const guilds = client.guilds.valueOf().map(g => g);

        const promises: (() => Promise<any>)[] = [];
        let isReseting = false;
    
        for(const guild of guilds) {
            const channel = await guild.channels.fetch(cconf.channelId) as TextChannel;

            if(!channel) {
                continue;
            }

            const guildMembers = (await guild.members.fetch()).map(m => m);
            const server = bigBrowser.getServer(guild);
    
            if(!server.customData) {
                server.customData = {};
            }
            if(!server.customData[userDataKey]) {
                server.customData[userDataKey] = {};
            }
            const customData = server.customData[userDataKey] as Server_EmbedReactionRole;
            if(!customData[index]) {
                customData[index] = {} as ServerItems_EmbedReactionRole;
            }
            const entries = customData[index];
    
            for(const centry of cconf.entries) {
                let entry = entries[centry.id];
                if(!entry) {
                    entry = {};
                    entries[centry.id] = entry;

                    promises.push(() => this.firstCleanRoles(guildMembers, centry));
                    isReseting = true;
                }

                if(!customData[centry.id]) {
                    customData[centry.id] = {};
                }
                const serverEntry = customData[centry.id] as { messageId: string };
    
                let message: Message;
                try {
                    message = entry.messageId ? (await channel.messages.fetch(entry.messageId)) : undefined;
                } catch(ex) {
                }
    
                if(!message) {
                    if(cconf.deadlineMode === 'flush-reactions' && serverEntry.messageId) {
                        try {
                            message = await channel.messages.fetch(serverEntry.messageId);
                            await Promise.all([
                                this.embedEquals(message.embeds[0], centry) ? undefined : message.edit({ embeds: [ this.createEmbed(centry) ] }),
                                message.reactions.removeAll()
                            ]);
                        } catch(ex) {
                        }
                    }

                    if(!message) {
                        message = await channel.send({
                            embeds: [ this.createEmbed(centry) ]
                        });
                        serverEntry.messageId = message.id;
                    }
                    
                    entry.messageId = message.id;
                    for(const inf of centry.infos) {
                        promises.push(() => message.react(inf.emoji));
                    }
                } else {
                    promises.push(() => this.mngMsg(message, guildMembers, bigBrowser, index, centry, userDataKey));
                }
            }

            if(isReseting && cconf.messageOnReset) {
                promises.unshift(async () => {
                    const chan = await guild.channels.fetch(cconf.messageOnReset.channelId) as TextChannel;
                    if(chan) {
                        chan.send(cconf.messageOnReset.message);
                    }
                })
            }

            if(channel) {
                break;
            }
        }

        await Promise.all(promises.map(v => v()));
    }

    protected async firstCleanRoles(guildMembers: GuildMember[], group: EmbedReactionRole_InfoGroup) {
        const roles = group.infos.map(i => i.role);
        await Promise.all(guildMembers.map(m => {
            if(m.roles.valueOf().some(r => roles.includes(r.id))) {
                return m.roles.remove(roles)
            } else {
                return undefined;
            }
        }));
    }
    
    protected async mngMsg(msg: Message, members: GuildMember[], bigBrowser: BigBrowserV2, index: number | string, group: EmbedReactionRole_InfoGroup, userDataKey: string) {
        const reactions = msg.reactions.valueOf().map(r => r);
        const entryKey = group.id;
    
        const server = bigBrowser.getServer(msg.guild);
        const affectedUsers: string[] = [];
    
        const promises: Promise<any>[] = [];

        for(const reaction of reactions) {
            const emojiIds = [ reaction.emoji.identifier, reaction.emoji.id, reaction.emoji.toString(), reaction.emoji.name ].filter(v => v);
            const metier = group.infos.find(m => emojiIds.includes(m.emoji));
    
            if(metier) {
                for(const userId of (await reaction.users.fetch()).map(u => u.id)) {
                    const userBigBrowser = bigBrowser.getUserById(msg.guild, userId);
                    if(!userBigBrowser.isBot) {
                        const metiers = userBigBrowser.getCustomData<UserItems_EmbedReactionRole>(userDataKey, defaultUserCustomData);
                        if(!metiers[entryKey]) {
                            metiers[entryKey] = {};
                        }
                        const currentMetierId = metiers[entryKey][index]?.id;
    
                        if(currentMetierId !== metier.id) {
                            const member = members.find(m => m.id === userId);

                            if(member) {
                                promises.push(member.roles.add(metier.role));
                                metiers[entryKey][index] = {
                                    id: metier.id
                                };
                            }
                        }
    
                        affectedUsers.push(userBigBrowser.id);
                    }
                }
            }
        }
    
        for(const userId in server.users) {
            if(!affectedUsers.includes(userId)) {
                const user = bigBrowser.getUserById(server, userId);
                if(!user.isBot) {
                    const metiers = user.getCustomData<UserItems_EmbedReactionRole>(userDataKey, defaultUserCustomData);
                    if(metiers[entryKey]) {
                        const entry = metiers[entryKey][index];
    
                        if(entry) {
                            const metier = group.infos.find(m => m.id === entry.id);
                            const member = members.find(m => m.id === user.id);

                            if(member.roles.valueOf().some(r => r.id === metier.role)) {
                                promises.push(member.roles.remove(metier.role));
                            }
                            metiers[entryKey][index] = undefined;
                        }
                    }
                }
            }
        }
        await Promise.all(promises);
    }    
}
