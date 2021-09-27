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
exports.ActionsManager = void 0;
var ChannelNotification_1 = require("./actions/ChannelNotification");
var EmbedReactionRole_1 = require("./actions/EmbedReactionRole");
var NewWorldJobCommand_1 = require("./actions/NewWorldJobCommand");
var config_1 = require("./config");
var Ticker_1 = require("./Ticker");
var ActionsManager = /** @class */ (function () {
    function ActionsManager(bot) {
        this.bot = bot;
        this.types = {
            'ChannelNotification': { isTicker: true },
            'EmbedReactionRole': { isTicker: true },
            'thread': { isTicker: true },
            'NewWorldJobCommand': { isMessage: true, builder: function () { return new NewWorldJobCommand_1.NewWorldJobCommand(); } },
        };
    }
    ActionsManager.prototype.catchMessage = function (message, checkForCommand, params) {
        var _a, _b;
        for (var _i = 0, _c = this.actions; _i < _c.length; _i++) {
            var action = _c[_i];
            for (var _d = 0, _e = action.list; _d < _e.length; _d++) {
                var item = _e[_d];
                var ttype = this.types[item.type];
                if (!((_a = item.enabled) !== null && _a !== void 0 ? _a : true) || !(ttype === null || ttype === void 0 ? void 0 : ttype.isMessage)) {
                    continue;
                }
                if (checkForCommand(new RegExp(item.regex, (_b = item.regexFlags) !== null && _b !== void 0 ? _b : 'img'))) {
                    var instance = this.getInstance(item, ttype.builder);
                    instance.execute(item.options, {
                        message: message,
                        params: params
                    });
                    return true;
                }
            }
        }
        return false;
    };
    ActionsManager.prototype.getInstance = function (item, builder) {
        var _a;
        item.__instance = (_a = item.__instance) !== null && _a !== void 0 ? _a : builder();
        return item.__instance;
    };
    Object.defineProperty(ActionsManager.prototype, "actions", {
        get: function () {
            var _a;
            var result = [];
            if (config_1.default.server.info.actions && config_1.default.server.info.actions.length > 0) {
                var actions = config_1.default.server.info.actions.filter(function (a) { return a.on === process.env.APP_SELECTOR; });
                for (var i = 0; i < actions.length; ++i) {
                    var action = actions[i];
                    if (!((_a = action.enabled) !== null && _a !== void 0 ? _a : true)) {
                        continue;
                    }
                    result.push(action);
                }
            }
            return result;
        },
        enumerable: false,
        configurable: true
    });
    ActionsManager.prototype.createTickers = function () {
        var _this = this;
        var _loop_1 = function (action) {
            Ticker_1.Ticker.start((action.periodSec || 60) * 1000, function () { return __awaiter(_this, void 0, void 0, function () {
                var logText, guilds, _i, _a, item, _b, instance, instance, threadIds, _c, threadIds_1, threadId, found, _d, guilds_1, guild, channel;
                var _e, _f;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            logText = "Execution de l'action : " + action.name;
                            console.log(logText + " [running]");
                            guilds = this.bot.client.guilds.valueOf().map(function (g) { return g; });
                            _i = 0, _a = action.list;
                            _g.label = 1;
                        case 1:
                            if (!(_i < _a.length)) return [3 /*break*/, 19];
                            item = _a[_i];
                            if (!((_e = item.enabled) !== null && _e !== void 0 ? _e : true) || !((_f = this.types[item.type]) === null || _f === void 0 ? void 0 : _f.isTicker)) {
                                return [3 /*break*/, 18];
                            }
                            _b = item.type;
                            switch (_b) {
                                case 'ChannelNotification': return [3 /*break*/, 2];
                                case 'EmbedReactionRole': return [3 /*break*/, 4];
                                case 'thread': return [3 /*break*/, 8];
                            }
                            return [3 /*break*/, 18];
                        case 2:
                            instance = this.getInstance(item, function () { return new ChannelNotification_1.ChannelNotification(); });
                            return [4 /*yield*/, instance.check(item.options, guilds)];
                        case 3:
                            _g.sent();
                            return [3 /*break*/, 18];
                        case 4:
                            if (!!this.bot.bigBrowserV2) return [3 /*break*/, 5];
                            console.error("L'action " + item.type);
                            return [3 /*break*/, 7];
                        case 5:
                            instance = this.getInstance(item, function () { return new EmbedReactionRole_1.EmbedReactionRole(); });
                            return [4 /*yield*/, instance.run(item.options, this.bot.client, this.bot.bigBrowserV2)];
                        case 6:
                            _g.sent();
                            _g.label = 7;
                        case 7: return [3 /*break*/, 18];
                        case 8:
                            threadIds = Array.isArray(item.threadId) ? item.threadId : [item.threadId];
                            _c = 0, threadIds_1 = threadIds;
                            _g.label = 9;
                        case 9:
                            if (!(_c < threadIds_1.length)) return [3 /*break*/, 17];
                            threadId = threadIds_1[_c];
                            found = false;
                            _d = 0, guilds_1 = guilds;
                            _g.label = 10;
                        case 10:
                            if (!(_d < guilds_1.length)) return [3 /*break*/, 15];
                            guild = guilds_1[_d];
                            return [4 /*yield*/, guild.channels.fetch(threadId)];
                        case 11:
                            channel = _g.sent();
                            if (!channel) return [3 /*break*/, 14];
                            if (!item.keepUnarchived) return [3 /*break*/, 13];
                            return [4 /*yield*/, channel.setArchived(false)];
                        case 12:
                            _g.sent();
                            _g.label = 13;
                        case 13:
                            found = true;
                            return [3 /*break*/, 15];
                        case 14:
                            _d++;
                            return [3 /*break*/, 10];
                        case 15:
                            if (!found) {
                                console.log("Thread " + threadId + " introuvable");
                            }
                            _g.label = 16;
                        case 16:
                            _c++;
                            return [3 /*break*/, 9];
                        case 17: return [3 /*break*/, 18];
                        case 18:
                            _i++;
                            return [3 /*break*/, 1];
                        case 19:
                            console.log(logText + " [success]");
                            return [2 /*return*/];
                    }
                });
            }); }, action.startDelaySec);
        };
        for (var _i = 0, _a = this.actions; _i < _a.length; _i++) {
            var action = _a[_i];
            _loop_1(action);
        }
    };
    return ActionsManager;
}());
exports.ActionsManager = ActionsManager;
