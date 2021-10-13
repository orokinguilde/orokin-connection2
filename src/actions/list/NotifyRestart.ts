import { MessageOptions } from "discord.js";
import moment = require("moment");
import { Action } from "../Action";
import { IActionCtx_Ticker, IActionTicker } from "../interfaces";

export class INotifyRestart {
    channelId?: string
    memberId?: string
    message?: string | MessageOptions
}

export class NotifyRestart extends Action<INotifyRestart> implements IActionTicker<INotifyRestart> {
    public static typeId = 'NotifyRestart'
    public static builder = (options) => new NotifyRestart(options)

    protected notified = false;

    public get mustDispose() {
        return this.notified;
    }

    public async executeTicker(ctx: IActionCtx_Ticker<INotifyRestart>) {
        if(this.notified) {
            return;
        }
        this.notified = true;
        
        const channel = this.options.channelId ? (await this.findChannelById(this.options.channelId, ctx)) : await (await this.findMemberById(this.options.memberId, ctx)).createDM();

        if(!channel || !channel.isText()) {
            return;
        }
        
        channel.send(this.options.message ?? `Bot restarted at ${moment().toISOString()}`);
    }
}
