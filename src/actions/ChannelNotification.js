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
exports.ChannelNotification = exports.IChannelNotification = void 0;
var IChannelNotification = /** @class */ (function () {
    function IChannelNotification() {
    }
    return IChannelNotification;
}());
exports.IChannelNotification = IChannelNotification;
var ChannelNotification = /** @class */ (function () {
    function ChannelNotification() {
        this.channelsNotEmpty = [];
    }
    ChannelNotification.prototype.check = function (options, guilds) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, id, _b, guilds_1, guild, channel, ex_1, _c, _d, id, _e, guilds_2, guild, channel, ex_2, newNotEmptyChannels, users, notEmptyChannels, _f, _g, channel, members, _h, notEmptyChannels_1, notEmptyChannel, id, index, _loop_1, this_1, _j, _k, id, msg, _l, _m, channel;
            return __generator(this, function (_o) {
                switch (_o.label) {
                    case 0:
                        if (!!this.channelsToNotify) return [3 /*break*/, 8];
                        this.channelsToNotify = [];
                        _i = 0, _a = options.channelsToNotify;
                        _o.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 8];
                        id = _a[_i];
                        _b = 0, guilds_1 = guilds;
                        _o.label = 2;
                    case 2:
                        if (!(_b < guilds_1.length)) return [3 /*break*/, 7];
                        guild = guilds_1[_b];
                        _o.label = 3;
                    case 3:
                        _o.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, guild.channels.fetch(id)];
                    case 4:
                        channel = _o.sent();
                        if (channel.isText()) {
                            this.channelsToNotify.push(channel);
                        }
                        return [3 /*break*/, 7];
                    case 5:
                        ex_1 = _o.sent();
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
                        _c = 0, _d = options.channelsToWatch;
                        _o.label = 9;
                    case 9:
                        if (!(_c < _d.length)) return [3 /*break*/, 16];
                        id = _d[_c];
                        _e = 0, guilds_2 = guilds;
                        _o.label = 10;
                    case 10:
                        if (!(_e < guilds_2.length)) return [3 /*break*/, 15];
                        guild = guilds_2[_e];
                        _o.label = 11;
                    case 11:
                        _o.trys.push([11, 13, , 14]);
                        return [4 /*yield*/, guild.channels.fetch(id)];
                    case 12:
                        channel = _o.sent();
                        if (channel.isVoice()) {
                            this.channelsToWatch.push(channel);
                        }
                        return [3 /*break*/, 15];
                    case 13:
                        ex_2 = _o.sent();
                        return [3 /*break*/, 14];
                    case 14:
                        _e++;
                        return [3 /*break*/, 10];
                    case 15:
                        _c++;
                        return [3 /*break*/, 9];
                    case 16:
                        if (this.channelsToWatch.length === 0) {
                            return [2 /*return*/];
                        }
                        newNotEmptyChannels = [];
                        users = [];
                        notEmptyChannels = [];
                        for (_f = 0, _g = this.channelsToWatch; _f < _g.length; _f++) {
                            channel = _g[_f];
                            members = channel.members.map(function (x) { return x; });
                            if (members.length > 0) {
                                users.push.apply(users, members);
                                notEmptyChannels.push(channel);
                            }
                        }
                        // add members
                        for (_h = 0, notEmptyChannels_1 = notEmptyChannels; _h < notEmptyChannels_1.length; _h++) {
                            notEmptyChannel = notEmptyChannels_1[_h];
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
                        for (_j = 0, _k = this.channelsNotEmpty.map(function (v) { return v; }); _j < _k.length; _j++) {
                            id = _k[_j];
                            _loop_1(id);
                        }
                        if (newNotEmptyChannels.length > 0) {
                            msg = options.message
                                .replace(/\{links\}/img, newNotEmptyChannels.map(function (m) { return m.toString(); }).join(', '))
                                .replace(/\{names\}/img, newNotEmptyChannels.map(function (m) { return m.name; }).join(', '))
                                .replace(/\{users\}/img, users.map(function (m) { return m.toString(); }).join(' et '))
                                .replace(/\{nb\}/img, newNotEmptyChannels.length.toString());
                            for (_l = 0, _m = this.channelsToNotify; _l < _m.length; _l++) {
                                channel = _m[_l];
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
    return ChannelNotification;
}());
exports.ChannelNotification = ChannelNotification;
