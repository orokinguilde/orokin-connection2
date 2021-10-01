import { Client, Message, ThreadChannel } from "discord.js";
import { ChannelNotification, IChannelNotification } from "./actions/ChannelNotification";
import { EmbedReactionRole, EmbedReactionRole_Config } from "./actions/EmbedReactionRole";
import { NewWorldJobCommand } from "./actions/NewWorldJobCommand";
import { IBot } from "./Bot";
import config, { IConfigAction, isDebug } from "./config";
import { Ticker } from "./Ticker";

export interface IActionCtx {
    message?: Message
    params?: string[]
}
export interface IAction {
    execute(options: any, ctx: IActionCtx): void
}

export class ActionsManager {
    public constructor(protected bot: IBot) {
    }

    public isEnabled(option: { enabled?: any }): boolean {
        if(typeof option?.enabled === 'boolean') {
            return option?.enabled
        } else if(typeof option?.enabled === 'string') {
            return option?.enabled === (isDebug ? 'dev' : 'prod')
        }

        return true;
    }
    
    public catchMessage(message: Message, checkForCommand: (regexCmd: RegExp) => boolean, params: string[]): boolean {

        for(const action of this.actions) {
            for(const item of action.list) {
                const ttype = this.types[item.type];
                if(!this.isEnabled(item) || !ttype?.isMessage) {
                    continue;
                }

                if(checkForCommand(new RegExp(item.regex, item.regexFlags ?? 'img'))) {
                    const instance = this.getInstance<IAction>(item, ttype.builder);
                    instance.execute(item.options, {
                        message: message,
                        params: params
                    });

                    return true;
                }
            }
        }

        return false;
    }

    protected types = {
        'ChannelNotification': { isTicker: true },
        'EmbedReactionRole': { isTicker: true },
        'thread': { isTicker: true },
        'NewWorldJobCommand': { isMessage: true, builder: () => new NewWorldJobCommand() },
    }

    protected getInstance<T>(item: any, builder: () => T): T {
        item.__instance = item.__instance ?? builder();
        return item.__instance as T;
    }

    protected get actions() {
        const result: IConfigAction[] = [];

        if(config.server.info.actions && config.server.info.actions.length > 0) {
            const actions = config.server.info.actions.filter(a => a.on === process.env.APP_SELECTOR);

            for(let i = 0; i < actions.length; ++i) {
                const action = actions[i];

                if(!this.isEnabled(action)) {
                    continue;
                }

                result.push(action);
            }
        }

        return result;
    }

    public createTickers() {
        for(const action of this.actions) {
            Ticker.start((action.periodSec || 60) * 1000, async () => {
                const logText = `Execution de l'action : ${action.name}`;
                console.log(`${logText} [running]`);

                const guilds = this.bot.client.guilds.valueOf().map(g => g);

                for(const item of action.list) {
                    if(!this.isEnabled(item) || !this.types[item.type]?.isTicker) {
                        continue;
                    }

                    switch(item.type) {
                        case 'ChannelNotification': {
                            const instance = this.getInstance(item, () => new ChannelNotification());
                            await instance.check(item.options as IChannelNotification, guilds);
                            break;
                        }

                        case 'EmbedReactionRole': {
                            if(!(this.bot as any).bigBrowserV2) {
                                console.error(`L'action ${item.type}`);
                            } else {
                                const instance = this.getInstance(item, () => new EmbedReactionRole());
                                await instance.run(item.options as EmbedReactionRole_Config, this.bot.client, (this.bot as any).bigBrowserV2);
                            }
                            break;
                        }

                        case 'thread': {
                            const threadIds = Array.isArray(item.threadId) ? item.threadId : [ item.threadId ];

                            for(const threadId of threadIds) {
                                let found = false;
                                for(const guild of guilds) {
                                    const channel: ThreadChannel = await guild.channels.fetch(threadId) as any;
                                    
                                    if(channel) {
                                        if(item.keepUnarchived) {
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
                            break;
                        }
                    }
                }
                
                console.log(`${logText} [success]`);
            }, action.startDelaySec);
        }
    }
}
