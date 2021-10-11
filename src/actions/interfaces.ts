import { CategoryChannel, Guild, GuildMember, Message, NewsChannel, StageChannel, StoreChannel, TextChannel, VoiceChannel } from "discord.js";
import { BigBrowserV2 } from "../BigBrowserV2";
import { IBot } from "../Bot";

export interface IAction<T> {
    isCurrentDate(date: ITickerActionDate, allowMultipleTriggers?: boolean): boolean
    findMemberById(id: string, ctx: IActionCtx<T>): Promise<GuildMember>
    findMembersById(ids: string[], ctx: IActionCtx<T>): Promise<GuildMember[]>
    findChannelById(id: string, ctx: IActionCtx<T>): Promise<(TextChannel | VoiceChannel | CategoryChannel | NewsChannel | StoreChannel | StageChannel)>
    findChannelsById(ids: string[], ctx: IActionCtx<T>): Promise<(TextChannel | VoiceChannel | CategoryChannel | NewsChannel | StoreChannel | StageChannel)[]>
}
export interface IActionMessage<T> extends IAction<T> {
    isMessageAction: boolean
    executeMessage(ctx: IActionCtx_Message<T>): boolean
}

export interface ITickerActionDate {
    day?: number
    year?: number
    month?: number
    week?: number
    minute?: number
    hour?: number
}
export interface IActionCtx<T = any> {
    bigBrowser: BigBrowserV2
    guilds: Guild[]
    bot: IBot
}
export interface IActionCtx_Ticker<T = any> extends IActionCtx<T> {
}
export interface IActionCtx_Message<T = any> extends IActionCtx<T> {
    message: Message
    params: string[]
}
export interface IActionTicker<T> extends IAction<T> {
    isTickerAction: boolean
    executeTicker(ctx: IActionCtx_Ticker<T>): Promise<any>
}
