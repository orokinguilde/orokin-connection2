const fetch = require('isomorphic-fetch');
import { Dropbox } from 'dropbox';

//const request = require('request');

// https://developers.kloudless.com/docs/v1/storage#files-download-a-file

export class StorageFile {
    public constructor(fileId: string) {
        this.fileId = fileId.trim();
        this.fileIdTemp = fileId.trim() + `_temp`;
        this.fileIdSave = fileId.trim() + `_save`;
    
        if(!StorageFile.apiKey)
            throw new Error('Invalid env variable STORAGE_API_KEY');
    }

    public fileId: string;
    public fileIdTemp: string;
    public fileIdSave: string;

    public static apiKey = process.env.STORAGE_API_KEY;

    protected static _dbx: Dropbox;
    public static dbx() {
        if(!StorageFile._dbx) {
            StorageFile._dbx = new Dropbox({ accessToken: StorageFile.apiKey, fetch: fetch });
        }
        
        return StorageFile._dbx;
    }
    
    public async setContent(content: string, callback: (e?: any) => void) {
        try {
            const dbx = StorageFile.dbx();
            await dbx.filesUpload({
                path: this.fileIdTemp,
                contents: content,
                mode: {
                    '.tag': 'overwrite'
                }
            });

            try {
                await dbx.filesDeleteV2({
                    path: this.fileIdSave,
                })
            } catch(ex) {
                console.error(ex);
            }

            try {
                await dbx.filesMoveV2({
                    from_path: this.fileId,
                    to_path: this.fileIdSave,
                });
            } catch(ex) {
                console.error(ex);
            }

            await dbx.filesMoveV2({
                from_path: this.fileIdTemp,
                to_path: this.fileId,
            });

            callback();
        } catch(ex) {
            console.error(ex);
            console.error(`Restart in 5 sec`);
            setTimeout(() => this.setContent(content, callback), 5000);
        }
    }

    public async getContent(callback: (e: any, content?: string) => void) {
        const onData = (r: DropboxTypes.files.FileMetadata) => {
            
            const fileBinary = (r as any).fileBinary;

            console.log('StorageFile has been read with ' + fileBinary.toString().length + ' chars');
            callback(undefined, fileBinary);
        }

        try {
            onData(await StorageFile.dbx().filesDownload({
                path: this.fileId
            }))
        } catch(ex) {
            try {
                onData(await StorageFile.dbx().filesDownload({
                    path: this.fileIdTemp
                }))
            } catch(ex) {
                try {
                    onData(await StorageFile.dbx().filesDownload({
                        path: this.fileIdSave
                    }))
                } catch(ex) {
                    console.error(ex);
        
                    setTimeout(() => this.getContent(callback), 5000);
                }
            }
        }
    }
}
