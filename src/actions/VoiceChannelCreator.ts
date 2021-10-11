import { GuildMember, VoiceChannel } from "discord.js";
import { Action } from "./Action";
import { IActionCtx, IActionCtx_Message, IActionCtx_Ticker, IActionMessage, IActionTicker } from "./interfaces";

export interface IVoiceChannelCreatorOptions {
    id?: string
    channelsId: string[]
    newChannelName?: string
}
type Option = IVoiceChannelCreatorOptions

export interface IVoiceChannelCreator_ServerCustomData_CreatedChannel {
    channelId: string
    creatorId: string
    admins: string[]
}
export interface IVoiceChannelCreator_ServerCustomData {
    createdChannels: IVoiceChannelCreator_ServerCustomData_CreatedChannel[]
}

export class VoiceChannelCreator extends Action implements IActionTicker<Option>, IActionMessage<Option> {
    public static typeId = 'VoiceChannelCreator'
    public static builder = (options: Option) => new VoiceChannelCreator(options)

    protected channelsToWatch: { data: IVoiceChannelCreator_ServerCustomData, channel: VoiceChannel }[]
    
    public executeMessage(ctx: IActionCtx_Message<Option>): boolean {
        this.rename(ctx);

        return false;
    }

    protected rename(ctx: IActionCtx_Message<Option>) {
        const match = /^!channel\s+rename\s+(.+)$/img.exec(ctx.message.content);

        if(match) {
            (async () => {
                const name = match[1].trim();
                const authorId = ctx.message.member.id;
                const entry = await this.findByAdminId(authorId, ctx);

                if(entry) {
                    entry.channel.setName(name);
                }
            })()
        }
    }
    protected giveLead(ctx: IActionCtx_Message<Option>) {
        const match = /^!channel\s+give\s+/img.exec(ctx.message.content);

        if(match) {
            (async () => {
                const authorId = ctx.message.member.id;
                const targetMember = ctx.message.mentions.members.map(m => m)[0];
                
                if(targetMember) {
                    const entry = await this.findByAdminId(authorId, ctx);
    
                    if(entry) {
                        if(!entry.data.admins.includes(targetMember.id)) {
                            entry.data.admins.push(targetMember.id);
                        }
                    }
                }
            })()
        }
    }
    protected removeLead(ctx: IActionCtx_Message<Option>) {
        const match = /^!channel\s+remove\s+/img.exec(ctx.message.content);

        if(match) {
            (async () => {
                const authorId = ctx.message.member.id;
                const targetMember = ctx.message.mentions.members.map(m => m)[0];
                
                if(targetMember) {
                    const entry = await this.findByAdminId(authorId, ctx);
    
                    if(entry) {
                        const index = entry.data.admins.indexOf(targetMember.id);
                        if(index !== -1) {
                            entry.data.admins.splice(index, 1);
                        }
                    }
                }
            })()
        }
    }

    protected async findByAdminId(adminId: string, ctx: IActionCtx_Message<Option>) {
        for(const cc of this.listByAdminId(adminId)) {
            const channel = await this.findChannelById(cc.channelId, ctx);
            if(channel && channel.members.some(m => m.id === adminId)) {
                return {
                    data: cc,
                    channel: channel
                };
            }
        }

        return undefined
    }
    protected listByAdminId(adminId: string) {
        const list: IVoiceChannelCreator_ServerCustomData_CreatedChannel[] = [];
        for(const channelToWatch of this.channelsToWatch) {
            for(const cc of channelToWatch.data.createdChannels) {
                if(!cc.admins) {
                    cc.admins = [];
                }

                if(cc.creatorId === adminId || cc.admins.includes(adminId)) {
                    list.push(cc);
                }
            }
        }
        return list;
    }

    protected getNewChannelName(member: GuildMember) {
        const newChannelName = this.options.newChannelName ?? "Salon ({name})";

        return newChannelName
            .replace(/\{name\}/img, member.displayName);
    }

    public async executeTicker(ctx: IActionCtx_Ticker<Option>) {
        const dataKey = this.options.id ?? 'VoiceChannelCreator';

        if(!this.channelsToWatch) {
            this.channelsToWatch = [];

            for(const guild of ctx.guilds) {
                const channels = await this.findChannelsById(this.options.channelsId, ctx);
                this.channelsToWatch.push.apply(this.channelsToWatch, channels.map(c => ({
                    data: (() => {
                        const server = ctx.bigBrowser.getServer(guild);
            
                        if(!server.customData) {
                            server.customData = {};
                        }
            
                        let data: IVoiceChannelCreator_ServerCustomData = server.customData[dataKey];
                        if(!data) {
                            data = {
                                createdChannels: []
                            };
                            server.customData[dataKey] = data;
                        }

                        return data;
                    })(),
                    channel: c
                })))
            }
        }

        for(const entry of this.channelsToWatch) {
            for(let i = 0; i < entry.data.createdChannels.length; ++i) {
                const createdChannel = entry.data.createdChannels[i];
                const channel = await this.findChannelById(createdChannel.channelId, ctx);

                if(!channel || channel.members.size === 0) {
                    channel?.delete();
                    entry.data.createdChannels.splice(i, 1);
                    --i;
                }
            }

            for(const member of entry.channel.members.map(m => m)) {
                const channel = await entry.channel.guild.channels.create(this.getNewChannelName(member), {
                    type: "GUILD_VOICE",
                    parent: entry.channel.parent,
                    position: entry.channel.position + 1000
                })
                await member.voice.setChannel(channel, 'Channel créé automatiquement');

                entry.data.createdChannels.push({
                    channelId: channel.id,
                    creatorId: member.id,
                    admins: []
                })
            }
        }
    }
}
