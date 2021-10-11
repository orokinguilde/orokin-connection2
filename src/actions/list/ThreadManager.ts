import { ThreadChannel } from "discord.js";
import { Action } from "../Action";
import { IActionCtx_Ticker, IActionTicker } from "../interfaces";

export class IThreadManager {
    threadId: string[]
    keepUnarchived: boolean
}

export class ThreadManager extends Action<IThreadManager> implements IActionTicker<IThreadManager> {
    public static typeId = 'ThreadManager'
    public static builder = (options) => new ThreadManager(options)

    public async executeTicker(ctx: IActionCtx_Ticker<IThreadManager>) {
        const threadIds = Array.isArray(this.options.threadId) ? this.options.threadId : [ this.options.threadId ];

        for(const threadId of threadIds) {
            let found = false;
            for(const guild of ctx.guilds) {
                const channel: ThreadChannel = await guild.channels.fetch(threadId) as any;
                
                if(channel) {
                    if(this.options.keepUnarchived) {
                        await channel.setArchived(false);
                    }

                    found = true;
                    break;
                }
            }

            if(!found) {
                console.log(`Thread ${threadId} introuvable`);
            }
        }
    }
}
