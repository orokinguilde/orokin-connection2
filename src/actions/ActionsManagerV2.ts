import { Message } from "discord.js";
import { IBot } from "../Bot";
import config, { IConfigAction, isDebug } from "../config";
import { Ticker, TickerCtx } from "../Ticker";
import { VoiceChannelCreator } from "./list/VoiceChannelCreator";
import { IActionMessage, IActionTicker } from "./interfaces";
import { Texter } from "./list/Texter";
import { ChannelNotification } from "./list/ChannelNotification";
import { ThreadManager } from "./list/ThreadManager";
import { EmbedReactionRole } from "./list/EmbedReactionRole";
import { ErrorManager } from "../ErrorManager";
import { NotifyRestart } from "./list/NotifyRestart";

export interface IActionCtx {
    message?: Message
    params?: string[]
}
export interface IAction {
    execute(options: any, ctx: IActionCtx): void
}

export interface IActionType {
    typeId: string
    builder: (options: any) => any
}

export class ActionsManagerV2 {
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
                if(!this.isEnabled(item)) {
                    continue;
                }

                const instance = this.getInstance<IActionMessage<any>>(item);

                if(instance && !instance.isDisposed && instance.executeMessage) {
                    if(instance.mustDispose) {
                        instance.dispose();
                    } else {
                        if(instance.executeMessage({
                            bigBrowser: (this.bot as any).bigBrowserV2,
                            guilds: this.bot.client.guilds.valueOf().map(g => g),
                            message: message,
                            bot: this.bot,
                            params: params
                        })) {
                            return true;
                        }
                    }
                }
            }
        }

        return false;
    }

    protected static types: IActionType[] = [
        VoiceChannelCreator,
        Texter,
        ChannelNotification,
        EmbedReactionRole,
        NotifyRestart,
        ThreadManager
    ]

    protected getInstance<T = any>(item: any, builder?: (options) => T): T {
        item.__instance = item.__instance ?? (builder && builder(item.options));
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

                for(const item of action.list) {
                    if(this.isEnabled(item)) {
                        const type = ActionsManagerV2.types.find(t => t.typeId === item.type);

                        if(type) {
                            this.getInstance(item, type.builder);
                        }
                    }
                }

                result.push(action);
            }
        }

        return result;
    }

    public createTickers() {
        for(const action of this.actions) {
            Ticker.start((action.periodSec || 60) * 1000, async (tickerCtx: TickerCtx) => {
                const logText = `Execution de l'action v2 : ${action.name}`;
                if(!action.silent) {
                    console.log(`${logText} [running]`);
                }

                const guilds = this.bot.client.guilds.valueOf().map(g => g);

                for(const item of action.list) {
                    if(!this.isEnabled(item)) {
                        continue;
                    }

                    const instance = this.getInstance<IActionTicker<any>>(item);

                    if(instance?.isDisposed) {
                        tickerCtx.dispose = true;
                    }

                    if(instance && !instance.isDisposed && instance.executeTicker) {
                        if(instance.mustDispose) {
                            instance.dispose();
                            tickerCtx.dispose = true;
                        } else {
                            await ErrorManager.instance.wrapPromise('ActionsManagerV2', instance.executeTicker({
                                bigBrowser: (this.bot as any).bigBrowserV2,
                                bot: this.bot,
                                guilds: guilds
                            }))
                        }
                    }
                }
                
                if(!action.silent) {
                    console.log(`${logText} [success]`);
                }
            }, action.startDelaySec);
        }
    }
}
