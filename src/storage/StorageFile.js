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
        this.fileIdSave = fileId.trim() + "_save";
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
        return __awaiter(this, void 0, void 0, function () {
            var dbx, ex_1, ex_2, ex_3;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 10, , 11]);
                        dbx = StorageFile.dbx();
                        return [4 /*yield*/, dbx.filesUpload({
                                path: this.fileIdTemp,
                                contents: content,
                                mode: {
                                    '.tag': 'overwrite'
                                }
                            })];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, dbx.filesDeleteV2({
                                path: this.fileIdSave,
                            })];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        ex_1 = _a.sent();
                        console.error(ex_1);
                        return [3 /*break*/, 5];
                    case 5:
                        _a.trys.push([5, 7, , 8]);
                        return [4 /*yield*/, dbx.filesMoveV2({
                                from_path: this.fileId,
                                to_path: this.fileIdSave,
                            })];
                    case 6:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        ex_2 = _a.sent();
                        console.error(ex_2);
                        return [3 /*break*/, 8];
                    case 8: return [4 /*yield*/, dbx.filesMoveV2({
                            from_path: this.fileIdTemp,
                            to_path: this.fileId,
                        })];
                    case 9:
                        _a.sent();
                        callback();
                        return [3 /*break*/, 11];
                    case 10:
                        ex_3 = _a.sent();
                        console.error(ex_3);
                        console.error("Restart in 5 sec");
                        setTimeout(function () { return _this.setContent(content, callback); }, 5000);
                        return [3 /*break*/, 11];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    StorageFile.prototype.getContent = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            var onData, _a, ex_4, _b, ex_5, _c, ex_6;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        onData = function (r) {
                            var fileBinary = r.fileBinary;
                            console.log('StorageFile has been read with ' + fileBinary.toString().length + ' chars');
                            callback(undefined, fileBinary);
                        };
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 3, , 12]);
                        _a = onData;
                        return [4 /*yield*/, StorageFile.dbx().filesDownload({
                                path: this.fileId
                            })];
                    case 2:
                        _a.apply(void 0, [_d.sent()]);
                        return [3 /*break*/, 12];
                    case 3:
                        ex_4 = _d.sent();
                        _d.label = 4;
                    case 4:
                        _d.trys.push([4, 6, , 11]);
                        _b = onData;
                        return [4 /*yield*/, StorageFile.dbx().filesDownload({
                                path: this.fileIdTemp
                            })];
                    case 5:
                        _b.apply(void 0, [_d.sent()]);
                        return [3 /*break*/, 11];
                    case 6:
                        ex_5 = _d.sent();
                        _d.label = 7;
                    case 7:
                        _d.trys.push([7, 9, , 10]);
                        _c = onData;
                        return [4 /*yield*/, StorageFile.dbx().filesDownload({
                                path: this.fileIdSave
                            })];
                    case 8:
                        _c.apply(void 0, [_d.sent()]);
                        return [3 /*break*/, 10];
                    case 9:
                        ex_6 = _d.sent();
                        console.error(ex_6);
                        setTimeout(function () { return _this.getContent(callback); }, 5000);
                        return [3 /*break*/, 10];
                    case 10: return [3 /*break*/, 11];
                    case 11: return [3 /*break*/, 12];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    StorageFile.apiKey = process.env.STORAGE_API_KEY;
    return StorageFile;
}());
exports.StorageFile = StorageFile;
