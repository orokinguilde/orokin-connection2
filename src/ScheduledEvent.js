"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
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
exports.XPBonusScheduledEvent = exports.ScheduledEvent = void 0;
var moment = require("moment");
var discord_js_1 = require("discord.js");
var ScheduledEvent = /** @class */ (function () {
    function ScheduledEvent() {
        this.nbErrors = 0;
        this.nbErrorsMax = 10;
    }
    Object.defineProperty(ScheduledEvent.prototype, "enabled", {
        get: function () {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ScheduledEvent.prototype, "periodMs", {
        get: function () {
            return 1000;
        },
        enumerable: false,
        configurable: true
    });
    ScheduledEvent.prototype.refreshPeriod = function () {
    };
    ScheduledEvent.prototype.start = function () {
        var _this = this;
        if (this.nbErrors > this.nbErrorsMax) {
            console.error('Shuting down scheduled event because of too many errors');
            return;
        }
        this.refreshPeriod();
        var periodMs = this.periodMs;
        var tm = setTimeout(function () {
            clearTimeout(tm);
            try {
                if (_this.enabled) {
                    _this.runtime({
                        periodMs: periodMs
                    });
                    _this.nbErrors = 0;
                }
            }
            catch (ex) {
                ++_this.nbErrors;
                console.error(ex);
            }
            finally {
                _this.start();
            }
        }, periodMs);
    };
    return ScheduledEvent;
}());
exports.ScheduledEvent = ScheduledEvent;
var XPBonusScheduledEvent = /** @class */ (function (_super) {
    __extends(XPBonusScheduledEvent, _super);
    function XPBonusScheduledEvent(guild, bigBrowser, serialized) {
        var _this = _super.call(this) || this;
        _this.guild = guild;
        _this.bigBrowser = bigBrowser;
        _this.active = false;
        _this.channelIds = {};
        if (serialized) {
            _this.load(serialized);
        }
        return _this;
    }
    XPBonusScheduledEvent.prototype.save = function () {
        return {
            guildId: this.guild.id,
            channelIds: this.channelIds,
            active: this.active,
            xpBonusOnReact: this.xpBonusOnReact,
            xpBonusOnPopUp: this.xpBonusOnPopUp,
            periodMsMax: this.periodMsMax,
            periodMsMin: this.periodMsMin,
            messageTimeoutSec: this.messageTimeoutSec
        };
    };
    XPBonusScheduledEvent.prototype.load = function (obj) {
        var _a;
        this.channelIds = obj.channelIds || {};
        this.active = (_a = obj.active) !== null && _a !== void 0 ? _a : false;
        this._periodMsMin = obj.periodMsMin;
        this._periodMsMax = obj.periodMsMax;
        this._xpBonusOnPopUp = obj.xpBonusOnPopUp;
        this._xpBonusOnReact = obj.xpBonusOnReact;
        this._messageTimeoutSec = obj.messageTimeoutSec;
    };
    Object.defineProperty(XPBonusScheduledEvent.prototype, "enabled", {
        get: function () {
            var dayOfWeek = (moment().day() - 1 + 7) % 7;
            var isWeekend = dayOfWeek >= 6;
            return this.active && isWeekend;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(XPBonusScheduledEvent.prototype, "periodMsMin", {
        get: function () {
            var _a;
            return Math.max(this.messageTimeoutMs, (_a = this._periodMsMin) !== null && _a !== void 0 ? _a : 1000 * 20);
        },
        set: function (value) {
            this._periodMsMin = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(XPBonusScheduledEvent.prototype, "periodMsMax", {
        get: function () {
            var _a;
            return Math.max(this.messageTimeoutMs, (_a = this._periodMsMax) !== null && _a !== void 0 ? _a : 1000 * 60 * 60 * 3);
        },
        set: function (value) {
            this._periodMsMax = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(XPBonusScheduledEvent.prototype, "xpBonusOnPopUp", {
        get: function () {
            var _a;
            return (_a = this._xpBonusOnPopUp) !== null && _a !== void 0 ? _a : 5;
        },
        set: function (value) {
            this._xpBonusOnPopUp = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(XPBonusScheduledEvent.prototype, "xpBonusOnReact", {
        get: function () {
            var _a;
            return (_a = this._xpBonusOnReact) !== null && _a !== void 0 ? _a : 5;
        },
        set: function (value) {
            this._xpBonusOnReact = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(XPBonusScheduledEvent.prototype, "messageTimeoutSec", {
        get: function () {
            var _a;
            return (_a = this._messageTimeoutSec) !== null && _a !== void 0 ? _a : 20;
        },
        set: function (value) {
            this._messageTimeoutSec = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(XPBonusScheduledEvent.prototype, "messageTimeoutMs", {
        get: function () {
            return this.messageTimeoutSec * 1000;
        },
        enumerable: false,
        configurable: true
    });
    XPBonusScheduledEvent.prototype.refreshPeriod = function () {
        this._periodMs = Math.random() * (this.periodMsMax - this.periodMsMin) + this.periodMsMin;
    };
    Object.defineProperty(XPBonusScheduledEvent.prototype, "periodMs", {
        get: function () {
            if (this._periodMs === undefined) {
                this.refreshPeriod();
            }
            return this._periodMs;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(XPBonusScheduledEvent.prototype, "channels", {
        get: function () {
            var _this = this;
            return Object.keys(this.channelIds).map(function (id) { return _this.guild.channels.find(function (c) { return c.id === id; }); });
        },
        enumerable: false,
        configurable: true
    });
    XPBonusScheduledEvent.prototype.addChannel = function (channel) {
        this.channelIds[channel.id] = true;
    };
    XPBonusScheduledEvent.prototype.removeChannel = function (channel) {
        delete this.channelIds[channel.id];
    };
    XPBonusScheduledEvent.prototype.pickRandomChannel = function () {
        var channels = this.channels;
        return channels[Math.floor(Math.random() * channels.length)];
    };
    Object.defineProperty(XPBonusScheduledEvent.prototype, "emojis", {
        get: function () {
            var _this = this;
            return [
                'beaugoss',
                '🐰'
            ].map(function (name) { return _this.guild.emojis.find(function (emoji) { return emoji.name === name; }) || "" + name; });
        },
        enumerable: false,
        configurable: true
    });
    XPBonusScheduledEvent.prototype.runtime = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var channel, vocalUserIds_1, _i, _a, m, user, message_1, tm_1;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        channel = this.pickRandomChannel();
                        if (!channel) return [3 /*break*/, 2];
                        vocalUserIds_1 = {};
                        for (_i = 0, _a = this.guild.members.array(); _i < _a.length; _i++) {
                            m = _a[_i];
                            if (m.voiceChannelID) {
                                user = this.bigBrowser.getUser(m);
                                vocalUserIds_1[user.id] = user;
                            }
                        }
                        return [4 /*yield*/, channel.send(new discord_js_1.RichEmbed({
                                description: "@here, " + this.xpBonusOnPopUp + " points pour ceux en vocal, " + this.xpBonusOnReact + " en plus pour les r\u00E9actions \u00E0 ce message ! :rabbit:",
                                image: {
                                    url: 'https://media.discordapp.net/attachments/514178068835860498/718771722307764314/XP-bonus.gif'
                                }
                            }))];
                    case 1:
                        message_1 = _b.sent();
                        this.emojis.forEach(function (emoji) { return message_1.react(emoji).catch(function () { }); });
                        tm_1 = setTimeout(function () {
                            clearTimeout(tm_1);
                            for (var _i = 0, _a = _this.guild.members.array(); _i < _a.length; _i++) {
                                var m = _a[_i];
                                if (m.voiceChannelID) {
                                    var user = _this.bigBrowser.getUser(m);
                                    vocalUserIds_1[user.id] = user;
                                }
                            }
                            for (var id in vocalUserIds_1) {
                                var user = vocalUserIds_1[id];
                                user.addXPBonus(_this.xpBonusOnPopUp);
                            }
                            var userIds = {};
                            for (var _b = 0, _c = message_1.reactions.array(); _b < _c.length; _b++) {
                                var reaction = _c[_b];
                                for (var _d = 0, _e = reaction.users.array(); _d < _e.length; _d++) {
                                    var user = _e[_d];
                                    userIds[user.id] = true;
                                }
                            }
                            var users = Object.keys(userIds)
                                .map(function (id) { return _this.bigBrowser.getUserById(message_1.guild, id); });
                            for (var _f = 0, users_1 = users; _f < users_1.length; _f++) {
                                var user = users_1[_f];
                                user.addXPBonus(_this.xpBonusOnReact);
                            }
                            message_1.delete();
                        }, this.messageTimeoutMs);
                        _b.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    return XPBonusScheduledEvent;
}(ScheduledEvent));
exports.XPBonusScheduledEvent = XPBonusScheduledEvent;
