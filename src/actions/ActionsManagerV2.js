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
exports.ActionsManagerV2 = void 0;
var config_1 = require("../config");
var Ticker_1 = require("../Ticker");
var VoiceChannelCreator_1 = require("./list/VoiceChannelCreator");
var Texter_1 = require("./list/Texter");
var ChannelNotification_1 = require("./list/ChannelNotification");
var ThreadManager_1 = require("./list/ThreadManager");
var EmbedReactionRole_1 = require("./list/EmbedReactionRole");
var ErrorManager_1 = require("../ErrorManager");
var ActionsManagerV2 = /** @class */ (function () {
    function ActionsManagerV2(bot) {
        this.bot = bot;
    }
    ActionsManagerV2.prototype.isEnabled = function (option) {
        if (typeof (option === null || option === void 0 ? void 0 : option.enabled) === 'boolean') {
            return option === null || option === void 0 ? void 0 : option.enabled;
        }
        else if (typeof (option === null || option === void 0 ? void 0 : option.enabled) === 'string') {
            return (option === null || option === void 0 ? void 0 : option.enabled) === (config_1.isDebug ? 'dev' : 'prod');
        }
        return true;
    };
    ActionsManagerV2.prototype.catchMessage = function (message, checkForCommand, params) {
        for (var _i = 0, _a = this.actions; _i < _a.length; _i++) {
            var action = _a[_i];
            for (var _b = 0, _c = action.list; _b < _c.length; _b++) {
                var item = _c[_b];
                if (!this.isEnabled(item)) {
                    continue;
                }
                var instance = this.getInstance(item);
                if (instance && instance.executeMessage) {
                    if (instance.executeMessage({
                        bigBrowser: this.bot.bigBrowserV2,
                        guilds: this.bot.client.guilds.valueOf().map(function (g) { return g; }),
                        message: message,
                        bot: this.bot,
                        params: params
                    })) {
                        return true;
                    }
                }
            }
        }
        return false;
    };
    ActionsManagerV2.prototype.getInstance = function (item, builder) {
        var _a;
        item.__instance = (_a = item.__instance) !== null && _a !== void 0 ? _a : (builder && builder(item.options));
        return item.__instance;
    };
    Object.defineProperty(ActionsManagerV2.prototype, "actions", {
        get: function () {
            var result = [];
            if (config_1.default.server.info.actions && config_1.default.server.info.actions.length > 0) {
                var actions = config_1.default.server.info.actions.filter(function (a) { return a.on === process.env.APP_SELECTOR; });
                for (var i = 0; i < actions.length; ++i) {
                    var action = actions[i];
                    if (!this.isEnabled(action)) {
                        continue;
                    }
                    var _loop_1 = function (item) {
                        if (this_1.isEnabled(item)) {
                            var type = ActionsManagerV2.types.find(function (t) { return t.typeId === item.type; });
                            if (type) {
                                this_1.getInstance(item, type.builder);
                            }
                        }
                    };
                    var this_1 = this;
                    for (var _i = 0, _a = action.list; _i < _a.length; _i++) {
                        var item = _a[_i];
                        _loop_1(item);
                    }
                    result.push(action);
                }
            }
            return result;
        },
        enumerable: false,
        configurable: true
    });
    ActionsManagerV2.prototype.createTickers = function () {
        var _this = this;
        var _loop_2 = function (action) {
            Ticker_1.Ticker.start((action.periodSec || 60) * 1000, function () { return __awaiter(_this, void 0, void 0, function () {
                var logText, guilds, _i, _a, item, instance;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            logText = "Execution de l'action v2 : " + action.name;
                            if (!action.silent) {
                                console.log(logText + " [running]");
                            }
                            guilds = this.bot.client.guilds.valueOf().map(function (g) { return g; });
                            _i = 0, _a = action.list;
                            _b.label = 1;
                        case 1:
                            if (!(_i < _a.length)) return [3 /*break*/, 4];
                            item = _a[_i];
                            if (!this.isEnabled(item)) {
                                return [3 /*break*/, 3];
                            }
                            instance = this.getInstance(item);
                            if (!(instance && instance.executeTicker)) return [3 /*break*/, 3];
                            return [4 /*yield*/, ErrorManager_1.ErrorManager.instance.wrapPromise('ActionsManagerV2', instance.executeTicker({
                                    bigBrowser: this.bot.bigBrowserV2,
                                    bot: this.bot,
                                    guilds: guilds
                                }))];
                        case 2:
                            _b.sent();
                            _b.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4:
                            if (!action.silent) {
                                console.log(logText + " [success]");
                            }
                            return [2 /*return*/];
                    }
                });
            }); }, action.startDelaySec);
        };
        for (var _i = 0, _a = this.actions; _i < _a.length; _i++) {
            var action = _a[_i];
            _loop_2(action);
        }
    };
    ActionsManagerV2.types = [
        VoiceChannelCreator_1.VoiceChannelCreator,
        Texter_1.Texter,
        ChannelNotification_1.ChannelNotification,
        EmbedReactionRole_1.EmbedReactionRole,
        ThreadManager_1.ThreadManager
    ];
    return ActionsManagerV2;
}());
exports.ActionsManagerV2 = ActionsManagerV2;
