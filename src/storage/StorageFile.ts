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
                console.error(`Cannot delete file`, this.fileIdSave);
            }

            try {
                await dbx.filesMoveV2({
                    from_path: this.fileId,
                    to_path: this.fileIdSave,
                });
            } catch(ex) {
                console.error(`Cannot move file from`, this.fileId, 'to', this.fileIdSave);
            }

            await dbx.filesMoveV2({
                from_path: this.fileIdTemp,
                to_path: this.fileId,
            });

            process.nextTick(callback);
        } catch(ex) {
            console.error(`Cannot write in file`, this.fileIdTemp, ' or move file from', this.fileIdTemp, 'to', this.fileId);
            console.error(`Restart in 5 sec`);
            
            setTimeout(() => this.setContent(content, callback), 5000);
        }
    }

    public async getContent(callback: (e: any, content?: string) => void) {
        const onData = (r: DropboxTypes.files.FileMetadata) => {
            
            const fileBinary = (r as any).fileBinary;

            console.log('StorageFile has been read with ' + fileBinary.toString().length + ' chars');
            process.nextTick(() => callback(undefined, fileBinary));
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
                    console.error(`Could not read files`, this.fileId, this.fileIdTemp, this.fileIdSave);
                    console.error(`Restart in 5 sec`);
        
                    setTimeout(() => this.getContent(callback), 5000);
                }
            }
        }
    }
}
