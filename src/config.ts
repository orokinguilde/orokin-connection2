import { MessageEmbedOptions } from 'discord.js';
import * as path from 'path'
import { IBigBrowserV2Rangs } from './BigBrowserV2';
import { EmbedReactionRole_Config } from './actions/EmbedReactionRole';
import { IChannelNotification } from './actions/ChannelNotification';
import { INewWorldJobCommandOptions } from './actions/NewWorldJobCommand';

export type APP_SELECTOR = 'BigBrowser' | 'General' | string

export interface IConfigMemberChange {
    channelId?: string
    message: string
    embeds?: MessageEmbedOptions[]
}

export interface IConfigAction {
    on: APP_SELECTOR,
    enabled?: boolean
    name?: string,
    periodSec?: number,
    startDelaySec?: number,
    list: {
        type: string,
        regex?: string
        regexFlags?: string
        enabled?: boolean
        threadId: string | string[],
        keepUnarchived?: boolean,
        options?: EmbedReactionRole_Config | IChannelNotification | INewWorldJobCommandOptions
    }[]
}

export default {
    server: {
        name: process.env.SERVER_FOLDER_NAME,
        fsFriendlyName: process.env.SERVER_FOLDER_NAME.replace(/[^a-zA-Z0-9_-]/, '_'),
        ranks: require(path.join(__dirname, '..', 'server', process.env.SERVER_FOLDER_NAME, `ranks.json`)) as IBigBrowserV2Rangs,
        info: require(path.join(__dirname, '..', 'server', process.env.SERVER_FOLDER_NAME, `info.json`)) as {
            name?: string
            activity: string
            defaultAvatarURL: string
            game: {
                processName: string
                name: string
            }
            rankBannerImgUrl: string
            xp: {
                voiceMs: number
                textChars: number
            },
            help?: {
                command: string
                displayIn: APP_SELECTOR
                data: {
                    _default: any
                    "": any
                    [key: string]: any
                }
            },
            memberChange?: {
                on: APP_SELECTOR,
                add?: IConfigMemberChange[],
                remove?: IConfigMemberChange[]
            },
            actions?: IConfigAction[]
        }
    }
};
