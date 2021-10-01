"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDebug = void 0;
var path = require("path");
var fs = require("fs");
exports.isDebug = fs.existsSync('./env.json');
exports.default = {
    server: {
        name: process.env.SERVER_FOLDER_NAME,
        fsFriendlyName: process.env.SERVER_FOLDER_NAME.replace(/[^a-zA-Z0-9_-]/, '_'),
        ranks: require(path.join(__dirname, '..', 'server', process.env.SERVER_FOLDER_NAME, "ranks.json")),
        info: require(path.join(__dirname, '..', 'server', process.env.SERVER_FOLDER_NAME, "info.json"))
    }
};
