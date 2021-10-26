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
exports.VoiceChannelCreator = void 0;
var ErrorManager_1 = require("../../ErrorManager");
var GlobalDataManager_1 = require("../../GlobalDataManager");
var Action_1 = require("../Action");
var VoiceChannelCreator = /** @class */ (function (_super) {
    __extends(VoiceChannelCreator, _super);
    function VoiceChannelCreator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    VoiceChannelCreator.prototype.executeMessage = function (ctx) {
        this.rename(ctx);
        this.giveLead(ctx);
        this.removeLead(ctx);
        return false;
    };
    Object.defineProperty(VoiceChannelCreator.prototype, "embedsWrongPlace", {
        get: function () {
            return [{
                    image: {
                        url: [
                            'https://c.tenor.com/KT41ASI2UJcAAAAC/wrong-place-wrong-time-them.gif',
                            'https://cdn.discordapp.com/attachments/483003722830577671/897808140421169152/nonono.gif'
                        ][Math.floor(Math.random() * 2)]
                    }
                }];
        },
        enumerable: false,
        configurable: true
    });
    VoiceChannelCreator.prototype.onCreate = function () {
        var _this = this;
        GlobalDataManager_1.GlobalDataManager.instance.register('VoiceChannelCreator', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, "**Salons observ\u00E9s**\n" + this.channelsToWatch.map(function (c) { return c.toString(); }).join('\n')
                        + ("\n**Salons cr\u00E9\u00E9s**\n" + this.channelsToDispose.map(function (c) { return "<#" + c.channelId + "> cr\u00E9\u00E9 par <@" + c.creatorId + "> (admins: " + c.admins.map(function (a) { return "<@" + a + ">"; }).join(', ') + ")"; }).join('\n'))];
            });
        }); });
    };
    VoiceChannelCreator.prototype.rename = function (ctx) {
        var _this = this;
        var match = /^!channel\s+rename\s+(.+)$/img.exec(ctx.message.content);
        if (match) {
            ErrorManager_1.ErrorManager.instance.wrapAsync('VoiceChannelCreator', function () { return __awaiter(_this, void 0, void 0, function () {
                var name, authorId, entry;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            name = match[1].trim();
                            authorId = ctx.message.member.id;
                            return [4 /*yield*/, this.findByAdminId(authorId, ctx)];
                        case 1:
                            entry = _a.sent();
                            if (!entry) return [3 /*break*/, 3];
                            return [4 /*yield*/, entry.channel.setName(name)];
                        case 2:
                            _a.sent();
                            ctx.message.reply({
                                content: "Salon renomm\u00E9 ! " + entry.channel.toString()
                            });
                            return [3 /*break*/, 4];
                        case 3:
                            ctx.message.reply({
                                content: "Vous ne vous trouvez dans aucun channel dont vous disposez des droits d'administration.",
                                embeds: this.embedsWrongPlace
                            });
                            _a.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
        }
    };
    VoiceChannelCreator.prototype.giveLead = function (ctx) {
        var _this = this;
        var match = /^!channel\s+give\s+/img.exec(ctx.message.content);
        if (match) {
            ErrorManager_1.ErrorManager.instance.wrapAsync('VoiceChannelCreator', function () { return __awaiter(_this, void 0, void 0, function () {
                var authorId, targetMember, entry, bot;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            authorId = ctx.message.member.id;
                            targetMember = ctx.message.mentions.members.map(function (m) { return m; })[0];
                            if (!targetMember) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.findByAdminId(authorId, ctx)];
                        case 1:
                            entry = _a.sent();
                            if (entry) {
                                if (!entry.data.admins.includes(targetMember.id)) {
                                    entry.data.admins.push(targetMember.id);
                                    ctx.message.reply({
                                        content: targetMember.toString() + " a \u00E9t\u00E9 ajout\u00E9 \u00E0 la liste des admins du channel " + entry.channel.toString() + "."
                                    });
                                }
                                else {
                                    ctx.message.reply({
                                        content: targetMember.toString() + " est d\u00E9j\u00E0 un admin du channel " + entry.channel.toString() + "."
                                    });
                                }
                            }
                            else {
                                ctx.message.reply({
                                    content: "Vous ne vous trouvez dans aucun channel dont vous disposez des droits d'administration.",
                                    embeds: this.embedsWrongPlace
                                });
                            }
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, this.getBotAsMember(ctx.message.guild)];
                        case 3:
                            bot = _a.sent();
                            ctx.message.reply({
                                content: "Vous devez mentionner une personne dans la commande.\nExemple :\n!channel give " + bot.toString()
                            });
                            _a.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
        }
    };
    VoiceChannelCreator.prototype.removeLead = function (ctx) {
        var _this = this;
        var match = /^!channel\s+remove\s+/img.exec(ctx.message.content);
        if (match) {
            ErrorManager_1.ErrorManager.instance.wrapAsync('VoiceChannelCreator', function () { return __awaiter(_this, void 0, void 0, function () {
                var authorId, targetMember, entry, index, bot;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            authorId = ctx.message.member.id;
                            targetMember = ctx.message.mentions.members.map(function (m) { return m; })[0];
                            if (!targetMember) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.findByAdminId(authorId, ctx)];
                        case 1:
                            entry = _a.sent();
                            if (entry) {
                                index = entry.data.admins.indexOf(targetMember.id);
                                if (index !== -1) {
                                    entry.data.admins.splice(index, 1);
                                    ctx.message.reply({
                                        content: targetMember.toString() + " a \u00E9t\u00E9 retir\u00E9 de la liste des admins du channel " + entry.channel.toString() + "."
                                    });
                                }
                                else {
                                    ctx.message.reply({
                                        content: targetMember.toString() + " n'est pas un admin du channel " + entry.channel.toString() + "."
                                    });
                                }
                            }
                            else {
                                ctx.message.reply({
                                    content: "Vous ne vous trouvez dans aucun channel dont vous disposez des droits d'administration.",
                                    embeds: this.embedsWrongPlace
                                });
                            }
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, this.getBotAsMember(ctx.message.guild)];
                        case 3:
                            bot = _a.sent();
                            ctx.message.reply({
                                content: "Vous devez mentionner une personne dans la commande.\nExemple :\n!channel remove " + bot.toString()
                            });
                            _a.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
        }
    };
    VoiceChannelCreator.prototype.findByAdminId = function (adminId, ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, cc, channel;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _i = 0, _a = this.listByAdminId(adminId);
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        cc = _a[_i];
                        return [4 /*yield*/, this.findChannelById(cc.channelId, ctx)];
                    case 2:
                        channel = _b.sent();
                        if (channel && channel.members.some(function (m) { return m.id === adminId; })) {
                            return [2 /*return*/, {
                                    data: cc,
                                    channel: channel
                                }];
                        }
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, undefined];
                }
            });
        });
    };
    VoiceChannelCreator.prototype.listByAdminId = function (adminId) {
        var list = [];
        for (var _i = 0, _a = this.channelsToDispose; _i < _a.length; _i++) {
            var cc = _a[_i];
            if (!cc.admins) {
                cc.admins = [];
            }
            if (cc.creatorId === adminId || cc.admins.includes(adminId)) {
                list.push(cc);
            }
        }
        return list.filter(function (i) { return !i.isDeleted; });
    };
    VoiceChannelCreator.prototype.getNewChannelName = function (member) {
        var _a;
        var newChannelName = (_a = this.options.newChannelName) !== null && _a !== void 0 ? _a : "Salon ({name})";
        return newChannelName
            .replace(/\{name\}/img, member.displayName);
    };
    VoiceChannelCreator.prototype.executeTicker = function (ctx) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var dataKey, _i, _b, guild, server, oldData, customData, channels, _c, _d, voiceChannel, _loop_1, out_i_1, i, _e, _f, member, channel;
            var _this = this;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        dataKey = (_a = this.options.id) !== null && _a !== void 0 ? _a : 'VoiceChannelCreator';
                        if (!!this.channelsToWatch) return [3 /*break*/, 4];
                        this.channelsToWatch = [];
                        _i = 0, _b = ctx.guilds;
                        _g.label = 1;
                    case 1:
                        if (!(_i < _b.length)) return [3 /*break*/, 4];
                        guild = _b[_i];
                        server = ctx.bigBrowser.getServer(guild);
                        if (!server.customData) {
                            server.customData = {};
                        }
                        oldData = server.customData[dataKey];
                        customData = void 0;
                        if (!oldData) {
                            customData = [];
                            server.customData[dataKey] = customData;
                        }
                        else if (Array.isArray(oldData)) {
                            customData = oldData;
                        }
                        else {
                            customData = oldData.createdChannels;
                            server.customData[dataKey] = customData;
                        }
                        return [4 /*yield*/, this.findChannelsById(this.options.channelsId, ctx)];
                    case 2:
                        channels = _g.sent();
                        this.channelsToWatch = channels;
                        this.channelsToDispose = customData;
                        _g.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        _c = 0, _d = this.channelsToWatch;
                        _g.label = 5;
                    case 5:
                        if (!(_c < _d.length)) return [3 /*break*/, 15];
                        voiceChannel = _d[_c];
                        _loop_1 = function (i) {
                            return __generator(this, function (_h) {
                                switch (_h.label) {
                                    case 0: return [4 /*yield*/, ErrorManager_1.ErrorManager.instance.wrapAsync('VoiceChannelCreator:ItemLoop', function () { return __awaiter(_this, void 0, void 0, function () {
                                            var createdChannel, channel;
                                            var _this = this;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        createdChannel = this.channelsToDispose[i];
                                                        return [4 /*yield*/, this.findChannelById(createdChannel.channelId, ctx, { force: true })];
                                                    case 1:
                                                        channel = _a.sent();
                                                        if (!createdChannel.isDeleted) return [3 /*break*/, 5];
                                                        if (!!channel) return [3 /*break*/, 2];
                                                        this.channelsToDispose.splice(i, 1);
                                                        --i;
                                                        return [3 /*break*/, 4];
                                                    case 2: return [4 /*yield*/, ErrorManager_1.ErrorManager.instance.wrapAsync('VoiceChannelCreator:RetryDeleteChannel', function () { return __awaiter(_this, void 0, void 0, function () {
                                                            return __generator(this, function (_a) {
                                                                switch (_a.label) {
                                                                    case 0: return [4 /*yield*/, channel.delete()];
                                                                    case 1:
                                                                        _a.sent();
                                                                        return [2 /*return*/];
                                                                }
                                                            });
                                                        }); })];
                                                    case 3:
                                                        _a.sent();
                                                        _a.label = 4;
                                                    case 4: return [3 /*break*/, 7];
                                                    case 5:
                                                        if (!(!channel || channel.members.filter(function (m) { return !m.user.bot; }).size === 0)) return [3 /*break*/, 7];
                                                        return [4 /*yield*/, ErrorManager_1.ErrorManager.instance.wrapAsync('VoiceChannelCreator:DeleteChannel', function () { return __awaiter(_this, void 0, void 0, function () {
                                                                return __generator(this, function (_a) {
                                                                    switch (_a.label) {
                                                                        case 0:
                                                                            if (!channel) return [3 /*break*/, 2];
                                                                            return [4 /*yield*/, channel.delete()];
                                                                        case 1:
                                                                            _a.sent();
                                                                            _a.label = 2;
                                                                        case 2:
                                                                            createdChannel.isDeleted = true;
                                                                            return [2 /*return*/];
                                                                    }
                                                                });
                                                            }); })];
                                                    case 6:
                                                        _a.sent();
                                                        _a.label = 7;
                                                    case 7: return [2 /*return*/];
                                                }
                                            });
                                        }); })];
                                    case 1:
                                        _h.sent();
                                        out_i_1 = i;
                                        return [2 /*return*/];
                                }
                            });
                        };
                        i = 0;
                        _g.label = 6;
                    case 6:
                        if (!(i < this.channelsToDispose.length)) return [3 /*break*/, 9];
                        return [5 /*yield**/, _loop_1(i)];
                    case 7:
                        _g.sent();
                        i = out_i_1;
                        _g.label = 8;
                    case 8:
                        ++i;
                        return [3 /*break*/, 6];
                    case 9:
                        _e = 0, _f = voiceChannel.members.map(function (m) { return m; });
                        _g.label = 10;
                    case 10:
                        if (!(_e < _f.length)) return [3 /*break*/, 14];
                        member = _f[_e];
                        return [4 /*yield*/, voiceChannel.guild.channels.create(this.getNewChannelName(member), {
                                type: "GUILD_VOICE",
                                parent: voiceChannel.parent,
                                position: voiceChannel.calculatedPosition + 1
                            })];
                    case 11:
                        channel = _g.sent();
                        return [4 /*yield*/, member.voice.setChannel(channel, 'Channel créé automatiquement')];
                    case 12:
                        _g.sent();
                        this.channelsToDispose.push({
                            channelId: channel.id,
                            creatorId: member.id,
                            admins: [],
                            isDeleted: false
                        });
                        _g.label = 13;
                    case 13:
                        _e++;
                        return [3 /*break*/, 10];
                    case 14:
                        _c++;
                        return [3 /*break*/, 5];
                    case 15: return [2 /*return*/];
                }
            });
        });
    };
    VoiceChannelCreator.typeId = 'VoiceChannelCreator';
    VoiceChannelCreator.builder = function (options) { return new VoiceChannelCreator(options); };
    return VoiceChannelCreator;
}(Action_1.Action));
exports.VoiceChannelCreator = VoiceChannelCreator;
