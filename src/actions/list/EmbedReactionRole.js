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
exports.EmbedReactionRole = void 0;
var discord_js_1 = require("discord.js");
var moment = require("moment");
var Action_1 = require("../Action");
var defaultUserCustomData = function () { return ({}); };
var EmbedReactionRole = /** @class */ (function (_super) {
    __extends(EmbedReactionRole, _super);
    function EmbedReactionRole() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EmbedReactionRole.prototype.createEmbed = function (info) {
        var embed = new discord_js_1.MessageEmbed();
        embed.setTitle(info.name);
        if (info.color) {
            embed.setColor(info.color);
        }
        for (var _i = 0, _a = info.infos; _i < _a.length; _i++) {
            var item = _a[_i];
            embed.addField(item.name + " " + item.emoji, item.desc, true);
        }
        return embed;
    };
    EmbedReactionRole.prototype.embedEquals = function (embed, info) {
        return embed
            && embed.title === info.name
            && (!info.color || embed.hexColor === info.color)
            && embed.fields.every(function (f) { return info.infos.some(function (i) { return f.value === i.desc && f.name === i.name + " " + i.emoji; }); });
    };
    EmbedReactionRole.prototype.frequencyToIndex = function (freq, frequencyNb, frequencyOffset) {
        if (frequencyNb === void 0) { frequencyNb = 1; }
        if (frequencyOffset === void 0) { frequencyOffset = 0; }
        var getBase = function () {
            var m = moment();
            switch (freq) {
                case 'week': return m.year() * 1000 + m.week();
                case 'day': return m.year() * 1000 + m.dayOfYear();
                case 'hour': return (m.year() * 1000 + m.dayOfYear()) * 100 + m.hour();
                case 'minute': return ((m.year() * 1000 + m.dayOfYear()) * 100 + m.hour()) * 100 + m.minute();
                case 'test': return Math.floor((((m.year() * 1000 + m.dayOfYear()) * 100 + m.hour()) * 100 + m.minute()) / 2);
                default: return '_';
            }
        };
        var value = getBase();
        if (typeof value === 'number') {
            value = Math.floor((value + frequencyOffset) / frequencyNb);
        }
        return value;
    };
    //cconf: EmbedReactionRole_Config, client: Client, bigBrowser: BigBrowserV2
    EmbedReactionRole.prototype.executeTicker = function (ctx) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var index, userDataKey, guilds, promises, isReseting, _loop_1, this_1, _i, guilds_1, guild, state_1;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.options.deadlineMode = (_a = this.options.deadlineMode) !== null && _a !== void 0 ? _a : 'push-new';
                        index = this.frequencyToIndex(this.options.frequency, this.options.frequencyNb, this.options.frequencyOffset);
                        userDataKey = this.options.userDataKey;
                        guilds = ctx.bot.client.guilds.valueOf().map(function (g) { return g; });
                        promises = [];
                        isReseting = false;
                        _loop_1 = function (guild) {
                            var channel, guildMembers, server, customData, entries, _loop_2, _c, _d, centry;
                            return __generator(this, function (_e) {
                                switch (_e.label) {
                                    case 0: return [4 /*yield*/, guild.channels.fetch(this_1.options.channelId)];
                                    case 1:
                                        channel = _e.sent();
                                        if (!channel) {
                                            return [2 /*return*/, "continue"];
                                        }
                                        return [4 /*yield*/, guild.members.fetch()];
                                    case 2:
                                        guildMembers = (_e.sent()).map(function (m) { return m; });
                                        server = ctx.bigBrowser.getServer(guild);
                                        if (!server.customData) {
                                            server.customData = {};
                                        }
                                        if (!server.customData[userDataKey]) {
                                            server.customData[userDataKey] = {};
                                        }
                                        customData = server.customData[userDataKey];
                                        if (!customData[index]) {
                                            customData[index] = {};
                                        }
                                        entries = customData[index];
                                        _loop_2 = function (centry) {
                                            var entry, serverEntry, message, _f, ex_1, ex_2, _loop_3, _g, _h, inf;
                                            return __generator(this, function (_j) {
                                                switch (_j.label) {
                                                    case 0:
                                                        entry = entries[centry.id];
                                                        if (!entry) {
                                                            entry = {};
                                                            entries[centry.id] = entry;
                                                            promises.push(function () { return _this.firstCleanRoles(guildMembers, centry); });
                                                            isReseting = true;
                                                        }
                                                        if (!customData[centry.id]) {
                                                            customData[centry.id] = {};
                                                        }
                                                        serverEntry = customData[centry.id];
                                                        _j.label = 1;
                                                    case 1:
                                                        _j.trys.push([1, 5, , 6]);
                                                        if (!entry.messageId) return [3 /*break*/, 3];
                                                        return [4 /*yield*/, channel.messages.fetch(entry.messageId)];
                                                    case 2:
                                                        _f = (_j.sent());
                                                        return [3 /*break*/, 4];
                                                    case 3:
                                                        _f = undefined;
                                                        _j.label = 4;
                                                    case 4:
                                                        message = _f;
                                                        return [3 /*break*/, 6];
                                                    case 5:
                                                        ex_1 = _j.sent();
                                                        return [3 /*break*/, 6];
                                                    case 6:
                                                        if (!!message) return [3 /*break*/, 14];
                                                        if (!(this_1.options.deadlineMode === 'flush-reactions' && serverEntry.messageId)) return [3 /*break*/, 11];
                                                        _j.label = 7;
                                                    case 7:
                                                        _j.trys.push([7, 10, , 11]);
                                                        return [4 /*yield*/, channel.messages.fetch(serverEntry.messageId)];
                                                    case 8:
                                                        message = _j.sent();
                                                        return [4 /*yield*/, Promise.all([
                                                                this_1.embedEquals(message.embeds[0], centry) ? undefined : message.edit({ embeds: [this_1.createEmbed(centry)] }),
                                                                message.reactions.removeAll()
                                                            ])];
                                                    case 9:
                                                        _j.sent();
                                                        return [3 /*break*/, 11];
                                                    case 10:
                                                        ex_2 = _j.sent();
                                                        return [3 /*break*/, 11];
                                                    case 11:
                                                        if (!!message) return [3 /*break*/, 13];
                                                        return [4 /*yield*/, channel.send({
                                                                embeds: [this_1.createEmbed(centry)]
                                                            })];
                                                    case 12:
                                                        message = _j.sent();
                                                        serverEntry.messageId = message.id;
                                                        _j.label = 13;
                                                    case 13:
                                                        entry.messageId = message.id;
                                                        _loop_3 = function (inf) {
                                                            promises.push(function () { return message.react(inf.emoji); });
                                                        };
                                                        for (_g = 0, _h = centry.infos; _g < _h.length; _g++) {
                                                            inf = _h[_g];
                                                            _loop_3(inf);
                                                        }
                                                        return [3 /*break*/, 15];
                                                    case 14:
                                                        promises.push(function () { return _this.mngMsg(message, guildMembers, ctx.bigBrowser, index, centry, userDataKey); });
                                                        _j.label = 15;
                                                    case 15: return [2 /*return*/];
                                                }
                                            });
                                        };
                                        _c = 0, _d = this_1.options.entries;
                                        _e.label = 3;
                                    case 3:
                                        if (!(_c < _d.length)) return [3 /*break*/, 6];
                                        centry = _d[_c];
                                        return [5 /*yield**/, _loop_2(centry)];
                                    case 4:
                                        _e.sent();
                                        _e.label = 5;
                                    case 5:
                                        _c++;
                                        return [3 /*break*/, 3];
                                    case 6:
                                        if (isReseting && this_1.options.messageOnReset) {
                                            promises.unshift(function () { return __awaiter(_this, void 0, void 0, function () {
                                                var chan;
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0: return [4 /*yield*/, guild.channels.fetch(this.options.messageOnReset.channelId)];
                                                        case 1:
                                                            chan = _a.sent();
                                                            if (chan) {
                                                                chan.send(this.options.messageOnReset.message);
                                                            }
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            }); });
                                        }
                                        if (channel) {
                                            return [2 /*return*/, "break"];
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _i = 0, guilds_1 = guilds;
                        _b.label = 1;
                    case 1:
                        if (!(_i < guilds_1.length)) return [3 /*break*/, 4];
                        guild = guilds_1[_i];
                        return [5 /*yield**/, _loop_1(guild)];
                    case 2:
                        state_1 = _b.sent();
                        if (state_1 === "break")
                            return [3 /*break*/, 4];
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [4 /*yield*/, Promise.all(promises.map(function (v) { return v(); }))];
                    case 5:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    EmbedReactionRole.prototype.firstCleanRoles = function (guildMembers, group) {
        return __awaiter(this, void 0, void 0, function () {
            var roles;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        roles = group.infos.map(function (i) { return i.role; });
                        return [4 /*yield*/, Promise.all(guildMembers.map(function (m) {
                                if (m.roles.valueOf().some(function (r) { return roles.includes(r.id); })) {
                                    return m.roles.remove(roles);
                                }
                                else {
                                    return undefined;
                                }
                            }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    EmbedReactionRole.prototype.mngMsg = function (msg, members, bigBrowser, index, group, userDataKey) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var reactions, entryKey, server, affectedUsers, promises, _loop_4, _i, reactions_1, reaction, _loop_5, userId;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        reactions = msg.reactions.valueOf().map(function (r) { return r; });
                        entryKey = group.id;
                        server = bigBrowser.getServer(msg.guild);
                        affectedUsers = [];
                        promises = [];
                        _loop_4 = function (reaction) {
                            var emojiIds, metier, _loop_6, _c, _d, userId;
                            return __generator(this, function (_e) {
                                switch (_e.label) {
                                    case 0:
                                        emojiIds = [reaction.emoji.identifier, reaction.emoji.id, reaction.emoji.toString(), reaction.emoji.name].filter(function (v) { return v; });
                                        metier = group.infos.find(function (m) { return emojiIds.includes(m.emoji); });
                                        if (!metier) return [3 /*break*/, 4];
                                        _loop_6 = function (userId) {
                                            var userBigBrowser = bigBrowser.getUserById(msg.guild, userId);
                                            if (!userBigBrowser.isBot) {
                                                var metiers = userBigBrowser.getCustomData(userDataKey, defaultUserCustomData);
                                                if (!metiers[entryKey]) {
                                                    metiers[entryKey] = {};
                                                }
                                                var currentMetierId = (_a = metiers[entryKey][index]) === null || _a === void 0 ? void 0 : _a.id;
                                                if (currentMetierId !== metier.id) {
                                                    var member = members.find(function (m) { return m.id === userId; });
                                                    if (member) {
                                                        promises.push(member.roles.add(metier.role));
                                                        metiers[entryKey][index] = {
                                                            id: metier.id
                                                        };
                                                    }
                                                }
                                                affectedUsers.push(userBigBrowser.id);
                                            }
                                        };
                                        _c = 0;
                                        return [4 /*yield*/, reaction.users.fetch()];
                                    case 1:
                                        _d = (_e.sent()).map(function (u) { return u.id; });
                                        _e.label = 2;
                                    case 2:
                                        if (!(_c < _d.length)) return [3 /*break*/, 4];
                                        userId = _d[_c];
                                        _loop_6(userId);
                                        _e.label = 3;
                                    case 3:
                                        _c++;
                                        return [3 /*break*/, 2];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        };
                        _i = 0, reactions_1 = reactions;
                        _b.label = 1;
                    case 1:
                        if (!(_i < reactions_1.length)) return [3 /*break*/, 4];
                        reaction = reactions_1[_i];
                        return [5 /*yield**/, _loop_4(reaction)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        _loop_5 = function (userId) {
                            if (!affectedUsers.includes(userId)) {
                                var user_1 = bigBrowser.getUserById(server, userId);
                                if (!user_1.isBot) {
                                    var metiers = user_1.getCustomData(userDataKey, defaultUserCustomData);
                                    if (metiers[entryKey]) {
                                        var entry_1 = metiers[entryKey][index];
                                        if (entry_1) {
                                            var metier_1 = group.infos.find(function (m) { return m.id === entry_1.id; });
                                            var member = members.find(function (m) { return m.id === user_1.id; });
                                            if (member.roles.valueOf().some(function (r) { return r.id === metier_1.role; })) {
                                                promises.push(member.roles.remove(metier_1.role));
                                            }
                                            metiers[entryKey][index] = undefined;
                                        }
                                    }
                                }
                            }
                        };
                        for (userId in server.users) {
                            _loop_5(userId);
                        }
                        return [4 /*yield*/, Promise.all(promises)];
                    case 5:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    EmbedReactionRole.typeId = 'EmbedReactionRole';
    EmbedReactionRole.builder = function (options) { return new EmbedReactionRole(options); };
    return EmbedReactionRole;
}(Action_1.Action));
exports.EmbedReactionRole = EmbedReactionRole;
