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
exports.IBot = void 0;
var discord_js_1 = require("discord.js");
var config_1 = require("./config");
var ActionsManagerV2_1 = require("./actions/ActionsManagerV2");
var ErrorManager_1 = require("./ErrorManager");
var IBot = /** @class */ (function () {
    function IBot(options) {
        this.actionsManagerV2 = new ActionsManagerV2_1.ActionsManagerV2(this);
        if (!options)
            options = {};
        this.options = options;
        if (!this.noAutoInitialization)
            this.initialize();
    }
    Object.defineProperty(IBot.prototype, "debug", {
        get: function () {
            return config_1.isDebug;
        },
        enumerable: false,
        configurable: true
    });
    IBot.prototype.load = function (obj) {
        var ctx = {
            bot: this
        };
        this._load(obj, ctx);
    };
    IBot.prototype.start = function (token) {
        if (token === void 0) { token = this.options.token; }
        this.client.login(token);
        /*
        setInterval(() => {
            if(global.gc) {
                console.log('Start GC');
                global.gc();
                console.log('GC executed');
            } else {
                console.log('GC not available for manual triggering');
            }
        }, 1000 * 60);*/
    };
    IBot.findGeneralChannel = function (channels) {
        var channelNames = [
            /^[^a-zA-Z0-9]*g[eé]n[eé]ral[^a-zA-Z0-9]*$/img,
            /^[^a-zA-Z0-9]*discussion[^a-zA-Z0-9]*$/img,
            /^[^a-zA-Z0-9]*warframe[^a-zA-Z0-9]*$/img
        ];
        var matchingChannels = channels
            .filter(function (channel) { return channel.constructor.name === 'TextChannel'; })
            .filter(function (channel) { return channelNames.some(function (regex) { return regex.test(channel.name); }); })[0];
        return matchingChannels;
    };
    IBot.isAdmin = function (member) {
        return member.permissions.has('ADMINISTRATOR');
    };
    IBot.adminOnly = function (message, callback) {
        if (IBot.isAdmin(message.member)) {
            callback();
        }
        else {
            message.reply(':small_orange_diamond: Tu n\'as pas les droits pour cette commande');
        }
    };
    IBot.prototype.initialize = function () {
        var _this = this;
        var client = new discord_js_1.Client({
            intents: [
                discord_js_1.Intents.FLAGS.DIRECT_MESSAGES,
                discord_js_1.Intents.FLAGS.DIRECT_MESSAGE_TYPING,
                discord_js_1.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
                discord_js_1.Intents.FLAGS.GUILDS,
                discord_js_1.Intents.FLAGS.GUILD_MESSAGES,
                discord_js_1.Intents.FLAGS.GUILD_MEMBERS,
                discord_js_1.Intents.FLAGS.GUILD_PRESENCES,
                discord_js_1.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
                discord_js_1.Intents.FLAGS.GUILD_VOICE_STATES
            ],
            restTimeOffset: 0
        });
        this.client = client;
        client.on('raw', function (packet) { return __awaiter(_this, void 0, void 0, function () {
            var channel;
            return __generator(this, function (_a) {
                // We don't want this to run on unrelated packets
                if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t))
                    return [2 /*return*/];
                channel = client.channels.cache.get(packet.d.channel_id);
                if (channel instanceof discord_js_1.TextChannel && channel.isText()) {
                    // There's no need to emit if the message is cached, because the event will fire anyway for that
                    if (channel.messages.cache.has(packet.d.message_id))
                        return [2 /*return*/];
                    // Since we have confirmed the message is not cached, let's fetch it
                    channel.messages.fetch(packet.d.message_id).then(function (message) {
                        // Emojis can have identifiers of name:id format, so we have to account for that case as well
                        var emoji = packet.d.emoji.id ? packet.d.emoji.name + ":" + packet.d.emoji.id : packet.d.emoji.name;
                        // This gives us the reaction we need to emit the event properly, in top of the message object
                        var reaction = message.reactions.cache.get(emoji);
                        // Adds the currently reacting user to the reaction's users collection.
                        if (reaction)
                            reaction.users.cache.set(packet.d.user_id, client.users.cache.get(packet.d.user_id));
                        // Check which type of event it is before emitting
                        if (packet.t === 'MESSAGE_REACTION_ADD') {
                            client.emit('messageReactionAdd', reaction, client.users.cache.get(packet.d.user_id));
                        }
                        if (packet.t === 'MESSAGE_REACTION_REMOVE') {
                            client.emit('messageReactionRemove', reaction, client.users.cache.get(packet.d.user_id));
                        }
                    });
                }
                return [2 /*return*/];
            });
        }); });
        var managerRoleByMessage = function (message, user, callback) {
            var _a;
            var channel = (_a = message === null || message === void 0 ? void 0 : message.message) === null || _a === void 0 ? void 0 : _a.channel;
            if (channel && channel instanceof discord_js_1.TextChannel && (channel.name === 'éditez-vos-grades' || channel.id.toString() === '532671748059955200')) {
                var guild = message.message.guild;
                callback(user, message.message.mentions.roles);
            }
        };
        client.on('messageReactionAdd', function (message, user) {
            managerRoleByMessage(message, user, function (member, roles) {
                member.addRoles(roles);
            });
        });
        client.on('messageReactionRemove', function (message, user) {
            managerRoleByMessage(message, user, function (member, roles) {
                member.removeRoles(roles);
            });
        });
        client.on('messageCreate', function (message) {
            var params = [];
            var checkForCommand = function (regexCmd) {
                var localParams = regexCmd.exec(message.content);
                if (localParams) {
                    for (var i = 0; i < localParams.length; ++i) {
                        params[i] = localParams[i];
                    }
                }
                return !!localParams;
            };
            if (_this.debug) {
                if (message.content[0] !== '@')
                    return;
                message.content = message.content.slice(1);
            }
            if (!_this.actionsManagerV2.catchMessage(message, checkForCommand, params)) {
                try {
                    _this.onMessage(message, checkForCommand, params);
                }
                catch (ex) {
                    ErrorManager_1.ErrorManager.instance.error('Bot', ex);
                }
            }
        });
        client.on('error', function (value) {
            console.error(value);
        });
        client.on('warn', function (value) {
            console.log(value);
        });
        if (config_1.default.server.info.memberChange && config_1.default.server.info.memberChange.on === process.env.APP_SELECTOR) {
            var execMemberChange_1 = function (member, actions) { return __awaiter(_this, void 0, void 0, function () {
                var guilds, _i, actions_1, action, messageOptions, _a, guilds_1, guild, channel;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            guilds = this.client.guilds.valueOf().map(function (g) { return g; });
                            _i = 0, actions_1 = actions;
                            _b.label = 1;
                        case 1:
                            if (!(_i < actions_1.length)) return [3 /*break*/, 8];
                            action = actions_1[_i];
                            messageOptions = {
                                content: action.message,
                                embeds: action.embeds
                            };
                            if (!action.channelId) return [3 /*break*/, 6];
                            _a = 0, guilds_1 = guilds;
                            _b.label = 2;
                        case 2:
                            if (!(_a < guilds_1.length)) return [3 /*break*/, 5];
                            guild = guilds_1[_a];
                            return [4 /*yield*/, guild.channels.fetch(action.channelId)];
                        case 3:
                            channel = _b.sent();
                            if (channel) {
                                if (channel.isText()) {
                                    channel.send(messageOptions);
                                }
                                return [3 /*break*/, 5];
                            }
                            _b.label = 4;
                        case 4:
                            _a++;
                            return [3 /*break*/, 2];
                        case 5: return [3 /*break*/, 7];
                        case 6:
                            member.send(messageOptions);
                            _b.label = 7;
                        case 7:
                            _i++;
                            return [3 /*break*/, 1];
                        case 8: return [2 /*return*/];
                    }
                });
            }); };
            if (config_1.default.server.info.memberChange.add && config_1.default.server.info.memberChange.add.length > 0) {
                client.on('guildMemberAdd', function (member) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, execMemberChange_1(member, config_1.default.server.info.memberChange.add)];
                }); }); });
            }
            if (config_1.default.server.info.memberChange.remove && config_1.default.server.info.memberChange.remove.length > 0) {
                client.on('guildMemberRemove', function (member) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, execMemberChange_1(member, config_1.default.server.info.memberChange.remove)];
                }); }); });
            }
        }
        client.on('ready', function () {
            console.log('READY');
            var botName = config_1.default.server.info.name;
            if (botName) {
                client.user.setUsername(botName);
            }
            _this.ready();
            if (_this._onReady) {
                _this._onReady(function () { return _this.startRuntime(); });
            }
            else {
                _this.startRuntime();
            }
        });
    };
    IBot.prototype.startRuntime = function () {
        this._startRuntime();
        this.actionsManagerV2.createTickers();
    };
    IBot.prototype.onReady = function (fn) {
        this._onReady = fn;
    };
    return IBot;
}());
exports.IBot = IBot;
