import { MessageEmbedOptions } from 'discord.js';
import * as path from 'path'
import { IBigBrowserV2Rangs } from './BigBrowserV2';

export interface IConfigMemberChange {
    channelId?: string
    message: string
    embeds?: MessageEmbedOptions[]
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
                displayIn: 'BigBrowser' | 'General' | string
                data: {
                    _default: any
                    "": any
                    [key: string]: any
                }
            },
            memberChange?: {
                add?: IConfigMemberChange[],
                remove?: IConfigMemberChange[]
            },
            actions?: {
                on: 'BigBrowser' | 'General' | string,
                name?: string,
                periodSec?: number,
                list: {
                    type: 'thread',
                    threadId: string | string[],
                    keepUnarchived?: boolean
                }[]
            }[]
        }
    }
};
