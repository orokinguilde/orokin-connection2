import { BaseFetchOptions, Guild } from "discord.js";
import moment = require("moment");
import { IAction, IActionCtx, IActionMessage, IActionTicker, ITickerActionDate } from "./interfaces";

export abstract class Action<T = any> implements IAction<T> {
    public constructor(public options: T) {
    }
    
    public get isTickerAction() {
        return !!(this as any as IActionTicker<any>).executeTicker;
    }
    public get isMessageAction() {
        return !!(this as any as IActionMessage<any>).executeMessage;
    }

    protected lastTriggerDate: string;

    public isCurrentDate(date: ITickerActionDate, allowMultipleTriggers = false) {
        const m = moment();

        const values = [
            date.year !== undefined && m.year(),
            date.month !== undefined && (m.month() + 1),
            date.day !== undefined && m.date(),
            date.week !== undefined && m.week(),
            date.hour !== undefined && m.hour(),
            date.minute !== undefined && m.minute()
        ].filter(v => v as any !== false).join(',')

        if(date && (allowMultipleTriggers || this.lastTriggerDate !== values)) {
            if((date.year === undefined || date.year === m.year())
            && (date.month === undefined || (date.month === m.month() + 1))
            && (date.day === undefined || date.day === m.date())
            && (date.week === undefined || date.week === m.week())
            && (date.hour === undefined || date.hour === m.hour())
            && (date.minute === undefined || date.minute === m.minute())
            ) {
                this.lastTriggerDate = values;
                return true;
            }
        }

        return false;
    }

    public async getBotAsMember(guild: Guild) {
        return await this.findMemberByUserId(guild.client.user.id, guild);
    }
    
    public async findMemberByUserId(userId: string, guild: Guild) {
        try {
            const members = await guild.members.fetch();

            return members.find(m => m.user.id === userId);
        } catch(ex) {
        }
        
        return undefined;
    }
    public async findMemberById(id: string, ctx: IActionCtx<T>) {
        for(const guild of ctx.guilds) {
            try {
                const member = await guild.members.fetch(id);

                if(member) {
                    return member;
                }
            } catch(ex) {
            }
        }
        
        return undefined;
    }
    public async findMembersById(ids: string[], ctx: IActionCtx<T>) {
        return await Promise.all(ids.map(id => this.findMemberById(id, ctx)))
    }

    public async findChannelById(id: string, ctx: IActionCtx<T>, fetchOption?: BaseFetchOptions) {
        for(const guild of ctx.guilds) {
            try {
                const channel = await guild.channels.fetch(id, fetchOption);

                if(channel) {
                    return channel;
                }
            } catch(ex) {
            }
        }
        
        return undefined;
    }
    public async findChannelsById(ids: string[], ctx: IActionCtx<T>, fetchOption?: BaseFetchOptions) {
        return await Promise.all(ids.map(id => this.findChannelById(id, ctx, fetchOption)))
    }
}
