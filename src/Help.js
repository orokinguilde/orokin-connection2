"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Help = void 0;
var discord_js_1 = require("discord.js");
var config_1 = require("./config");
var Help = /** @class */ (function () {
    function Help() {
    }
    Object.defineProperty(Help.prototype, "info", {
        get: function () {
            return config_1.default.server.info.help;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Help.prototype, "displayable", {
        get: function () {
            return !this.info.displayIn || this.info.displayIn === process.env.APP_SELECTOR;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Help.prototype, "command", {
        get: function () {
            return this.info.command;
        },
        enumerable: false,
        configurable: true
    });
    Help.getRandomColor = function () {
        var colors = [
            '#01FEDC',
            '#FE0101',
            '#FE6F01',
            '#FEF601',
            '#6FFE01',
            '#1201FE',
            '#7F01FE',
            '#FE01C3',
            '#0166FE',
            '#FE0177'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    };
    Object.defineProperty(Help.prototype, "regex", {
        get: function () {
            var _a, _b;
            return new RegExp("^" + ((_b = (_a = config_1.default.server.info.help) === null || _a === void 0 ? void 0 : _a.command) !== null && _b !== void 0 ? _b : '!helpme') + "(?:\\s([^\\s]+))?$", 'img');
        },
        enumerable: false,
        configurable: true
    });
    Help.prototype.getInformationAbout = function (key) {
        if (key === void 0) { key = ''; }
        key = Object.keys(this.info.data).find(function (k) { return k.trim().toLowerCase() === key.trim().toLowerCase(); });
        if (key !== undefined) {
            var data = this.info.data[key];
            if (data) {
                var _default = this.info.data._default;
                if (_default) {
                    for (var key_1 in _default) {
                        if (data[key_1] === undefined) {
                            data[key_1] = _default[key_1];
                        }
                    }
                }
                return data;
            }
        }
        return undefined;
    };
    Help.prototype.manageMessage = function (message, key) {
        var embed = Help.instance.createEmbed(key);
        if (!embed) {
            message.reply("Option '" + key + "' non reconnue");
        }
        else {
            message.delete();
            message.channel.send(embed);
        }
    };
    Help.prototype.createEmbed = function (key) {
        var _a;
        var info = this.getInformationAbout(key);
        if (info) {
            var embed = new discord_js_1.MessageEmbed();
            embed.setColor((_a = info.color) !== null && _a !== void 0 ? _a : Help.getRandomColor());
            if (info.thumbnail) {
                embed.setThumbnail(info.thumbnail);
            }
            if (info.title) {
                embed.setAuthor(info.title, info.icon);
            }
            if (info.fields) {
                for (var key_2 in info.fields) {
                    embed.addField(key_2, info.fields[key_2]);
                }
            }
            if (info.desc) {
                embed.setDescription(info.desc);
            }
            return embed;
        }
        return undefined;
    };
    Help.instance = new Help();
    return Help;
}());
exports.Help = Help;
