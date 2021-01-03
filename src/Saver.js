"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Saver = void 0;
var StorageFile_1 = require("./storage/StorageFile");
var moment = require("moment-timezone");
//const StorageSystem = StorageSQL;
var StorageSystem = StorageFile_1.StorageFile;
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
    Saver.prototype.forceSave = function (callback) {
        var obj = this.object.save();
        obj.___save = {
            dateStr: moment().format(),
            date: Date.now(),
            dataCreationDate: this.dataCreationDate
        };
        var data = JSON.stringify(obj);
        this.file.setContent(data, function () { return callback && callback(); });
    };
    Saver.prototype.load = function (callback) {
        var _this = this;
        var load = function (e, data) {
            var _a;
            var dataLoaded = false;
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
            /*if(e && this.fileFallback) {
                this.fileFallback.getContent((e, content) => load(e, content));
            } else {
                load(undefined, content);
            }*/
            load(undefined, content);
        });
    };
    return Saver;
}());
exports.Saver = Saver;
