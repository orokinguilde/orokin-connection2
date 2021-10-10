import { Guild, GuildMember, TextChannel, VoiceChannel } from "discord.js";
import moment = require("moment");

export class IChannelNotification {
    channelsToWatch: string[]
    channelsToNotify: string[]
    triggerOnlyOnNoRole?: boolean
    message: string
}

export class ChannelNotification {
    protected channelsNotEmpty: string[] = [];
    protected channelsToNotify: TextChannel[];
    protected channelsToWatch: VoiceChannel[];

    public async check(options: IChannelNotification, guilds: Guild[]) {
        if(!this.channelsToNotify) {
            this.channelsToNotify = [];

            for(const id of options.channelsToNotify) {
                for(const guild of guilds) {
                    try {
                        const channel = await guild.channels.fetch(id);

                        if(channel.isText()) {
                            this.channelsToNotify.push(channel as TextChannel);
                        }

                        break;
                    } catch(ex) {
                    }
                }
            }
        }

        if(this.channelsToNotify.length === 0) {
            return;
        }
        
        if(!this.channelsToWatch) {
            this.channelsToWatch = [];

            for(const id of options.channelsToWatch) {
                for(const guild of guilds) {
                    try {
                        const channel = await guild.channels.fetch(id);

                        if(channel.isVoice()) {
                            this.channelsToWatch.push(channel as VoiceChannel);
                        }

                        break;
                    } catch(ex) {
                    }
                }
            }
        }

        if(this.channelsToWatch.length === 0) {
            return;
        }

        const newNotEmptyChannels: VoiceChannel[] = []
        const users: GuildMember[] = []
        const notEmptyChannels: VoiceChannel[] = []
        for(const channel of this.channelsToWatch) {
            let members = channel.members.map(x => x);

            if(options.triggerOnlyOnNoRole) {
                members = members.filter(m => m.roles.cache.size === 1); // 1 => role @everyone
            }

            if(members.length > 0) {
                users.push.apply(users, members);
                notEmptyChannels.push(channel);
            }
        }
        
        // add members
        for(const notEmptyChannel of notEmptyChannels) {
            const id = notEmptyChannel.id;
            const index = this.channelsNotEmpty.indexOf(id);

            if(index < 0) {
                newNotEmptyChannels.push(notEmptyChannel);
                this.channelsNotEmpty.push(id);
            }
        }
        for(const id of this.channelsNotEmpty.map(v => v)) {
            const exists = notEmptyChannels.some(m => m.id === id);

            if(!exists) {
                this.channelsNotEmpty.splice(this.channelsNotEmpty.indexOf(id), 1);
            }
        }

        if(newNotEmptyChannels.length > 0) {
            const msg = options.message
                .replace(/\{links\}/img, newNotEmptyChannels.map(m => m.toString()).join(', '))
                .replace(/\{names\}/img, newNotEmptyChannels.map(m => m.name).join(', '))
                .replace(/\{users\}/img, users.map(m => m.toString()).join(' et '))
                .replace(/\{usersWithCreatedDurations\}/img, users.map(m => {
                    try {
                        const duration = moment.duration(Date.now() - m.user.createdTimestamp);
                        return `${m.toString()} (créé il y a ${duration.years()} an${duration.years() > 1 ? 's' : ''} ${duration.months()} mois ${duration.days()} jour${duration.days() > 1 ? 's' : ''})`;
                    } catch(ex) {
                        return m.toString();
                    }
                }).join(' et '))
                .replace(/\{nb\}/img, newNotEmptyChannels.length.toString())

            for(const channel of this.channelsToNotify) {
                channel.send({
                    content: msg
                })
            }
        }
    }
}
