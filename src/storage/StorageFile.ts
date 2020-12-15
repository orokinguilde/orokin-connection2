const fetch = require('isomorphic-fetch');
import { Dropbox } from 'dropbox';

//const request = require('request');

// https://developers.kloudless.com/docs/v1/storage#files-download-a-file

export class StorageFile {
    public constructor(fileId: string) {
        this.fileId = fileId.trim();
    
        if(!StorageFile.apiKey)
            throw new Error('Invalid env variable STORAGE_API_KEY');
    }

    public fileId: string;

    public static apiKey = process.env.STORAGE_API_KEY;

    protected static _dbx: Dropbox;
    public static dbx() {
        if(!StorageFile._dbx) {
            StorageFile._dbx = new Dropbox({ accessToken: StorageFile.apiKey, fetch: fetch });
        }
        
        return StorageFile._dbx;
    }
    
    public setContent(content: string, callback: (e?: any) => void) {
        const dbx = StorageFile.dbx();
        dbx.filesUpload({
            path: this.fileId,
            contents: content,
            mode: {
                '.tag': 'overwrite'
            }
        }).then(() => {
            callback();
        }).catch((e) => {
            console.error(e);
            callback(e);
        });
    }

    public getContent(callback: (e: any, content?: string) => void) {
        StorageFile.dbx().filesDownload({
            path: this.fileId
        }).then((r) => {
            const fileBinary = (r as any).fileBinary;

            console.log('StorageFile has been read with ' + fileBinary.toString().length + ' chars');
            callback(undefined, fileBinary);
        }).catch((e) => {
            console.error(e);
            callback(e);
        });
    }
}
