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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BigBrowserV2 = exports.BigBrowserV2User = exports.BigBrowserV2UserStatsTimedWeek = exports.BigBrowserV2UserStatsTimedDay = exports.BigBrowserV2UserStatsTimed = exports.BigBrowserV2UserStats = void 0;
var moment = require("moment-timezone");
var config_1 = require("./config");
var BannerTemplate_1 = require("./BannerTemplate");
var BigBrowserV2UserStats = /** @class */ (function () {
    function BigBrowserV2UserStats(stats) {
        this.cheatXPOffset = 0;
        this._stats = stats;
    }
    BigBrowserV2UserStats.create = function (user) {
        return new BigBrowserV2UserStats({
            lvd: undefined,
            tvt: 0,
            ntm: 0,
            ntmd: 0,
            tts: 0,
            ttsd: 0,
            ltc: undefined,
            ltd: undefined,
            lndtd: undefined,
            wvlt: false,
            lwddd: undefined,
            lwdd: undefined,
            lwddy: undefined,
            twdtm: undefined,
            twdt: undefined,
            twdtu: undefined,
            wwdl: undefined,
            wwdltn: undefined,
            wwdlt: undefined,
            xb: 0
        });
    };
    Object.defineProperty(BigBrowserV2UserStats.prototype, "stats", {
        get: function () {
            return this._stats;
        },
        set: function (value) {
            for (var propName in value) {
                delete this.stats[propName];
            }
            for (var propName in value) {
                this.stats[propName] = value[propName];
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BigBrowserV2UserStats.prototype, "voiceXp", {
        get: function () {
            return this.stats.tvt / config_1.default.server.info.xp.voiceMs + this.cheatXPOffset;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BigBrowserV2UserStats.prototype, "textXp", {
        get: function () {
            return this.stats.tts / config_1.default.server.info.xp.textChars + this.cheatXPOffset;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BigBrowserV2UserStats.prototype, "xpBonus", {
        get: function () {
            return this.stats.xb || 0;
        },
        set: function (value) {
            this.stats.xb = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BigBrowserV2UserStats.prototype, "xp", {
        get: function () {
            return this.voiceXp + this.textXp + this.xpBonus;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BigBrowserV2UserStats.prototype, "lastVocalDate", {
        get: function () {
            return this.stats.lvd;
        },
        set: function (value) {
            this.stats.lvd = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BigBrowserV2UserStats.prototype, "totalVoiceTimeMs", {
        get: function () {
            return this.stats.tvt;
        },
        set: function (value) {
            this.stats.tvt = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BigBrowserV2UserStats.prototype, "nbTextMessages", {
        get: function () {
            return this.stats.ntm;
        },
        set: function (value) {
            this.stats.ntm = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BigBrowserV2UserStats.prototype, "nbTextMessagesWithDuplicates", {
        get: function () {
            return this.stats.ntmd;
        },
        set: function (value) {
            this.stats.ntmd = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BigBrowserV2UserStats.prototype, "totalTextSize", {
        get: function () {
            return this.stats.tts;
        },
        set: function (value) {
            this.stats.tts = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BigBrowserV2UserStats.prototype, "totalTextSizeWithDuplicates", {
        get: function () {
            return this.stats.ttsd;
        },
        set: function (value) {
            this.stats.ttsd = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BigBrowserV2UserStats.prototype, "lastTextContent", {
        get: function () {
            return this.stats.ltc;
        },
        set: function (value) {
            this.stats.ltc = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BigBrowserV2UserStats.prototype, "lastTextDate", {
        get: function () {
            return this.stats.ltd;
        },
        set: function (value) {
            this.stats.ltd = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BigBrowserV2UserStats.prototype, "lastNotDuplicateTextDate", {
        get: function () {
            return this.stats.lndtd;
        },
        set: function (value) {
            this.stats.lndtd = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BigBrowserV2UserStats.prototype, "wasVoicingLastTick", {
        get: function () {
            return this.stats.wvlt;
        },
        set: function (value) {
            this.stats.wvlt = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BigBrowserV2UserStats.prototype, "wasWarframeDiscordLastTickNot", {
        get: function () {
            return this.stats.wwdltn;
        },
        set: function (value) {
            this.stats.wwdltn = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BigBrowserV2UserStats.prototype, "totalWarframeDiscordTimeMsNot", {
        get: function () {
            return this.stats.twdt;
        },
        set: function (value) {
            this.stats.twdt = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BigBrowserV2UserStats.prototype, "lastWarframeDiscordDateNot", {
        get: function () {
            return this.stats.lwdd;
        },
        set: function (value) {
            this.stats.lwdd = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BigBrowserV2UserStats.prototype, "wasWarframeDiscordLastTick", {
        get: function () {
            return this.stats.wwdl;
        },
        set: function (value) {
            this.stats.wwdl = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BigBrowserV2UserStats.prototype, "wasWarframeDiscordLastTickUndefined", {
        get: function () {
            return this.stats.wwdlt;
        },
        set: function (value) {
            this.stats.wwdlt = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BigBrowserV2UserStats.prototype, "totalWarframeDiscordTimeMsUndefined", {
        get: function () {
            return this.stats.twdtu;
        },
        set: function (value) {
            this.stats.twdtu = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BigBrowserV2UserStats.prototype, "lastWarframeDiscordDateUndefined", {
        get: function () {
            return this.stats.lwddy;
        },
        set: function (value) {
            this.stats.lwddy = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BigBrowserV2UserStats.prototype, "totalWarframeDiscordTimeMs", {
        get: function () {
            return this.stats.twdtm;
        },
        set: function (value) {
            this.stats.twdtm = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BigBrowserV2UserStats.prototype, "lastWarframeDiscordDate", {
        get: function () {
            return this.stats.lwddd;
        },
        set: function (value) {
            this.stats.lwddd = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BigBrowserV2UserStats.prototype, "rank", {
        get: function () {
            var exp = this.xp;
            var ranks = BigBrowserV2.ranks;
            var lastMatchingRank = ranks[0];
            var nextRank = undefined;
            for (var rankStart in ranks) {
                var rank = ranks[rankStart];
                if (exp >= rank.start) {
                    lastMatchingRank = rank;
                }
                else if (!nextRank) {
                    nextRank = rank;
                    break;
                }
            }
            if (nextRank === lastMatchingRank)
                nextRank = undefined;
            var expFromCurrentToNextRank = nextRank ? nextRank.start - lastMatchingRank.start : 0;
            var expLeftToNextRank = nextRank ? nextRank.start - exp : 0;
            var expLeftToNextRankPercent = nextRank ? expLeftToNextRank / expFromCurrentToNextRank : 1;
            return {
                exp: exp,
                currentRank: lastMatchingRank,
                nextRank: nextRank,
                expInCurrentRank: exp - lastMatchingRank.start,
                expFromCurrentToNextRank: expFromCurrentToNextRank,
                expLeftToNextRank: expLeftToNextRank,
                expLeftToNextRankPercent: expLeftToNextRankPercent,
                currentExpPercentToNextRank: 1 - expLeftToNextRankPercent
            };
        },
        enumerable: false,
        configurable: true
    });
    BigBrowserV2UserStats.prototype.clear = function () {
        for (var name_1 in this.stats) {
            delete this.stats[name_1];
        }
        this.lastVocalDate = undefined;
        this.totalVoiceTimeMs = 0;
        this.nbTextMessages = 0;
        this.nbTextMessagesWithDuplicates = 0;
        this.totalTextSize = 0;
        this.totalTextSizeWithDuplicates = 0;
        this.lastTextContent = undefined;
        this.lastTextDate = undefined;
        this.lastNotDuplicateTextDate = undefined;
        this.wasVoicingLastTick = false;
    };
    BigBrowserV2UserStats.prototype.injectInto = function (stats) {
        var _a, _b;
        stats.lastNotDuplicateTextDate = this.lastNotDuplicateTextDate;
        stats.lastTextContent = this.lastTextContent;
        stats.lastTextDate = this.lastTextDate;
        stats.lastVocalDate = this.lastVocalDate;
        stats.lastWarframeDiscordDate = this.lastWarframeDiscordDate;
        stats.lastWarframeDiscordDateNot = this.lastWarframeDiscordDateNot;
        stats.lastWarframeDiscordDateUndefined = this.lastWarframeDiscordDateUndefined;
        stats.nbTextMessages += this.nbTextMessages;
        stats.nbTextMessagesWithDuplicates += this.nbTextMessagesWithDuplicates;
        stats.totalTextSize += this.totalTextSize;
        stats.totalTextSizeWithDuplicates += this.totalTextSizeWithDuplicates;
        stats.totalVoiceTimeMs += this.totalVoiceTimeMs;
        stats.totalWarframeDiscordTimeMs += this.totalWarframeDiscordTimeMs;
        stats.totalWarframeDiscordTimeMsNot += this.totalWarframeDiscordTimeMsNot;
        stats.totalWarframeDiscordTimeMsUndefined += this.totalWarframeDiscordTimeMsUndefined;
        stats.xpBonus = ((_a = stats.xpBonus) !== null && _a !== void 0 ? _a : 0) + ((_b = this.xpBonus) !== null && _b !== void 0 ? _b : 0);
        stats.wasVoicingLastTick = this.wasVoicingLastTick;
        stats.wasWarframeDiscordLastTick = this.wasWarframeDiscordLastTick;
        stats.wasWarframeDiscordLastTickNot = this.wasWarframeDiscordLastTickNot;
        stats.wasWarframeDiscordLastTickUndefined = this.wasWarframeDiscordLastTickUndefined;
    };
    BigBrowserV2UserStats.merge = function (user) {
        var stats = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            stats[_i - 1] = arguments[_i];
        }
        var result = BigBrowserV2UserStats.create(user);
        for (var _a = 0, stats_1 = stats; _a < stats_1.length; _a++) {
            var item = stats_1[_a];
            item.injectInto(result);
        }
        return result;
    };
    BigBrowserV2UserStats.prototype.clone = function () {
        return new BigBrowserV2UserStats(JSON.parse(JSON.stringify(this.stats)));
    };
    return BigBrowserV2UserStats;
}());
exports.BigBrowserV2UserStats = BigBrowserV2UserStats;
var BigBrowserV2UserStatsTimed = /** @class */ (function (_super) {
    __extends(BigBrowserV2UserStatsTimed, _super);
    function BigBrowserV2UserStatsTimed(stats, timeDivider) {
        var _this = _super.call(this, stats.data) || this;
        _this._statsTimed = stats;
        _this._timeDivider = timeDivider;
        return _this;
    }
    Object.defineProperty(BigBrowserV2UserStatsTimed.prototype, "statsTimed", {
        get: function () {
            return this._statsTimed;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BigBrowserV2UserStatsTimed.prototype, "date", {
        get: function () {
            return this.statsTimed.date;
        },
        set: function (value) {
            this.statsTimed.date = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BigBrowserV2UserStatsTimed.prototype, "last", {
        get: function () {
            if (!this.statsTimed.last) {
                return undefined;
            }
            else {
                return new BigBrowserV2UserStats(this.statsTimed.last);
            }
        },
        enumerable: false,
        configurable: true
    });
    BigBrowserV2UserStatsTimed.prototype.finalize = function () {
        if (this.isObsolete) {
            this.statsTimed.last = JSON.parse(JSON.stringify(this.stats));
            this.date = Date.now();
            this.clear();
        }
    };
    Object.defineProperty(BigBrowserV2UserStatsTimed.prototype, "timeDivider", {
        get: function () {
            return this._timeDivider;
        },
        enumerable: false,
        configurable: true
    });
    BigBrowserV2UserStatsTimed.prototype.getDateIndicator = function (date) {
        return this.timeDivider(moment(date));
    };
    Object.defineProperty(BigBrowserV2UserStatsTimed.prototype, "isObsolete", {
        get: function () {
            return this.getDateIndicator(Date.now()) !== this.getDateIndicator(this.date);
        },
        enumerable: false,
        configurable: true
    });
    return BigBrowserV2UserStatsTimed;
}(BigBrowserV2UserStats));
exports.BigBrowserV2UserStatsTimed = BigBrowserV2UserStatsTimed;
var BigBrowserV2UserStatsTimedDay = /** @class */ (function (_super) {
    __extends(BigBrowserV2UserStatsTimedDay, _super);
    function BigBrowserV2UserStatsTimedDay(stats) {
        return _super.call(this, stats, function (date) { return date.day(); }) || this;
    }
    return BigBrowserV2UserStatsTimedDay;
}(BigBrowserV2UserStatsTimed));
exports.BigBrowserV2UserStatsTimedDay = BigBrowserV2UserStatsTimedDay;
var BigBrowserV2UserStatsTimedWeek = /** @class */ (function (_super) {
    __extends(BigBrowserV2UserStatsTimedWeek, _super);
    function BigBrowserV2UserStatsTimedWeek(stats) {
        return _super.call(this, stats, function (date) { return date.week(); }) || this;
    }
    return BigBrowserV2UserStatsTimedWeek;
}(BigBrowserV2UserStatsTimed));
exports.BigBrowserV2UserStatsTimedWeek = BigBrowserV2UserStatsTimedWeek;
var BigBrowserV2User = /** @class */ (function () {
    function BigBrowserV2User(userData) {
        this._userData = userData;
    }
    BigBrowserV2User.get = function (user) {
        if (!user) {
            return undefined;
        }
        if (user instanceof BigBrowserV2User) {
            return user;
        }
        if (user.__userInst) {
            return user.__userInst;
        }
        var result = new BigBrowserV2User(user);
        user.__userInst = result;
        return result;
    };
    BigBrowserV2User.prototype.deleteCustomData = function (masterKey) {
        if (this.userData.customData && this.userData.customData[masterKey]) {
            delete this.userData.customData[masterKey];
        }
    };
    BigBrowserV2User.prototype.getCustomData = function (masterKey, defaultValueBuilder) {
        if (!this.userData.customData) {
            this.userData.customData = {};
        }
        var data = this.userData.customData[masterKey];
        if (data === undefined) {
            data = defaultValueBuilder ? defaultValueBuilder() : {};
            this.userData.customData[masterKey] = data;
        }
        return data;
    };
    Object.defineProperty(BigBrowserV2User.prototype, "userData", {
        get: function () {
            return this._userData;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BigBrowserV2User.prototype, "bannerTemplate", {
        get: function () {
            var template;
            if (this.customBannerTemplate) {
                template = {
                    key: 0,
                    name: 'custom',
                    template: this.customBannerTemplate
                };
            }
            if (!template && this.bannerTemplateKey) {
                template = BannerTemplate_1.default.indexed[this.bannerTemplateKey];
            }
            if (!template) {
                template = BannerTemplate_1.default.default;
            }
            return template;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BigBrowserV2User.prototype, "stats", {
        get: function () {
            if (!this._stats) {
                this._stats = new BigBrowserV2UserStats(this.userData.stats);
                /*
                if(this.displayName.toLowerCase().includes('akamelia')) {
                    this._stats.cheatXPOffset = 1000000;
                }*/
            }
            return this._stats;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BigBrowserV2User.prototype, "dayStats", {
        get: function () {
            if (!this._dayStats) {
                this._dayStats = new BigBrowserV2UserStatsTimedDay(this.userData.dayStats);
            }
            return this._dayStats;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BigBrowserV2User.prototype, "weekStats", {
        get: function () {
            if (!this._weekStats) {
                this._weekStats = new BigBrowserV2UserStatsTimedWeek(this.userData.weekStats);
            }
            return this._weekStats;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BigBrowserV2User.prototype, "rangedDayStats", {
        get: function () {
            if (!this._rangedDayStats) {
                this._rangedDayStats = new BigBrowserV2UserStatsTimedDay(this.userData.rangedDayStats);
            }
            return this._rangedDayStats;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BigBrowserV2User.prototype, "rangedWeekStats", {
        get: function () {
            if (!this._rangedWeekStats) {
                this._rangedWeekStats = new BigBrowserV2UserStatsTimedWeek(this.userData.rangedWeekStats);
            }
            return this._rangedWeekStats;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BigBrowserV2User.prototype, "tracking", {
        get: function () {
            return this.userData.tracking;
        },
        set: function (value) {
            this.userData.tracking = value;
        },
        enumerable: false,
        configurable: true
    });
    BigBrowserV2User.prototype.addXPBonus = function (value) {
        this.stats.xpBonus += value;
        this.dayStats.xpBonus += value;
        this.rangedDayStats.xpBonus += value;
    };
    Object.defineProperty(BigBrowserV2User.prototype, "displayName", {
        get: function () {
            return this.userData.displayName;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BigBrowserV2User.prototype, "name", {
        get: function () {
            return this.userData.name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BigBrowserV2User.prototype, "isBot", {
        get: function () {
            return this.userData.isBot;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BigBrowserV2User.prototype, "joinedTimestamp", {
        get: function () {
            return this.userData.joinedTimestamp;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BigBrowserV2User.prototype, "roles", {
        get: function () {
            return this.userData.roles || [];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BigBrowserV2User.prototype, "isWeird", {
        get: function () {
            return this.userData.isWeird || false;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BigBrowserV2User.prototype, "id", {
        get: function () {
            return this.userData.id;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BigBrowserV2User.prototype, "bannerTemplateKey", {
        get: function () {
            return this.userData.bannerTemplateKey;
        },
        set: function (value) {
            this.userData.bannerTemplateKey = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BigBrowserV2User.prototype, "customBannerTemplate", {
        get: function () {
            return this.userData.customBannerTemplate;
        },
        set: function (value) {
            this.userData.customBannerTemplate = value;
        },
        enumerable: false,
        configurable: true
    });
    BigBrowserV2User.prototype.resetDayWeekStats = function () {
        this.userData.dayStats = {
            date: 0,
            data: BigBrowserV2UserStats.create(this).stats
        };
        this.userData.weekStats = {
            date: 0,
            data: BigBrowserV2UserStats.create(this).stats
        };
        this.userData.rangedDayStats = {
            date: 0,
            data: BigBrowserV2UserStats.create(this).stats
        };
        this.userData.rangedWeekStats = {
            date: 0,
            data: BigBrowserV2UserStats.create(this).stats
        };
    };
    BigBrowserV2User.prototype.toJSON = function () {
        return undefined;
    };
    return BigBrowserV2User;
}());
exports.BigBrowserV2User = BigBrowserV2User;
var BigBrowserV2 = /** @class */ (function () {
    function BigBrowserV2() {
        this._xpMultiplier = 1;
        this.dayRangeDefault = [{
                name: 'Semaine',
                days: [0, 1, 2, 3, 4],
                start: 18,
                end: 23
            }, {
                name: 'Weekend',
                days: [5, 6],
                start: 10,
                end: 23
            }];
        this._dayRange = this.dayRangeDefault;
    }
    BigBrowserV2.prototype.getRosterRanks = function (guild, nbRoster, getLast) {
        if (nbRoster === void 0) { nbRoster = 10; }
        if (getLast === void 0) { getLast = false; }
        var users = this.getFilteredUsers(guild)
            .filter(function (user) { return !user.userData.isBot; });
        var extract = function (statsMapper) { return users
            .map(function (user) { return ({
            user: user,
            stats: statsMapper(user)
        }); })
            .filter(function (obj) { return obj.stats; })
            .sort(function (a, b) { return b.stats.xp - a.stats.xp; })
            .slice(0, nbRoster); };
        var day = getLast ? function (user) { return user.rangedDayStats.last; } : function (user) { return user.rangedDayStats; };
        var week = getLast ? function (user) { return user.rangedWeekStats.last; } : function (user) { return user.rangedWeekStats; };
        return {
            day: extract(day),
            week: extract(function (user) { return BigBrowserV2UserStats.merge(user, week(user), day(user)); }),
            global: extract(function (user) { return user.stats; })
        };
    };
    Object.defineProperty(BigBrowserV2.prototype, "xpMultiplier", {
        get: function () {
            return this._xpMultiplier;
        },
        set: function (value) {
            this._xpMultiplier = value !== null && value !== void 0 ? value : 1;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BigBrowserV2.prototype, "dayRange", {
        get: function () {
            return this._dayRange;
        },
        set: function (value) {
            this._dayRange = value !== null && value !== void 0 ? value : this.dayRangeDefault;
        },
        enumerable: false,
        configurable: true
    });
    BigBrowserV2.prototype.isInDayRange = function (dateTime) {
        if (dateTime === void 0) { dateTime = Date.now(); }
        var m = moment(dateTime);
        var day = (m.day() - 1 + 7) % 7;
        var hour = m.hour();
        for (var _i = 0, _a = this.dayRange; _i < _a.length; _i++) {
            var range = _a[_i];
            if (range.days.includes(day)) {
                if (range.start <= range.end) {
                    return range.start <= hour && hour <= range.end;
                }
                else {
                    return range.start <= hour || hour <= range.end;
                }
            }
        }
        return false;
    };
    BigBrowserV2.prototype.getServers = function () {
        if (!this.servers)
            this.servers = {};
        return this.servers;
    };
    BigBrowserV2.prototype.getServer = function (guild) {
        var servers = this.getServers();
        var now = Date.now();
        var serverId = guild.id;
        var server = servers[serverId];
        if (!server) {
            server = {
                id: serverId,
                name: guild.name,
                createDate: now,
                users: {}
            };
            servers[serverId] = server;
        }
        return server;
    };
    /*
    getUserVoiceExp(user: IBigBrowserV2User)
    {
        const score30minutes = user.stats.totalVoiceTimeMs / (1000 * 60 * 30);
        return score30minutes;
    }

    getUserTextExp(user: IBigBrowserV2User)
    {
        const score500chars = user.stats.totalTextSize / 500;
        return score500chars;
    }

    getUserExp(user: IBigBrowserV2User)
    {
        const voiceScore = this.getUserVoiceExp(user);
        const textScore = this.getUserTextExp(user);

        return voiceScore + textScore;
    }*/
    BigBrowserV2.prototype.getUserRanking = function (user, server) {
        var users = this.getSortedUsers(server).reverse();
        var len = users.length;
        var index;
        for (index = 0; index < len; ++index) {
            if (users[index].id == user.id)
                break;
        }
        return {
            index: index,
            total: len
        };
    };
    BigBrowserV2.prototype.deleteUser = function (member) {
        var id = member.id;
        var server = this.getServer(member.guild);
        if (!server.users)
            server.users = {};
        delete server.users[id];
    };
    BigBrowserV2.prototype.deleteServer = function (guild) {
        var servers = this.getServers();
        delete servers[guild.id];
    };
    BigBrowserV2.prototype.getUserById = function (guild, userId) {
        var server = this.getServer(guild);
        var user = server.users[userId];
        return user && BigBrowserV2User.get(user);
    };
    BigBrowserV2.prototype.getUser = function (member) {
        var now = Date.now();
        var id = member.id;
        var server = this.getServer(member.guild);
        if (!server.users)
            server.users = {};
        var user = server.users[id];
        if (!user) {
            user = {
                id: id,
                createDate: now
            };
            server.users[id] = user;
        }
        var userInst = BigBrowserV2User.get(user);
        user.lastUpdate = now;
        user.displayName = member.displayName;
        user.name = member.nickname;
        if (member.bot !== undefined)
            user.isBot = member.bot;
        if (member.user && member.user.bot !== undefined)
            user.isBot = member.user.bot;
        if (!user.stats) {
            user.stats = BigBrowserV2UserStats.create(userInst).stats;
        }
        if (!user.dayStats) {
            user.dayStats = {
                date: 0,
                data: BigBrowserV2UserStats.create(userInst).stats
            };
        }
        if (!user.weekStats) {
            user.weekStats = {
                date: 0,
                data: BigBrowserV2UserStats.create(userInst).stats
            };
        }
        if (!user.rangedDayStats) {
            user.rangedDayStats = {
                date: 0,
                data: BigBrowserV2UserStats.create(userInst).stats
            };
        }
        if (!user.rangedWeekStats) {
            user.rangedWeekStats = {
                date: 0,
                data: BigBrowserV2UserStats.create(userInst).stats
            };
        }
        if (!user.joinedTimestamp)
            user.joinedTimestamp = member.joinedTimestamp;
        if (member.roles)
            user.roles = member.roles.valueOf().map(function (role) { return role.name; });
        if (member.roles)
            user.isWeird = member.roles.valueOf().some(function (role) { return role.name === 'EN phase de test' || role.name === 'Tenno'; }) && !user.stats.tvt;
        var zero = function (name) {
            if (user.stats[name] === undefined)
                user.stats[name] = 0;
        };
        zero('totalWarframeDiscordTimeMs');
        zero('totalWarframeDiscordTimeMsNot');
        zero('totalWarframeDiscordTimeMsUndefined');
        return BigBrowserV2User.get(user);
    };
    BigBrowserV2.prototype.save = function () {
        return {
            servers: this.getServers(),
            xpMultiplier: this.xpMultiplier,
            dayRange: this.dayRange
        };
    };
    BigBrowserV2.prototype.load = function (obj, ctx) {
        this.servers = obj.servers;
        this.xpMultiplier = obj.xpMultiplier;
        this.dayRange = obj.dayRange;
        this.cleanupData();
        if (obj.servers) {
            console.log("******* BigBrowserV2 info *******");
            console.log("== Servers ==");
            for (var propName in obj.servers) {
                var server = obj.servers[propName];
                //console.log();
                console.log("> " + server.name + " (" + propName + "): " + JSON.stringify(server).length + " chars / " + Object.keys(server.users).length + " users");
                //console.log(JSON.stringify(server.users[Object.keys(server.users)[0]]));
                /*console.log(`===== Users ==`);
                for(const userId in server.users) {
                    const user = server.users[userId];
                    console.log(`= ${user.displayName} (${userId}): ${JSON.stringify(user).length} chars`);
                }*/
            }
            console.log("**************");
        }
    };
    BigBrowserV2.prototype.cleanupData = function () {
        var oldP = [
            'lastVocalDate',
            'totalVoiceTimeMs',
            'nbTextMessages',
            'nbTextMessagesWithDuplicates',
            'totalTextSize',
            'totalTextSizeWithDuplicates',
            'lastTextContent',
            'lastTextDate',
            'lastNotDuplicateTextDate',
            'wasVoicingLastTick',
            'wasWarframeDiscordLastTickNot',
            'totalWarframeDiscordTimeMsNot',
            'lastWarframeDiscordDateNot',
            'wasWarframeDiscordLastTick',
            'wasWarframeDiscordLastTickUndefined',
            'totalWarframeDiscordTimeMsUndefined',
            'lastWarframeDiscordDateUndefined',
            'totalWarframeDiscordTimeMs',
            'lastWarframeDiscordDate',
            'xpBonus',
        ];
        var newP = [
            'lvd',
            'tvt',
            'ntm',
            'ntmd',
            'tts',
            'ttsd',
            'ltc',
            'ltd',
            'lndtd',
            'wvlt',
            'wwdltn',
            'twdt',
            'lwdd',
            'wwdl',
            'wwdlt',
            'twdtu',
            'lwddy',
            'twdtm',
            'lwddd',
            'xb',
        ];
        var servers = this.getServers();
        for (var serverId in servers) {
            var server = servers[serverId];
            var users = server.users;
            for (var userId in users) {
                var user = users[userId];
                delete user.v1;
                delete user.__debug;
                delete user.___debug;
                delete user.__userInst;
                var clean = function (obj) {
                    if (!obj) {
                        return;
                    }
                    for (var i = 0; i < oldP.length; ++i) {
                        var oldPropName = oldP[i];
                        var newPropName = newP[i];
                        if (obj[oldPropName] !== undefined) {
                            obj[newPropName] = obj[oldPropName];
                            delete obj[oldPropName];
                        }
                    }
                };
                clean(user.stats);
                clean(user.dayStats && user.dayStats.data);
                clean(user.weekStats && user.weekStats.data);
                clean(user.rangedDayStats && user.rangedDayStats.data);
                clean(user.rangedWeekStats && user.rangedWeekStats.data);
                clean(user.dayStats && user.dayStats.last);
                clean(user.weekStats && user.weekStats.last);
                clean(user.rangedDayStats && user.rangedDayStats.last);
                clean(user.rangedWeekStats && user.rangedWeekStats.last);
            }
        }
    };
    /*
    initWithV1Data(servers: any)
    {
        var now = Date.now();

        for(const serverId in servers)
        {
            const oldServer = servers[serverId];
            const server = this.getServer({
                id: oldServer.__id__ || serverId,
                name: oldServer.__name__
            });

            if(!server.users)
                server.users = {};

            for(const userId in oldServer)
            {
                if(userId !== '__name__' && userId !== '__id__')
                {
                    const oldUser = oldServer[userId];

                    const user: IBigBrowserV2User = {
                        displayName: oldUser.__name__,
                        isBot: false,
                        id: userId,
                        createDate: now,
                        lastUpdate: now,
                        v1: {
                            lastVocalDate: oldUser.vocalActivity_date,
                            totalVoiceTimeMs: (oldUser.vocalActivity * 500) / (1 / (30 * 60 * 2)),
                            nbTextMessages: oldUser.textActivity * 2,
                            nbTextMessagesWithDuplicates: oldUser.textActivity * 2,
                            totalTextSize: oldUser.textActivity * 2 * 18,
                            totalTextSizeWithDuplicates: oldUser.textActivity * 2 * 18,
                            lastTextContent: undefined,
                            lastTextDate: oldUser.textActivity_date,
                            lastNotDuplicateTextDate: oldUser.textActivity_date,
                            wasVoicingLastTick: false,
                            totalWarframeDiscordTimeMs: oldUser.warframeActivity ? oldUser.warframeActivity * 500 : undefined,
                            lastWarframeDiscordDate: oldUser.warframeActivity_date ? oldUser.warframeActivity_date : undefined,
                            totalWarframeDiscordTimeMsUndefined: oldUser.warframeActivity_total ? oldUser.warframeActivity_total * 500 : undefined,
                            lastWarframeDiscordDateUndefined: oldUser.warframeActivity_date ? oldUser.warframeActivity_date : undefined
                        }
                    } as any;

                    user.stats = JSON.parse(JSON.stringify(user.v1));
                    user.v1.oldServerId = serverId;
                    user.v1.oldUser = oldUser;

                    server.users[userId] = user;
                }
            }
        }
    }*/
    BigBrowserV2.prototype.updateServer = function (guild) {
        var _this = this;
        return new Promise(function (resolve) {
            var server = _this.getServer(guild);
            var members = guild.members.valueOf().map(function (m) { return m; });
            var _loop_1 = function (userId) {
                var user = server.users[userId];
                if (members.some(function (m) { return m.id === userId; })) {
                    delete user.removedDate;
                }
                else {
                    user.removedDate = Date.now();
                }
            };
            for (var userId in server.users) {
                _loop_1(userId);
            }
            var _loop_2 = function (member) {
                var now = Date.now();
                /*
                if(member.displayName !== 'Akamelia ♡')
                    return;*/
                var user = _this.getUser(member);
                var isInWarframe = undefined;
                if (config_1.default.server.info.game && member.presence) {
                    for (var _a = 0, _b = member.presence.activities; _a < _b.length; _a++) {
                        var activity = _b[_a];
                        if (activity.type === 'PLAYING') {
                            isInWarframe = activity.name.toLowerCase() === config_1.default.server.info.game.processName.toLowerCase();
                        }
                    }
                }
                var updateStats = function (stats, updateData) {
                    if (updateData === void 0) { updateData = true; }
                    if (isInWarframe !== undefined) {
                        if (isInWarframe) {
                            if (!stats.wasWarframeDiscordLastTick) {
                                stats.wasWarframeDiscordLastTick = true;
                            }
                            else {
                                if (updateData) {
                                    stats.totalWarframeDiscordTimeMs += now - stats.lastWarframeDiscordDate;
                                }
                            }
                            stats.lastWarframeDiscordDate = now;
                            stats.wasWarframeDiscordLastTickNot = false;
                        }
                        else {
                            if (!stats.wasWarframeDiscordLastTickNot) {
                                stats.wasWarframeDiscordLastTickNot = true;
                            }
                            else {
                                if (updateData) {
                                    stats.totalWarframeDiscordTimeMsNot += now - stats.lastWarframeDiscordDateNot;
                                }
                            }
                            stats.lastWarframeDiscordDateNot = now;
                            stats.wasWarframeDiscordLastTick = false;
                        }
                        stats.wasWarframeDiscordLastTickUndefined = false;
                    }
                    else {
                        if (!stats.wasWarframeDiscordLastTickUndefined) {
                            stats.wasWarframeDiscordLastTickUndefined = true;
                        }
                        else {
                            if (updateData) {
                                stats.totalWarframeDiscordTimeMsUndefined += now - stats.lastWarframeDiscordDateUndefined;
                            }
                        }
                        stats.lastWarframeDiscordDateUndefined = now;
                        stats.wasWarframeDiscordLastTickNot = false;
                        stats.wasWarframeDiscordLastTick = false;
                    }
                    if (member.voice && member.voice.channelId && !member.voice.deaf && member.voice.channelId !== guild.afkChannelId) {
                        if (!stats.wasVoicingLastTick) {
                            stats.wasVoicingLastTick = true;
                        }
                        else {
                            if (updateData) {
                                stats.totalVoiceTimeMs += now - stats.lastVocalDate;
                            }
                        }
                        stats.lastVocalDate = now;
                    }
                    else {
                        stats.wasVoicingLastTick = false;
                    }
                };
                if (user.dayStats.isObsolete) {
                    user.dayStats.injectInto(user.weekStats);
                    user.dayStats.finalize();
                }
                if (user.weekStats.isObsolete) {
                    user.weekStats.finalize();
                }
                if (user.rangedDayStats.isObsolete) {
                    user.rangedDayStats.injectInto(user.rangedWeekStats);
                    user.rangedDayStats.finalize();
                }
                if (user.rangedWeekStats.isObsolete) {
                    user.rangedWeekStats.finalize();
                }
                updateStats(user.stats);
                updateStats(user.dayStats);
                updateStats(user.rangedDayStats, _this.isInDayRange(now));
            };
            for (var _i = 0, members_1 = members; _i < members_1.length; _i++) {
                var member = members_1[_i];
                _loop_2(member);
            }
            process.nextTick(resolve);
        });
    };
    BigBrowserV2.prototype.resetDayWeekStats = function (guild) {
        var server = this.getServer(guild);
        for (var userId in server.users) {
            var user = BigBrowserV2User.get(server.users[userId]);
            user.resetDayWeekStats();
        }
    };
    BigBrowserV2.prototype.updateUserText = function (message) {
        var content = message.content;
        if (content) {
            var member = message.member;
            /*
            if(member.displayName !== 'Akamelia ♡')
                return;*/
            var user = this.getUser(member);
            var now_1 = Date.now();
            var updateData = function (stats, updateData) {
                if (updateData === void 0) { updateData = true; }
                if (stats.lastTextContent !== content) {
                    if (updateData) {
                        ++stats.nbTextMessages;
                        stats.totalTextSize += message.content.length;
                    }
                    stats.lastNotDuplicateTextDate = now_1;
                }
                if (updateData) {
                    stats.lastTextContent = content;
                    ++stats.nbTextMessagesWithDuplicates;
                    stats.totalTextSizeWithDuplicates += message.content.length;
                }
                stats.lastTextDate = now_1;
            };
            updateData(user.stats);
            updateData(user.dayStats);
            updateData(user.rangedDayStats, this.isInDayRange(now_1));
        }
    };
    BigBrowserV2.prototype.setTrackingUser = function (member, isTracking) {
        var user = this.getUser(member);
        if (isTracking) {
            if (user && user.tracking === false) {
                this.deleteUser(member);
            }
        }
        else {
            if (user) {
                for (var propName in user) {
                    delete user[propName];
                }
                user.tracking = false;
            }
        }
    };
    BigBrowserV2.prototype.setTrackingServer = function (guild, isTracking) {
        var server = this.getServer(guild);
        if (isTracking) {
            if (server && server.tracking === false)
                this.deleteServer(guild);
        }
        else {
            if (server) {
                for (var propName in server)
                    delete server[propName];
                server.tracking = false;
            }
        }
    };
    BigBrowserV2.prototype.getServersText = function (servers, withBOM) {
        if (withBOM === void 0) { withBOM = false; }
        var result = '';
        var isFirst = true;
        for (var _i = 0, servers_1 = servers; _i < servers_1.length; _i++) {
            var serverGuild = servers_1[_i];
            if (!isFirst)
                result += '\r\n';
            isFirst = false;
            var server = void 0;
            if (serverGuild.constructor && serverGuild.constructor.name === 'Guild') {
                server = this.getServer(serverGuild);
            }
            else {
                server = serverGuild;
            }
            if (server.tracking !== false) {
                var body = this.getServerText(server);
                var firstLine = body.split(/\r?\n/img, 2)[1];
                var header = '';
                var nbCharsLeft = firstLine.length - (server.name.length + 4) * 3 - 4 * 2;
                for (var i = 0; i < 4; ++i)
                    header += '=';
                header += "[ " + server.name + " ]";
                for (var i = 0; i < nbCharsLeft / 2; ++i)
                    header += '=';
                header += "[ " + server.name + " ]";
                for (var i = 0; i < nbCharsLeft / 2; ++i)
                    header += '=';
                header += "[ " + server.name + " ]";
                for (var i = 0; i < 4; ++i)
                    header += '=';
                var footer = '';
                while (footer.length < firstLine.length)
                    footer += '=';
                result += header + "\r\n";
                result += body;
                result += "\r\n" + footer + "\r\n";
            }
        }
        return result;
    };
    BigBrowserV2.prototype.getServersCSV = function (servers, withBOM) {
        var result = withBOM ? decodeURIComponent('%EF%BB%BF') : '';
        var isFirst = true;
        for (var _i = 0, servers_2 = servers; _i < servers_2.length; _i++) {
            var serverGuild = servers_2[_i];
            if (!isFirst)
                result += '\r\n\r\n';
            isFirst = false;
            var server = void 0;
            if (serverGuild.constructor && serverGuild.constructor.name === 'Guild') {
                server = this.getServer(serverGuild);
            }
            else {
                server = serverGuild;
            }
            if (server.tracking !== false) {
                result += "================================;" + server.name + "\r\n";
                result += this.getServerCSV(server, false);
            }
        }
        return result;
    };
    BigBrowserV2.prototype.getServersMarkDown = function (servers) {
        var result = '';
        var isFirst = true;
        for (var _i = 0, servers_3 = servers; _i < servers_3.length; _i++) {
            var serverGuild = servers_3[_i];
            if (!isFirst)
                result += '\r\n\r\n';
            isFirst = false;
            var server = void 0;
            if (serverGuild.constructor && serverGuild.constructor.name === 'Guild') {
                server = this.getServer(serverGuild);
            }
            else {
                server = serverGuild;
            }
            if (server.tracking !== false) {
                result += "**" + server.name + "**\r\n";
                result += this.getServerMarkDown(server);
            }
        }
        return result;
    };
    BigBrowserV2.prototype.getServerCSV = function (server, withBOM) {
        var formatter = {
            SKIP: {},
            row: function () {
                var argss = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    argss[_i] = arguments[_i];
                }
                argss = argss.filter(function (a) { return a !== formatter.SKIP; });
                var args = [];
                for (var _a = 0, argss_1 = argss; _a < argss_1.length; _a++) {
                    var arg = argss_1[_a];
                    if (arg === undefined || arg === null)
                        args.push('?');
                    else
                        args.push(arg.toString());
                }
                return args.join(';') + "\r\n";
            },
            noRow: undefined
        };
        formatter.noRow = formatter.row;
        var text = this.getServerFormatted(server, formatter);
        return (withBOM ? decodeURIComponent('%EF%BB%BF') : '') + text;
    };
    BigBrowserV2.prototype.getServerMarkDown = function (server) {
        var nbCols = undefined;
        var formatter = {
            SKIP: {},
            headerEnd: function () {
                var text = '';
                for (var i = 0; i < nbCols; ++i)
                    text += '|-';
                return text + "|\r\n";
            },
            row: function () {
                var argss = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    argss[_i] = arguments[_i];
                }
                argss = argss.filter(function (a) { return a !== formatter.SKIP; });
                if (nbCols === undefined)
                    nbCols = argss.length;
                var args = [];
                for (var _a = 0, argss_2 = argss; _a < argss_2.length; _a++) {
                    var arg = argss_2[_a];
                    if (arg === undefined || arg === null)
                        args.push('?');
                    else
                        args.push(arg.toString());
                }
                return "| " + args.join(' | ') + " |\r\n";
            },
            noRow: function () {
                var argss = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    argss[_i] = arguments[_i];
                }
                argss = argss.filter(function (a) { return a !== formatter.SKIP; });
                var args = [];
                for (var _a = 0, argss_3 = argss; _a < argss_3.length; _a++) {
                    var arg = argss_3[_a];
                    if (arg === undefined || arg === null)
                        args.push('?');
                    else
                        args.push(arg.toString());
                }
                return "| " + args.join(' ') + " |\r\n";
            }
        };
        return this.getServerFormatted(server, formatter);
    };
    BigBrowserV2.prototype.getServerText = function (server) {
        var pad = function (value, nb, char) {
            if (nb === void 0) { nb = 0; }
            value = value === undefined || value === null ? '' : value.toString();
            if (char === undefined)
                char = ' ';
            while (value.length < nb)
                value = "" + char + value;
            return value;
        };
        var pads = [
            35, 35, 0, 0, 20,
            20, 0, 0, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0,
        ];
        var isFirstRow = true;
        var formatter = {
            SKIP: {},
            headerEnd: function () {
                var str = '';
                for (var _i = 0, pads_1 = pads; _i < pads_1.length; _i++) {
                    var padding = pads_1[_i];
                    if (padding) {
                        str += pad('', padding + 3, '=');
                    }
                }
                return str.substring(0, str.length - 3) + '\r\n';
            },
            row: function () {
                var argss = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    argss[_i] = arguments[_i];
                }
                argss = argss.filter(function (a) { return a !== formatter.SKIP; });
                var args = [];
                var index = 0;
                for (var _a = 0, argss_4 = argss; _a < argss_4.length; _a++) {
                    var arg = argss_4[_a];
                    if (arg === undefined || arg === null)
                        args.push(pad('?', pads[index]));
                    else
                        args.push(pad(arg.toString(), pads[index]));
                    ++index;
                }
                if (isFirstRow) {
                    isFirstRow = false;
                    pads = args.map(function (str, i) {
                        var pad = pads[i];
                        if (!pad)
                            return str.length;
                        else
                            return pad;
                    });
                }
                return args.join(' | ') + "\r\n";
            },
            noRow: function () {
                var argss = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    argss[_i] = arguments[_i];
                }
                argss = argss.filter(function (a) { return a !== formatter.SKIP; });
                var args = [];
                for (var _a = 0, argss_5 = argss; _a < argss_5.length; _a++) {
                    var arg = argss_5[_a];
                    if (arg === undefined || arg === null)
                        args.push('?');
                    else
                        args.push(arg.toString());
                }
                return args.join(' ') + "\r\n";
            }
        };
        return this.getServerFormatted(server, formatter);
    };
    BigBrowserV2.prototype.getFilteredUsers = function (_server) {
        if (_server.constructor && _server.constructor.name === 'Guild')
            _server = this.getServer(_server);
        var server = _server;
        var users = Object.keys(server.users)
            .map(function (id) { return server.users[id]; })
            .filter(function (user) { return !user.removedDate; })
            .filter(function (user) { return user.tracking !== false; })
            .map(function (user) { return BigBrowserV2User.get(user); });
        return users;
    };
    BigBrowserV2.prototype.getSortedUsers = function (_server) {
        if (_server.constructor && _server.constructor.name === 'Guild')
            _server = this.getServer(_server);
        var server = _server;
        var users = Object.keys(server.users)
            .map(function (id) { return server.users[id]; })
            .filter(function (user) { return !user.removedDate; })
            .filter(function (user) { return user.tracking !== false; })
            .map(function (user) { return BigBrowserV2User.get(user); })
            .sort(function (u1, u2) {
            var u1exp = u1.stats.xp;
            var u2exp = u2.stats.xp;
            return u1exp > u2exp ? 1 : u1exp === u2exp ? 0 : -1;
        });
        return users;
    };
    BigBrowserV2.prototype.getServerFormatted = function (server, formatter) {
        var text = '';
        formatter.asDate = formatter.asDate || (function (date, includeTime) {
            var dateString;
            var dateObj = moment(date).tz('Europe/Paris');
            if (includeTime === false)
                dateString = dateObj.format('DD/MM/YYYY');
            else
                dateString = dateObj.format('DD/MM/YYYY HH:mm');
            return dateString;
        });
        formatter.asPercent = formatter.asPercent || (function (value) {
            value = value || 0;
            return (value * 100).toString();
        });
        formatter.asInteger = formatter.asInteger || (function (value) {
            value = value || 0;
            value = Math.floor(value);
            return value.toString();
        });
        formatter.asSeconds = formatter.asSeconds || (function (value) {
            return formatter.asInteger((value || 0) / 1000).toString();
        });
        formatter.asFloat = formatter.asFloat || (function (value) {
            value = value || 0;
            return value.toString();
        });
        formatter.asBool = formatter.asBool || (function (value) {
            return value ? '1' : '0';
        });
        formatter.asString = formatter.asString || (function (value) {
            return value !== undefined && value !== null ? value.toString() : '';
        });
        var users = this.getSortedUsers(server);
        if (formatter.onStart)
            formatter.onStart(users);
        if (users.length === 0) {
            text = formatter.noRow();
        }
        else {
            if (formatter.headerStart)
                text += formatter.headerStart();
            text += formatter.row(formatter.asString('Utilisateur (nom affiché)'), formatter.asString('Utilisateur (compte)'), formatter.asString('Est un bot ?'), formatter.asString('Expérience totale (exp)'), formatter.asString('Rang'), formatter.asString('Prochain rang'), formatter.asString('Progression vers le prochain rang (%)'), formatter.asString('Expérience restante avant prochain rang (exp)'), formatter.asString('Expérience restante avant prochain rang (%)'), formatter.asString('Expérience vocale (exp)'), formatter.asString('Temps total en vocal (sec)'), formatter.asString('Dernière mise à jour exp vocale'), formatter.asString('Expérience écrite (exp)'), formatter.asString('Dernière mise à jour exp écrite'), formatter.asString('Nb messages textes'), formatter.asString('Taille totale des messages textes'), formatter.asString('Nb messages textes (avec duplicatas)'), formatter.asString('Taille totale des messages textes (avec duplicatas)'), config_1.default.server.info.game ? formatter.asString("Temps total sur " + config_1.default.server.info.game.name + " (%)") : formatter.SKIP, config_1.default.server.info.game ? formatter.asString("Temps total sur " + config_1.default.server.info.game.name + " (sec)") : formatter.SKIP, config_1.default.server.info.game ? formatter.asString("Derni\u00E8re connection \u00E0 " + config_1.default.server.info.game.name) : formatter.SKIP, config_1.default.server.info.game ? formatter.asString("Temps total sur autre chose que " + config_1.default.server.info.game.name + " (sec)") : formatter.SKIP, config_1.default.server.info.game ? formatter.asString("Dernier jeu autre que " + config_1.default.server.info.game.name) : formatter.SKIP, config_1.default.server.info.game ? formatter.asString('Temps total sur aucune application (sec)') : formatter.SKIP, config_1.default.server.info.game ? formatter.asString('Dernière connection à aucune application') : formatter.SKIP, formatter.asString('Date de join'), formatter.asString('Roles'), formatter.asString('Inactif ?'));
            if (formatter.headerEnd)
                text += formatter.headerEnd();
            if (formatter.bodyStart)
                text += formatter.bodyStart();
            for (var _i = 0, users_1 = users; _i < users_1.length; _i++) {
                var user = users_1[_i];
                var exp = user.stats.xp;
                var rank = user.stats.rank;
                text += formatter.row(formatter.asString(user.displayName), formatter.asString(user.name), formatter.asBool(user.isBot), formatter.asFloat(exp), formatter.asString(rank.currentRank ? rank.currentRank.name : undefined), formatter.asString(rank.nextRank ? rank.nextRank.name : undefined), formatter.asPercent(rank.currentExpPercentToNextRank), formatter.asFloat(rank.expLeftToNextRank), formatter.asPercent(rank.expLeftToNextRankPercent), formatter.asFloat(user.stats.voiceXp), formatter.asSeconds(user.stats.totalVoiceTimeMs), formatter.asDate(user.stats.lastVocalDate), formatter.asFloat(user.stats.textXp), formatter.asDate(user.stats.lastTextDate), formatter.asInteger(user.stats.nbTextMessages), formatter.asInteger(user.stats.totalTextSize), formatter.asInteger(user.stats.nbTextMessagesWithDuplicates), formatter.asInteger(user.stats.totalTextSizeWithDuplicates), config_1.default.server.info.game ? (!user.stats.lastWarframeDiscordDate && !user.stats.lastWarframeDiscordDateNot
                    ? formatter.asString('N/A')
                    : formatter.asPercent(user.stats.totalWarframeDiscordTimeMs / (user.stats.totalWarframeDiscordTimeMs + user.stats.totalWarframeDiscordTimeMsNot + user.stats.totalWarframeDiscordTimeMsUndefined))) : formatter.SKIP, config_1.default.server.info.game ? formatter.asSeconds(user.stats.totalWarframeDiscordTimeMs) : formatter.SKIP, config_1.default.server.info.game ? formatter.asDate(user.stats.lastWarframeDiscordDate) : formatter.SKIP, config_1.default.server.info.game ? formatter.asSeconds(user.stats.totalWarframeDiscordTimeMsNot) : formatter.SKIP, config_1.default.server.info.game ? formatter.asDate(user.stats.lastWarframeDiscordDateNot) : formatter.SKIP, config_1.default.server.info.game ? formatter.asSeconds(user.stats.totalWarframeDiscordTimeMsUndefined) : formatter.SKIP, config_1.default.server.info.game ? formatter.asDate(user.stats.lastWarframeDiscordDateUndefined) : formatter.SKIP, formatter.asDate(user.joinedTimestamp), formatter.asString((user.roles || []).join(' / ')), formatter.asBool(user.isWeird || false));
            }
            if (formatter.bodyEnd)
                text += formatter.bodyEnd();
        }
        return text.trimRight();
    };
    BigBrowserV2.ranks = (function () {
        var ranks = config_1.default.server.ranks;
        var index = -1;
        var lastRank = undefined;
        for (var rankStart in ranks) {
            var rank = ranks[rankStart];
            rank.start = rankStart;
            rank.index = ++index;
            if (lastRank)
                lastRank.end = rank.start;
            lastRank = rank;
        }
        return ranks;
    })();
    return BigBrowserV2;
}());
exports.BigBrowserV2 = BigBrowserV2;
