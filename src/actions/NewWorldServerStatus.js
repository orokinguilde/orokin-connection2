"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewWorldServerStatus = void 0;
var request = require("request");
var NewWorldServerStatus = /** @class */ (function () {
    function NewWorldServerStatus() {
    }
    NewWorldServerStatus.prototype.getServerUpState = function (serverName) {
        if (serverName === void 0) { serverName = 'Bifrost'; }
        return new Promise(function (resolve, reject) {
            request('https://www.newworld.com/en-gb/support/server-status', function (e, res, body) {
                var bodyStr = body.toString();
                var indexBifrost = bodyStr.toLowerCase().indexOf(serverName.toLowerCase());
                var index = bodyStr.lastIndexOf('<', indexBifrost);
                var indexEnd = bodyStr.lastIndexOf('"', index);
                var indexStart = bodyStr.lastIndexOf('-', indexEnd) + 1;
                var str = bodyStr.substring(indexStart, indexEnd);
                resolve(str);
            });
        });
    };
    return NewWorldServerStatus;
}());
exports.NewWorldServerStatus = NewWorldServerStatus;
