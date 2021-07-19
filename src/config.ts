import * as path from 'path'
import { IBigBrowserV2Rangs } from './BigBrowserV2';

export default {
    server: {
        name: process.env.SERVER_FOLDER_NAME,
        fsFriendlyName: process.env.SERVER_FOLDER_NAME.replace(/[^a-zA-Z0-9_-]/, '_'),
        ranks: require(path.join(__dirname, '..', 'server', process.env.SERVER_FOLDER_NAME, `ranks.json`)) as IBigBrowserV2Rangs,
        info: require(path.join(__dirname, '..', 'server', process.env.SERVER_FOLDER_NAME, `info.json`)) as {
            activity: string,
            rankBannerImgUrl: string,
            help?: {
                command: string
                displayIn: 'BigBrowser' | string
                data: {
                    _default: any
                    "": any
                    [key: string]: any
                }
            }
        }
    }
};
