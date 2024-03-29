"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.ThreadManager = exports.IThreadManager = void 0;
var Action_1 = require("../Action");
var IThreadManager = /** @class */ (function () {
    function IThreadManager() {
    }
    return IThreadManager;
}());
exports.IThreadManager = IThreadManager;
var ThreadManager = /** @class */ (function (_super) {
    __extends(ThreadManager, _super);
    function ThreadManager() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.cache = {};
        return _this;
    }
    ThreadManager.prototype.executeTicker = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var threadIds, _i, threadIds_1, threadId, found, _a, _b, guild, channel;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        threadIds = Array.isArray(this.options.threadId) ? this.options.threadId : [this.options.threadId];
                        _i = 0, threadIds_1 = threadIds;
                        _c.label = 1;
                    case 1:
                        if (!(_i < threadIds_1.length)) return [3 /*break*/, 10];
                        threadId = threadIds_1[_i];
                        found = false;
                        _a = 0, _b = ctx.guilds;
                        _c.label = 2;
                    case 2:
                        if (!(_a < _b.length)) return [3 /*break*/, 8];
                        guild = _b[_a];
                        channel = this.cache[threadId];
                        if (!!channel) return [3 /*break*/, 4];
                        return [4 /*yield*/, guild.channels.fetch(threadId)];
                    case 3:
                        channel = (_c.sent());
                        this.cache[threadId] = channel;
                        _c.label = 4;
                    case 4:
                        if (!channel) return [3 /*break*/, 7];
                        if (!this.options.keepUnarchived) return [3 /*break*/, 6];
                        return [4 /*yield*/, channel.setArchived(false)];
                    case 5:
                        _c.sent();
                        _c.label = 6;
                    case 6:
                        found = true;
                        return [3 /*break*/, 8];
                    case 7:
                        _a++;
                        return [3 /*break*/, 2];
                    case 8:
                        if (!found) {
                            console.log("Thread " + threadId + " introuvable");
                        }
                        _c.label = 9;
                    case 9:
                        _i++;
                        return [3 /*break*/, 1];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    ThreadManager.typeId = 'ThreadManager';
    ThreadManager.builder = function (options) { return new ThreadManager(options); };
    return ThreadManager;
}(Action_1.Action));
exports.ThreadManager = ThreadManager;
