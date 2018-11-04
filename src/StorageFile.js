const fetch = require('isomorphic-fetch');
const Dropbox = require('dropbox').Dropbox;

//const request = require('request');

// https://developers.kloudless.com/docs/v1/storage#files-download-a-file

function StorageFile(fileId)
{
    this.fileId = fileId.trim();

    if(!StorageFile.apiKey)
        throw new Error('Invalid env variable STORAGE_API_KEY');
}
StorageFile.apiKey = process.env.STORAGE_API_KEY;
StorageFile.dbx = function() {
    if(!StorageFile._dbx)
        StorageFile._dbx = new Dropbox({ accessToken: StorageFile.apiKey, fetch: fetch });
    return StorageFile._dbx;
}
StorageFile.prototype.setContent = function(content, callback) {
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
StorageFile.prototype.getContent = function(callback) {
    StorageFile.dbx().filesDownload({
        path: this.fileId
    }).then((r) => {
        console.log(r.fileBinary.toString());
        callback(undefined, r.fileBinary);
    }).catch((e) => {
        console.error(e);
        callback(e);
    });
}

module.exports = StorageFile;
