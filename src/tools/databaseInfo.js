"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StorageSQL_1 = require("../storage/StorageSQL");
var fs = require("fs");
process.env = fs.existsSync('./env.json') ? JSON.parse(fs.readFileSync('./env.json').toString()) : process.env;
var storage = new StorageSQL_1.StorageSQL(process.env.STORAGE_FILE_ID);
console.log('Loading...');
storage.getContent(function (e, content) {
    if (e) {
        console.error(e);
    }
    else {
        var data = JSON.parse(content.toString());
        console.log(data.___save);
    }
});
