"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageFile = void 0;
var fetch = require('isomorphic-fetch');
var dropbox_1 = require("dropbox");
//const request = require('request');
// https://developers.kloudless.com/docs/v1/storage#files-download-a-file
var StorageFile = /** @class */ (function () {
    function StorageFile(fileId) {
        this.fileId = fileId.trim();
        if (!StorageFile.apiKey)
            throw new Error('Invalid env variable STORAGE_API_KEY');
    }
    StorageFile.dbx = function () {
        if (!StorageFile._dbx) {
            StorageFile._dbx = new dropbox_1.Dropbox({ accessToken: StorageFile.apiKey, fetch: fetch });
        }
        return StorageFile._dbx;
    };
    StorageFile.prototype.setContent = function (content, callback) {
        var dbx = StorageFile.dbx();
        dbx.filesUpload({
            path: this.fileId,
            contents: content,
            mode: {
                '.tag': 'overwrite'
            }
        }).then(function () {
            callback();
        }).catch(function (e) {
            console.error(e);
            callback(e);
        });
    };
    StorageFile.prototype.getContent = function (callback) {
        StorageFile.dbx().filesDownload({
            path: this.fileId
        }).then(function (r) {
            var fileBinary = r.fileBinary;
            console.log('StorageFile has been read with ' + fileBinary.toString().length + ' chars');
            callback(undefined, fileBinary);
        }).catch(function (e) {
            console.error(e);
            callback(e);
        });
    };
    StorageFile.apiKey = process.env.STORAGE_API_KEY;
    return StorageFile;
}());
exports.StorageFile = StorageFile;
