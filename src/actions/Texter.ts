import { Channel, Guild, MessageOptions, MessagePayload } from "discord.js";
import moment = require("moment");
import { ITickerActionCtx, ITickerActionDate, TickerAction } from "./TickerAction";

export class ITexter {
    channelId?: string
    memberId?: string
    date?: ITickerActionDate
    message: string | MessageOptions
}

export class Texter extends TickerAction<ITexter> {
    public async execute(options: ITexter, ctx: ITickerActionCtx<ITexter>) {
        if(options.date && !this.isCurrentDate(options.date)) {
            return;
        }

        const channel = options.channelId ? (await this.findChannelById(options.channelId, ctx)) : await (await this.findMemberById(options.memberId, ctx)).createDM();

        if(!channel || !channel.isText()) {
            return;
        }
        
        channel.send(options.message);
    }
}
