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
exports.ChannelNotification = exports.IChannelNotification = void 0;
var moment = require("moment");
var Action_1 = require("../Action");
var IChannelNotification = /** @class */ (function () {
    function IChannelNotification() {
    }
    return IChannelNotification;
}());
exports.IChannelNotification = IChannelNotification;
var ChannelNotification = /** @class */ (function (_super) {
    __extends(ChannelNotification, _super);
    function ChannelNotification() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.channelsNotEmpty = [];
        return _this;
    }
    ChannelNotification.prototype.executeTicker = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, id, _b, _c, guild, channel, ex_1, _d, _e, id, _f, _g, guild, channel, ex_2, newNotEmptyChannels, users, notEmptyChannels, _h, _j, channel, members, _k, notEmptyChannels_1, notEmptyChannel, id, index, _loop_1, this_1, _l, _m, id, msg, _o, _p, channel;
            return __generator(this, function (_q) {
                switch (_q.label) {
                    case 0:
                        if (!!this.channelsToNotify) return [3 /*break*/, 8];
                        this.channelsToNotify = [];
                        _i = 0, _a = this.options.channelsToNotify;
                        _q.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 8];
                        id = _a[_i];
                        _b = 0, _c = ctx.guilds;
                        _q.label = 2;
                    case 2:
                        if (!(_b < _c.length)) return [3 /*break*/, 7];
                        guild = _c[_b];
                        _q.label = 3;
                    case 3:
                        _q.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, guild.channels.fetch(id)];
                    case 4:
                        channel = _q.sent();
                        if (channel.isText()) {
                            this.channelsToNotify.push(channel);
                        }
                        return [3 /*break*/, 7];
                    case 5:
                        ex_1 = _q.sent();
                        return [3 /*break*/, 6];
                    case 6:
                        _b++;
                        return [3 /*break*/, 2];
                    case 7:
                        _i++;
                        return [3 /*break*/, 1];
                    case 8:
                        if (this.channelsToNotify.length === 0) {
                            return [2 /*return*/];
                        }
                        if (!!this.channelsToWatch) return [3 /*break*/, 16];
                        this.channelsToWatch = [];
                        _d = 0, _e = this.options.channelsToWatch;
                        _q.label = 9;
                    case 9:
                        if (!(_d < _e.length)) return [3 /*break*/, 16];
                        id = _e[_d];
                        _f = 0, _g = ctx.guilds;
                        _q.label = 10;
                    case 10:
                        if (!(_f < _g.length)) return [3 /*break*/, 15];
                        guild = _g[_f];
                        _q.label = 11;
                    case 11:
                        _q.trys.push([11, 13, , 14]);
                        return [4 /*yield*/, guild.channels.fetch(id)];
                    case 12:
                        channel = _q.sent();
                        if (channel.isVoice()) {
                            this.channelsToWatch.push(channel);
                        }
                        return [3 /*break*/, 15];
                    case 13:
                        ex_2 = _q.sent();
                        return [3 /*break*/, 14];
                    case 14:
                        _f++;
                        return [3 /*break*/, 10];
                    case 15:
                        _d++;
                        return [3 /*break*/, 9];
                    case 16:
                        if (this.channelsToWatch.length === 0) {
                            return [2 /*return*/];
                        }
                        newNotEmptyChannels = [];
                        users = [];
                        notEmptyChannels = [];
                        for (_h = 0, _j = this.channelsToWatch; _h < _j.length; _h++) {
                            channel = _j[_h];
                            members = channel.members.map(function (x) { return x; });
                            if (this.options.triggerOnlyOnNoRole) {
                                members = members.filter(function (m) { return m.roles.cache.size === 1; }); // 1 => role @everyone
                            }
                            if (members.length > 0) {
                                users.push.apply(users, members);
                                notEmptyChannels.push(channel);
                            }
                        }
                        // add members
                        for (_k = 0, notEmptyChannels_1 = notEmptyChannels; _k < notEmptyChannels_1.length; _k++) {
                            notEmptyChannel = notEmptyChannels_1[_k];
                            id = notEmptyChannel.id;
                            index = this.channelsNotEmpty.indexOf(id);
                            if (index < 0) {
                                newNotEmptyChannels.push(notEmptyChannel);
                                this.channelsNotEmpty.push(id);
                            }
                        }
                        _loop_1 = function (id) {
                            var exists = notEmptyChannels.some(function (m) { return m.id === id; });
                            if (!exists) {
                                this_1.channelsNotEmpty.splice(this_1.channelsNotEmpty.indexOf(id), 1);
                            }
                        };
                        this_1 = this;
                        for (_l = 0, _m = this.channelsNotEmpty.map(function (v) { return v; }); _l < _m.length; _l++) {
                            id = _m[_l];
                            _loop_1(id);
                        }
                        if (newNotEmptyChannels.length > 0) {
                            msg = this.options.message
                                .replace(/\{links\}/img, newNotEmptyChannels.map(function (m) { return m.toString(); }).join(', '))
                                .replace(/\{names\}/img, newNotEmptyChannels.map(function (m) { return m.name; }).join(', '))
                                .replace(/\{users\}/img, users.map(function (m) { return m.toString(); }).join(' et '))
                                .replace(/\{usersWithCreatedDurations\}/img, users.map(function (m) {
                                try {
                                    var duration = moment.duration(Date.now() - m.user.createdTimestamp);
                                    return m.toString() + " (cr\u00E9\u00E9 il y a " + duration.years() + " an" + (duration.years() > 1 ? 's' : '') + " " + duration.months() + " mois " + duration.days() + " jour" + (duration.days() > 1 ? 's' : '') + ")";
                                }
                                catch (ex) {
                                    return m.toString();
                                }
                            }).join(' et '))
                                .replace(/\{nb\}/img, newNotEmptyChannels.length.toString());
                            for (_o = 0, _p = this.channelsToNotify; _o < _p.length; _o++) {
                                channel = _p[_o];
                                channel.send({
                                    content: msg
                                });
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ChannelNotification.typeId = 'ChannelNotification';
    ChannelNotification.builder = function (options) { return new ChannelNotification(options); };
    return ChannelNotification;
}(Action_1.Action));
exports.ChannelNotification = ChannelNotification;
