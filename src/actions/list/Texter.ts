import { CategoryChannel, DMChannel, MessageOptions, NewsChannel, StageChannel, StoreChannel, TextChannel, VoiceChannel } from "discord.js";
import { Action } from "../Action";
import { IActionCtx_Ticker, IActionTicker } from "../interfaces";
import { ITickerActionDate } from "../TickerAction";

export class ITexter {
    channelId?: string
    memberId?: string
    date?: ITickerActionDate
    message: string | MessageOptions
}

export class Texter extends Action<ITexter> implements IActionTicker<ITexter> {
    public static typeId = 'Texter'
    public static builder = (options: ITexter) => new Texter(options)

    protected channel: TextChannel | VoiceChannel | CategoryChannel | NewsChannel | StoreChannel | StageChannel | DMChannel;

    public async executeTicker(ctx: IActionCtx_Ticker<ITexter>) {
        if(this.options.date && !this.isCurrentDate(this.options.date)) {
            return;
        }

        if(!this.channel) {
            this.channel = this.options.channelId ? (await this.findChannelById(this.options.channelId, ctx)) : await (await this.findMemberById(this.options.memberId, ctx)).createDM();
        }

        const channel = this.channel;

        if(!channel || !channel.isText()) {
            return;
        }
        
        channel.send(this.options.message);
    }
}
