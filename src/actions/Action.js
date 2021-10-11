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
exports.Action = void 0;
var moment = require("moment");
var Action = /** @class */ (function () {
    function Action(options) {
        this.options = options;
    }
    Object.defineProperty(Action.prototype, "isTickerAction", {
        get: function () {
            return !!this.executeTicker;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Action.prototype, "isMessageAction", {
        get: function () {
            return !!this.executeMessage;
        },
        enumerable: false,
        configurable: true
    });
    Action.prototype.isCurrentDate = function (date, allowMultipleTriggers) {
        if (allowMultipleTriggers === void 0) { allowMultipleTriggers = false; }
        var m = moment();
        var values = [
            date.year !== undefined && m.year(),
            date.month !== undefined && (m.month() + 1),
            date.day !== undefined && m.date(),
            date.week !== undefined && m.week(),
            date.hour !== undefined && m.hour(),
            date.minute !== undefined && m.minute()
        ].filter(function (v) { return v !== false; }).join(',');
        if (date && (allowMultipleTriggers || this.lastTriggerDate !== values)) {
            if ((date.year === undefined || date.year === m.year())
                && (date.month === undefined || (date.month === m.month() + 1))
                && (date.day === undefined || date.day === m.date())
                && (date.week === undefined || date.week === m.week())
                && (date.hour === undefined || date.hour === m.hour())
                && (date.minute === undefined || date.minute === m.minute())) {
                this.lastTriggerDate = values;
                return true;
            }
        }
        return false;
    };
    Action.prototype.findMemberById = function (id, ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, guild, member, ex_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _i = 0, _a = ctx.guilds;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 6];
                        guild = _a[_i];
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, guild.members.fetch(id)];
                    case 3:
                        member = _b.sent();
                        if (member) {
                            return [2 /*return*/, member];
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        ex_1 = _b.sent();
                        return [3 /*break*/, 5];
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/, undefined];
                }
            });
        });
    };
    Action.prototype.findMembersById = function (ids, ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all(ids.map(function (id) { return _this.findMemberById(id, ctx); }))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Action.prototype.findChannelById = function (id, ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, guild, channel, ex_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _i = 0, _a = ctx.guilds;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 6];
                        guild = _a[_i];
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, guild.channels.fetch(id)];
                    case 3:
                        channel = _b.sent();
                        if (channel) {
                            return [2 /*return*/, channel];
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        ex_2 = _b.sent();
                        return [3 /*break*/, 5];
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/, undefined];
                }
            });
        });
    };
    Action.prototype.findChannelsById = function (ids, ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all(ids.map(function (id) { return _this.findChannelById(id, ctx); }))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return Action;
}());
exports.Action = Action;
