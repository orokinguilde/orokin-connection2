import { Client, Message, ThreadChannel } from "discord.js";
import { ChannelNotification, IChannelNotification } from "./ChannelNotification";
import { EmbedReactionRole, EmbedReactionRole_Config } from "./EmbedReactionRole";
import { NewWorldJobCommand } from "./NewWorldJobCommand";
import { Texter } from "./Texter";
import { IBot } from "../Bot";
import config, { IConfigAction, isDebug } from "../config";
import { Ticker } from "../Ticker";
import { VoiceChannelCreator } from "./VoiceChannelCreator";
import { IActionMessage, IActionTicker } from "./interfaces";

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

                if(instance && instance.executeMessage) {
                    if(instance.executeMessage({
                        bigBrowser: (this.bot as any).bigBrowserV2,
                        guilds: this.bot.client.guilds.valueOf().map(g => g),
                        message: message,
                        params: params
                    })) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    protected static types: IActionType[] = [
        VoiceChannelCreator
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
            Ticker.start((action.periodSec || 60) * 1000, async () => {
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

                    if(instance && instance.executeTicker) {
                        await instance.executeTicker({
                            bigBrowser: (this.bot as any).bigBrowserV2,
                            guilds: guilds
                        })
                    }
                }
                
                if(!action.silent) {
                    console.log(`${logText} [success]`);
                }
            }, action.startDelaySec);
        }
    }
}
