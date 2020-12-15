"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Saver = void 0;
var StorageSQL_1 = require("./storage/StorageSQL");
var moment = require("moment-timezone");
var StorageSystem = StorageSQL_1.StorageSQL; // StorageFile
var Saver = /** @class */ (function () {
    function Saver(fileId, object, fileIdFallback) {
        this.pendingSave = [];
        this.dataCreationDate = Date.now();
        this.toJSON = function () {
            return {
                file: this.file,
                pendingSave: this.pendingSave
            };
        };
        this.file = new StorageSystem(fileId);
        this.fileFallback = fileIdFallback && new StorageSystem(fileIdFallback);
        this.object = object;
    }
    Saver.prototype.startAutosave = function () {
        var _this = this;
        this.forceSave(function () {
            setTimeout(function () { return _this.startAutosave(); }, 10000);
        });
    };
    Saver.prototype.saveIfChanged = function (callback) {
        var obj = this.object.save();
        var data = JSON.stringify(obj);
        if (this.lastData !== data) {
            this.lastData = data;
            this.forceSaveOf(data, callback);
            return true;
        }
        else {
            return false;
        }
    };
    Saver.prototype.forceSave = function (callback) {
        var obj = this.object.save();
        obj.___save = {
            dateStr: moment().format(),
            date: Date.now(),
            dataCreationDate: this.dataCreationDate
        };
        var data = JSON.stringify(obj);
        this.forceSaveOf(data, callback);
    };
    Saver.prototype.forceSaveOf = function (dataStr, callback) {
        this.file.setContent(dataStr, function () { return callback && callback(); });
    };
    Saver.prototype.save = function (callback) {
        process.nextTick(function () { return callback && callback(); });
    };
    Saver.prototype.load = function (callback) {
        var _this = this;
        var load = function (e, content) {
            var _a;
            var dataLoaded = false;
            if (!e && content) {
                content = content.toString().trim();
                if (content && content.length > 0) {
                    var data = JSON.parse(content);
                    if (data) {
                        console.log("**************");
                        console.log('Data info :', data.___save);
                        for (var propName in data) {
                            console.log(propName + ": " + JSON.stringify(data[propName]).length + " chars");
                        }
                        console.log("**************");
                        _this.dataCreationDate = ((_a = data.___save) === null || _a === void 0 ? void 0 : _a.dataCreationDate) || _this.dataCreationDate;
                        _this.object.load(data);
                        dataLoaded = true;
                    }
                }
            }
            if (dataLoaded) {
                console.log('Data loaded.');
            }
            else {
                console.error('Impossible to load the data.');
            }
            if (callback) {
                callback();
            }
            setTimeout(function () { return _this.startAutosave(); }, 1000);
        };
        this.file.getContent(function (e, content) {
            if (e && _this.fileFallback) {
                _this.fileFallback.getContent(function (e, content) { return load(e, content); });
            }
            else {
                load(undefined, content);
            }
        });
    };
    return Saver;
}());
exports.Saver = Saver;
