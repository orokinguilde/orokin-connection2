"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IBot = void 0;
var discord_js_1 = require("discord.js");
var IBot = /** @class */ (function () {
    function IBot(options) {
        this.debug = false;
        if (!options)
            options = {};
        this.options = options;
        if (!this.noAutoInitialization)
            this.initialize();
    }
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
            .filter(function (channel) { return channelNames.some(function (regex) { return regex.test(channel.name); }); })
            .array();
        if (matchingChannels.length > 0) {
            var firstMatchingChannel = matchingChannels[0];
            return firstMatchingChannel;
        }
        else {
            return undefined;
        }
    };
    IBot.isAdmin = function (member) {
        return member.hasPermission('ADMINISTRATOR');
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
        var client = new discord_js_1.Client();
        this.client = client;
        var managerRoleByMessage = function (message, user, callback) {
            if (message.message.channel.name === 'éditez-vos-grades' || message.message.channel.id.toString() === '532671748059955200') {
                var guild = message.message.guild;
                guild.fetchMember(user).then(function (member) {
                    callback(member, message.message.mentions.roles);
                }).catch(function () { });
            }
        };
        this.client.on('raw', function (packet) {
            // We don't want this to run on unrelated packets
            if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t))
                return;
            // Grab the channel to check the message from
            var channel = _this.client.channels.get(packet.d.channel_id);
            // There's no need to emit if the message is cached, because the event will fire anyway for that
            if (channel.messages.has(packet.d.message_id))
                return;
            // Since we have confirmed the message is not cached, let's fetch it
            channel.fetchMessage(packet.d.message_id).then(function (message) {
                // Emojis can have identifiers of name:id format, so we have to account for that case as well
                var emoji = packet.d.emoji.id ? packet.d.emoji.name + ":" + packet.d.emoji.id : packet.d.emoji.name;
                // This gives us the reaction we need to emit the event properly, in top of the message object
                var reaction = message.reactions.get(emoji);
                // Check which type of event it is before emitting
                if (packet.t === 'MESSAGE_REACTION_ADD') {
                    _this.client.emit('messageReactionAdd', reaction, _this.client.users.get(packet.d.user_id));
                }
                if (packet.t === 'MESSAGE_REACTION_REMOVE') {
                    _this.client.emit('messageReactionRemove', reaction, _this.client.users.get(packet.d.user_id));
                }
            });
        });
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
        client.on('raw', function (packet) {
            // We don't want this to run on unrelated packets
            if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t))
                return;
            // Grab the channel to check the message from
            var channel = client.channels.get(packet.d.channel_id);
            // There's no need to emit if the message is cached, because the event will fire anyway for that
            if (channel.messages.has(packet.d.message_id))
                return;
            // Since we have confirmed the message is not cached, let's fetch it
            channel.fetchMessage(packet.d.message_id).then(function (message) {
                // Emojis can have identifiers of name:id format, so we have to account for that case as well
                var emoji = packet.d.emoji.id ? packet.d.emoji.name + ":" + packet.d.emoji.id : packet.d.emoji.name;
                // This gives us the reaction we need to emit the event properly, in top of the message object
                var reaction = message.reactions.get(emoji);
                // Check which type of event it is before emitting
                if (packet.t === 'MESSAGE_REACTION_ADD') {
                    client.emit('messageReactionAdd', reaction, client.users.get(packet.d.user_id));
                }
                if (packet.t === 'MESSAGE_REACTION_REMOVE') {
                    client.emit('messageReactionRemove', reaction, client.users.get(packet.d.user_id));
                }
            });
        });
        client.on('message', function (message) {
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
            _this.onMessage(message, checkForCommand, params);
        });
        client.on('error', function (value) {
            console.error(value);
        });
        client.on('warn', function (value) {
            console.log(value);
        });
        client.on('ready', function () {
            console.log('READY');
            _this.ready();
            if (_this._onReady)
                _this._onReady(function () { return _this.startRuntime(); });
            else
                _this.startRuntime();
        });
    };
    IBot.prototype.onReady = function (fn) {
        this._onReady = fn;
    };
    return IBot;
}());
exports.IBot = IBot;
