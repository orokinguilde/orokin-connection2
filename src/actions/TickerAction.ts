import { Channel, Guild } from "discord.js";
import moment = require("moment");

export interface ITickerActionDate {
    day?: number
    year?: number
    month?: number
    week?: number
    minute?: number
    hour?: number
}
export interface ITickerActionCtx<T = any> {
    options: T
    guilds: Guild[]
}
export abstract class TickerAction<T = any> {
    protected lastTriggerDate: string;

    protected isCurrentDate(date: ITickerActionDate, allowMultipleTriggers = false) {
        const m = moment();

        const values = [
            date.year !== undefined && m.year(),
            date.month !== undefined && (m.month() + 1),
            date.day !== undefined && m.date(),
            date.week !== undefined && m.week(),
            date.hour !== undefined && m.hour(),
            date.minute !== undefined && m.minute()
        ].filter(v => v as any !== false).join(',')

        console.log([
            m.year(),
            (m.month() + 1),
            m.date(),
            m.week(),
            m.hour(),
            m.minute()
        ]);

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
    
    protected async findMemberById(id: string, ctx: ITickerActionCtx<T>) {
        for(const guild of ctx.guilds) {
            const member = await guild.members.fetch(id);

            if(member) {
                return member;
            }
        }
        
        return undefined;
    }
    protected async findMembersById(ids: string[], ctx: ITickerActionCtx<T>) {
        return await Promise.all(ids.map(id => this.findMemberById(id, ctx)))
    }

    protected async findChannelById(id: string, ctx: ITickerActionCtx<T>) {
        for(const guild of ctx.guilds) {
            const channel = await guild.channels.fetch(id);

            if(channel) {
                return channel;
            }
        }
        
        return undefined;
    }
    protected async findChannelsById(ids: string[], ctx: ITickerActionCtx<T>) {
        return await Promise.all(ids.map(id => this.findChannelById(id, ctx)))
    }

    public abstract execute(options: T, ctx: ITickerActionCtx<T>): Promise<any>
}
