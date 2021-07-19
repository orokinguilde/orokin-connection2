"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
exports.default = {
    server: {
        name: process.env.SERVER_FOLDER_NAME,
        fsFriendlyName: process.env.SERVER_FOLDER_NAME.replace(/[^a-zA-Z0-9_-]/, '_'),
        ranks: require(path.join(__dirname, '..', 'server', process.env.SERVER_FOLDER_NAME, "ranks.json")),
        info: require(path.join(__dirname, '..', 'server', process.env.SERVER_FOLDER_NAME, "info.json"))
    }
};
