import { Guild, GuildMember, TextChannel, VoiceChannel } from "discord.js";

export class IChannelNotification {
    channelsToWatch: string[]
    channelsToNotify: string[]
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
            const members = channel.members.map(x => x);
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
                .replace(/\{nb\}/img, newNotEmptyChannels.length.toString())

            for(const channel of this.channelsToNotify) {
                channel.send({
                    content: msg
                })
            }
        }
    }
}
