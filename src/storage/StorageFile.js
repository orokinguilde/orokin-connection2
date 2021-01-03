"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageFile = void 0;
var fetch = require('isomorphic-fetch');
var dropbox_1 = require("dropbox");
//const request = require('request');
// https://developers.kloudless.com/docs/v1/storage#files-download-a-file
var StorageFile = /** @class */ (function () {
    function StorageFile(fileId) {
        this.fileId = fileId.trim();
        this.fileIdTemp = fileId.trim() + "_temp";
        this.fileIdSave1 = fileId.trim() + "_save";
        this.fileIdSave2 = fileId.trim() + "_save2";
        if (!StorageFile.apiKey)
            throw new Error('Invalid env variable STORAGE_API_KEY');
    }
    StorageFile.dbx = function () {
        if (!StorageFile._dbx) {
            StorageFile._dbx = new dropbox_1.Dropbox({ accessToken: StorageFile.apiKey, fetch: fetch });
        }
        return StorageFile._dbx;
    };
    StorageFile.prototype.retryCallback = function (debugName, fn, cb, nbTries) {
        if (nbTries === void 0) { nbTries = Infinity; }
        return __awaiter(this, void 0, void 0, function () {
            var ex_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (nbTries <= 0) {
                            console.error("fn: [" + debugName + "] timeout");
                            return [2 /*return*/, cb()];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fn()];
                    case 2:
                        _a.sent();
                        console.error("fn: [" + debugName + "] success");
                        cb();
                        return [3 /*break*/, 4];
                    case 3:
                        ex_1 = _a.sent();
                        console.error("fn: [" + debugName + "] error => retry (" + nbTries + ")");
                        setTimeout(function () { return _this.retryCallback(debugName, fn, cb, nbTries - 1); }, 5000);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    StorageFile.prototype.retry = function (debugName, fn, nbTries) {
        var _this = this;
        if (nbTries === void 0) { nbTries = Infinity; }
        return new Promise(function (resolve) { return _this.retryCallback(debugName, fn, resolve, nbTries); });
    };
    StorageFile.prototype.setContent = function (content, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var dbx_1, ex_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.error("Save start");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        dbx_1 = StorageFile.dbx();
                        return [4 /*yield*/, this.retry("write temp", function () { return dbx_1.filesUpload({
                                path: _this.fileIdTemp,
                                contents: content,
                                mode: {
                                    '.tag': 'overwrite'
                                }
                            }); })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.retry("delete save2", function () { return dbx_1.filesDeleteV2({
                                path: _this.fileIdSave2,
                            }); }, 10)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.retry("move save1 to save2", function () { return dbx_1.filesMoveV2({
                                from_path: _this.fileIdSave1,
                                to_path: _this.fileIdSave2,
                            }); }, 10)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.retry("move file to save1", function () { return dbx_1.filesMoveV2({
                                from_path: _this.fileId,
                                to_path: _this.fileIdSave1,
                            }); }, 10)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.retry("move temp to file", function () { return dbx_1.filesMoveV2({
                                from_path: _this.fileIdTemp,
                                to_path: _this.fileId,
                            }); })];
                    case 6:
                        _a.sent();
                        console.error("Save end");
                        process.nextTick(callback);
                        return [3 /*break*/, 8];
                    case 7:
                        ex_2 = _a.sent();
                        console.error("Cannot write in file", this.fileIdTemp, ' or move file from', this.fileIdTemp, 'to', this.fileId);
                        console.error("Restart in 5 sec");
                        setTimeout(function () { return _this.setContent(content, callback); }, 5000);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    StorageFile.prototype.getContent = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            var onData, _a, ex_3, _b, ex_4, _c, ex_5, _d, ex_6;
            var _this = this;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        onData = function (r) {
                            var fileBinary = r.fileBinary;
                            var fileStr = fileBinary.toString();
                            var data = JSON.parse(fileStr);
                            console.log('StorageFile has been read with ' + fileStr.length + ' chars');
                            process.nextTick(function () { return callback(undefined, data); });
                        };
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 3, , 16]);
                        _a = onData;
                        return [4 /*yield*/, StorageFile.dbx().filesDownload({
                                path: this.fileIdTemp
                            })];
                    case 2:
                        _a.apply(void 0, [_e.sent()]);
                        console.log('Loaded from temp');
                        return [3 /*break*/, 16];
                    case 3:
                        ex_3 = _e.sent();
                        _e.label = 4;
                    case 4:
                        _e.trys.push([4, 6, , 15]);
                        _b = onData;
                        return [4 /*yield*/, StorageFile.dbx().filesDownload({
                                path: this.fileId
                            })];
                    case 5:
                        _b.apply(void 0, [_e.sent()]);
                        console.log('Loaded from file');
                        return [3 /*break*/, 15];
                    case 6:
                        ex_4 = _e.sent();
                        _e.label = 7;
                    case 7:
                        _e.trys.push([7, 9, , 14]);
                        _c = onData;
                        return [4 /*yield*/, StorageFile.dbx().filesDownload({
                                path: this.fileIdSave1
                            })];
                    case 8:
                        _c.apply(void 0, [_e.sent()]);
                        console.log('Loaded from save1');
                        return [3 /*break*/, 14];
                    case 9:
                        ex_5 = _e.sent();
                        _e.label = 10;
                    case 10:
                        _e.trys.push([10, 12, , 13]);
                        _d = onData;
                        return [4 /*yield*/, StorageFile.dbx().filesDownload({
                                path: this.fileIdSave2
                            })];
                    case 11:
                        _d.apply(void 0, [_e.sent()]);
                        console.log('Loaded from save2');
                        return [3 /*break*/, 13];
                    case 12:
                        ex_6 = _e.sent();
                        console.error("Could not read files", this.fileId, this.fileIdTemp, this.fileIdSave1, this.fileIdSave2);
                        console.error("Restart in 5 sec");
                        setTimeout(function () { return _this.getContent(callback); }, 5000);
                        return [3 /*break*/, 13];
                    case 13: return [3 /*break*/, 14];
                    case 14: return [3 /*break*/, 15];
                    case 15: return [3 /*break*/, 16];
                    case 16: return [2 /*return*/];
                }
            });
        });
    };
    StorageFile.apiKey = process.env.STORAGE_API_KEY;
    return StorageFile;
}());
exports.StorageFile = StorageFile;
