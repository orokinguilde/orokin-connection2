"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageSQL = void 0;
var mysql = require("mysql");
var StorageSQL = /** @class */ (function () {
    function StorageSQL(name) {
        this.defaultNbRetries = Infinity;
        this.defaultRetryTimeout = 5000;
        this.name = name;
    }
    StorageSQL.prototype.connect = function () {
        var connection = mysql.createConnection({
            host: process.env.SQL_HOST,
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_DATABASE,
            port: process.env.SQL_PORT
        });
        connection.connect();
        return connection;
    };
    StorageSQL.prototype.setContent = function (content, callback) {
        var connection = this.connect();
        connection.query("UPDATE json_data SET json = ? WHERE name = ?", [content, this.name], function (error, results, fields) {
            if (error || !results || !results[0]) {
                callback(error || new Error('Cannot write Database'));
            }
            else {
                callback();
            }
        });
        connection.end();
    };
    StorageSQL.prototype.getContent = function (callback, nbTries, retryTimeout) {
        var _this = this;
        if (nbTries === void 0) { nbTries = this.defaultNbRetries; }
        if (retryTimeout === void 0) { retryTimeout = this.defaultRetryTimeout; }
        var connection = this.connect();
        connection.query("SELECT json FROM json_data WHERE name = ?", [this.name], function (error, results, fields) {
            if (error || !results || !results[0]) {
                if (nbTries > 0) {
                    console.log('Cannot read Database => retry left:', nbTries);
                    setTimeout(function () { return _this.getContent(callback, nbTries - 1); }, retryTimeout);
                }
                else {
                    callback(error || new Error('Cannot read Database'));
                }
            }
            else {
                var json = JSON.parse(results[0].json);
                callback(undefined, json);
            }
        });
        connection.end();
    };
    return StorageSQL;
}());
exports.StorageSQL = StorageSQL;
