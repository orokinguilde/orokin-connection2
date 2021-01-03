const fetch = require('isomorphic-fetch');
import { Dropbox } from 'dropbox';

//const request = require('request');

// https://developers.kloudless.com/docs/v1/storage#files-download-a-file

export class StorageFile {
    public constructor(fileId: string) {
        this.fileId = fileId.trim();
        this.fileIdTemp = fileId.trim() + `_temp`;
        this.fileIdSave1 = fileId.trim() + `_save`;
        this.fileIdSave2 = fileId.trim() + `_save2`;
    
        if(!StorageFile.apiKey)
            throw new Error('Invalid env variable STORAGE_API_KEY');
    }

    public fileId: string;
    public fileIdTemp: string;
    public fileIdSave1: string;
    public fileIdSave2: string;

    public static apiKey = process.env.STORAGE_API_KEY;

    protected static _dbx: Dropbox;
    public static dbx() {
        if(!StorageFile._dbx) {
            StorageFile._dbx = new Dropbox({ accessToken: StorageFile.apiKey, fetch: fetch });
        }
        
        return StorageFile._dbx;
    }

    protected async retryCallback(debugName: string, fn: () => Promise<any>, cb: () => void, nbTries: number = Infinity) {
        if(nbTries <= 0) {
            console.error(`fn: [${debugName}] timeout`);
            return cb();
        }

        try {
            await fn();
            console.error(`fn: [${debugName}] success`);
            cb();
        } catch(ex) {
            console.error(`fn: [${debugName}] error => retry (${nbTries})`);
            setTimeout(() => this.retryCallback(debugName, fn, cb, nbTries - 1), 5000);
        }
    }
    protected retry(debugName: string, fn: () => Promise<any>, nbTries: number = Infinity) {
        return new Promise<void>(resolve => this.retryCallback(debugName, fn, resolve, nbTries));
    }
    
    public async setContent(content: string, callback: (e?: any) => void) {
        console.error(`Save start`);
        try {
            const dbx = StorageFile.dbx();
            await this.retry(`write temp`, () => dbx.filesUpload({
                path: this.fileIdTemp,
                contents: content,
                mode: {
                    '.tag': 'overwrite'
                }
            }));

            await this.retry(`delete save2`, () => dbx.filesDeleteV2({
                path: this.fileIdSave2,
            }), 10);

            await this.retry(`move save1 to save2`, () => dbx.filesMoveV2({
                from_path: this.fileIdSave1,
                to_path: this.fileIdSave2,
            }), 10);

            await this.retry(`move file to save1`, () => dbx.filesMoveV2({
                from_path: this.fileId,
                to_path: this.fileIdSave1,
            }), 10);

            await this.retry(`move temp to file`, () => dbx.filesMoveV2({
                from_path: this.fileIdTemp,
                to_path: this.fileId,
            }));

            console.error(`Save end`);
            process.nextTick(callback);
        } catch(ex) {
            console.error(`Cannot write in file`, this.fileIdTemp, ' or move file from', this.fileIdTemp, 'to', this.fileId);
            console.error(`Restart in 5 sec`);
            
            setTimeout(() => this.setContent(content, callback), 5000);
        }
    }

    public async getContent(callback: (e: any, content?: any) => void) {
        const onData = (r: DropboxTypes.files.FileMetadata) => {
            
            const fileBinary = (r as any).fileBinary;
            const fileStr = fileBinary.toString();
            const data = JSON.parse(fileStr);

            console.log('StorageFile has been read with ' + fileStr.length + ' chars');
            process.nextTick(() => callback(undefined, data));
        }

        try {
            onData(await StorageFile.dbx().filesDownload({
                path: this.fileIdTemp
            }))
            console.log('Loaded from temp');
        } catch(ex) {
            try {
                onData(await StorageFile.dbx().filesDownload({
                    path: this.fileId
                }))
                console.log('Loaded from file');
            } catch(ex) {
                try {
                    onData(await StorageFile.dbx().filesDownload({
                        path: this.fileIdSave1
                    }))
                    console.log('Loaded from save1');
                } catch(ex) {
                    try {
                        onData(await StorageFile.dbx().filesDownload({
                            path: this.fileIdSave2
                        }))
                        console.log('Loaded from save2');
                    } catch(ex) {
                        console.error(`Could not read files`, this.fileId, this.fileIdTemp, this.fileIdSave1, this.fileIdSave2);
                        console.error(`Restart in 5 sec`);
            
                        setTimeout(() => this.getContent(callback), 5000);
                    }
                }
            }
        }
    }
}
