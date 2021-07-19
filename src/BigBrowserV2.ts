import * as moment from 'moment-timezone'
import { Guild, GuildMember } from 'discord.js'
import config from './config'

export interface IBigBrowserV2Rang {
    name: string
    index: number
    start: number
    end?: number
}
export interface IBigBrowserV2Rangs {
    [xpStart: number]: IBigBrowserV2Rang
}

export interface IBigBrowserV2Server {
    id: string
    name: string
    createDate: number
    users: IBigBrowserV2Users
    tracking?: boolean
}
export interface IBigBrowserV2Servers {
    [id: string]: IBigBrowserV2Server
}
export interface IBigBrowserV2Users {
    [id: string]: IBigBrowserV2User
}

export interface IBigBrowserV2UserV1 {
    lastVocalDate: number
    totalVoiceTimeMs: number
    nbTextMessages: number
    nbTextMessagesWithDuplicates: number
    totalTextSize: number
    totalTextSizeWithDuplicates: number
    lastTextContent: string
    lastTextDate: number
    lastNotDuplicateTextDate: number
    wasVoicingLastTick: boolean
    totalWarframeDiscordTimeMs: number
    lastWarframeDiscordDate: number
    totalWarframeDiscordTimeMsUndefined: number
    lastWarframeDiscordDateUndefined: number

    oldServerId?: string
    oldUser?: string
}
export interface IBigBrowserV2User {
    __userInst?: BigBrowserV2User
    
    displayName: string
    name: string
    isBot: boolean
    id: string
    createDate: number
    lastUpdate: number
    
    joinedTimestamp: number
    roles: string[]
    isWeird: boolean
    removedDate: number
    tracking?: boolean
    bannerTemplateKey?: string

    //v1: IBigBrowserV2UserV1

    xpBonus?: number

    stats?: IBigBrowserV2UserStats

    dayStats?: IBigBrowserV2UserStatsTimed
    weekStats?: IBigBrowserV2UserStatsTimed

    rangedDayStats?: IBigBrowserV2UserStatsTimed
    rangedWeekStats?: IBigBrowserV2UserStatsTimed
}
export interface IBigBrowserV2UserStatsTimed {
    date: number
    data: IBigBrowserV2UserStats
    last?: IBigBrowserV2UserStats
}
export interface IBigBrowserV2UserStats {
    lvd: number
    tvt: number
    ntm: number
    ntmd: number
    tts: number
    ttsd: number
    ltc: string
    ltd: number
    lndtd: number
    wvlt: boolean

    wwdltn: boolean
    twdt: number
    lwdd: number
    wwdl: boolean
    wwdlt: boolean

    twdtu: number
    lwddy: number
    twdtm: number
    lwddd: number

    xb?: number
}

export class BigBrowserV2UserStats {
    public constructor(stats: IBigBrowserV2UserStats) {
        this._stats = stats;
    }

    public static create(user: BigBrowserV2User) {
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
    }

    private _stats: IBigBrowserV2UserStats;
    public get stats() {
        return this._stats;
    }
    public set stats(value) {
        for(const propName in value) {
            delete this.stats[propName];
        }
        for(const propName in value) {
            this.stats[propName] = value[propName];
        }
    }

    public get voiceXp() {
        return this.stats.tvt / config.server.info.xp.voiceMs;
    }

    public get textXp() {
        return this.stats.tts / config.server.info.xp.textChars;
    }

    public get xpBonus() {
        return this.stats.xb || 0;
    }
    public set xpBonus(value) {
        this.stats.xb = value;
    }
    
    public get xp() {
        return this.voiceXp + this.textXp + this.xpBonus;
    }
    
    public get lastVocalDate() {
        return this.stats.lvd;
    }
    public set lastVocalDate(value) {
        this.stats.lvd = value;
    }
    public get totalVoiceTimeMs() {
        return this.stats.tvt;
    }
    public set totalVoiceTimeMs(value) {
        this.stats.tvt = value;
    }
    public get nbTextMessages() {
        return this.stats.ntm;
    }
    public set nbTextMessages(value) {
        this.stats.ntm = value;
    }
    public get nbTextMessagesWithDuplicates() {
        return this.stats.ntmd;
    }
    public set nbTextMessagesWithDuplicates(value) {
        this.stats.ntmd = value;
    }
    public get totalTextSize() {
        return this.stats.tts;
    }
    public set totalTextSize(value) {
        this.stats.tts = value;
    }
    public get totalTextSizeWithDuplicates() {
        return this.stats.ttsd;
    }
    public set totalTextSizeWithDuplicates(value) {
        this.stats.ttsd = value;
    }
    public get lastTextContent() {
        return this.stats.ltc;
    }
    public set lastTextContent(value) {
        this.stats.ltc = value;
    }
    public get lastTextDate() {
        return this.stats.ltd;
    }
    public set lastTextDate(value) {
        this.stats.ltd = value;
    }
    public get lastNotDuplicateTextDate() {
        return this.stats.lndtd;
    }
    public set lastNotDuplicateTextDate(value) {
        this.stats.lndtd = value;
    }
    public get wasVoicingLastTick() {
        return this.stats.wvlt;
    }
    public set wasVoicingLastTick(value) {
        this.stats.wvlt = value;
    }

    public get wasWarframeDiscordLastTickNot() {
        return this.stats.wwdltn;
    }
    public set wasWarframeDiscordLastTickNot(value) {
        this.stats.wwdltn = value;
    }
    public get totalWarframeDiscordTimeMsNot() {
        return this.stats.twdt;
    }
    public set totalWarframeDiscordTimeMsNot(value) {
        this.stats.twdt = value;
    }
    public get lastWarframeDiscordDateNot() {
        return this.stats.lwdd;
    }
    public set lastWarframeDiscordDateNot(value) {
        this.stats.lwdd = value;
    }
    public get wasWarframeDiscordLastTick() {
        return this.stats.wwdl;
    }
    public set wasWarframeDiscordLastTick(value) {
        this.stats.wwdl = value;
    }
    public get wasWarframeDiscordLastTickUndefined() {
        return this.stats.wwdlt;
    }
    public set wasWarframeDiscordLastTickUndefined(value) {
        this.stats.wwdlt = value;
    }

    public get totalWarframeDiscordTimeMsUndefined() {
        return this.stats.twdtu;
    }
    public set totalWarframeDiscordTimeMsUndefined(value) {
        this.stats.twdtu = value;
    }
    public get lastWarframeDiscordDateUndefined() {
        return this.stats.lwddy;
    }
    public set lastWarframeDiscordDateUndefined(value) {
        this.stats.lwddy = value;
    }
    public get totalWarframeDiscordTimeMs() {
        return this.stats.twdtm;
    }
    public set totalWarframeDiscordTimeMs(value) {
        this.stats.twdtm = value;
    }
    public get lastWarframeDiscordDate() {
        return this.stats.lwddd;
    }
    public set lastWarframeDiscordDate(value) {
        this.stats.lwddd = value;
    }

    public get rank() {
        const exp = this.xp;

        const ranks = BigBrowserV2.ranks;

        let lastMatchingRank = ranks[0];
        let nextRank = undefined;
        for(const rankStart in ranks)
        {
            const rank = ranks[rankStart];

            if(exp >= rank.start)
            {
                lastMatchingRank = rank;
            }
            else if(!nextRank)
            {
                nextRank = rank;
                break;
            }
        }

        if(nextRank === lastMatchingRank)
            nextRank = undefined;

        const expFromCurrentToNextRank = nextRank ? nextRank.start - lastMatchingRank.start : 0;
        const expLeftToNextRank = nextRank ? nextRank.start - exp : 0;
        const expLeftToNextRankPercent = nextRank ? expLeftToNextRank / expFromCurrentToNextRank : 1;

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
    }

    public clear() {
        for(const name in this.stats) {
            delete this.stats[name];
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
    }
    
    public injectInto(stats: BigBrowserV2UserStats) {
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
        stats.xpBonus = (stats.xpBonus ?? 0) + (this.xpBonus ?? 0);
        stats.wasVoicingLastTick = this.wasVoicingLastTick;
        stats.wasWarframeDiscordLastTick = this.wasWarframeDiscordLastTick;
        stats.wasWarframeDiscordLastTickNot = this.wasWarframeDiscordLastTickNot;
        stats.wasWarframeDiscordLastTickUndefined = this.wasWarframeDiscordLastTickUndefined;
    }

    public static merge(user: BigBrowserV2User, ...stats: BigBrowserV2UserStats[]) {
        const result = BigBrowserV2UserStats.create(user);

        for(const item of stats) {
            item.injectInto(result);
        }

        return result;
    }

    public clone() {
        return new BigBrowserV2UserStats(JSON.parse(JSON.stringify(this.stats)));
    }
}

export class BigBrowserV2UserStatsTimed extends BigBrowserV2UserStats {
    public constructor(stats: IBigBrowserV2UserStatsTimed, timeDivider: (date: moment.Moment) => number) {
        super(stats.data);

        this._statsTimed = stats;
        this._timeDivider = timeDivider;
    }

    private _statsTimed: IBigBrowserV2UserStatsTimed;
    public get statsTimed() {
        return this._statsTimed;
    }

    public get date() {
        return this.statsTimed.date;
    }
    public set date(value) {
        this.statsTimed.date = value;
    }

    public get last() {
        if(!this.statsTimed.last) {
            return undefined;
        } else {
            return new BigBrowserV2UserStats(this.statsTimed.last);
        }
    }

    public finalize() {
        if(this.isObsolete) {
            this.statsTimed.last = JSON.parse(JSON.stringify(this.stats));
            this.date = Date.now();
            this.clear();
        }
    }

    private _timeDivider: (date: moment.Moment) => number;
    public get timeDivider() {
        return this._timeDivider;
    }

    public getDateIndicator(date: number) {
        return this.timeDivider(moment(date));
    }

    public get isObsolete() {
        return this.getDateIndicator(Date.now()) !== this.getDateIndicator(this.date);
    }
}
export class BigBrowserV2UserStatsTimedDay extends BigBrowserV2UserStatsTimed {
    public constructor(stats: IBigBrowserV2UserStatsTimed) {
        super(stats, date => date.day());
    }
}
export class BigBrowserV2UserStatsTimedWeek extends BigBrowserV2UserStatsTimed {
    public constructor(stats: IBigBrowserV2UserStatsTimed) {
        super(stats, date => date.week());
    }
}

export class BigBrowserV2User {
    protected constructor(userData: IBigBrowserV2User) {
        this._userData = userData;
    }

    public static get(user: BigBrowserV2User | IBigBrowserV2User): BigBrowserV2User {
        if(!user) {
            return undefined;
        }

        if(user instanceof BigBrowserV2User) {
            return user;
        }

        if(user.__userInst) {
            return user.__userInst;
        }

        const result = new BigBrowserV2User(user);
        user.__userInst = result;
        return result;
    }

    private _userData: IBigBrowserV2User
    public get userData() {
        return this._userData;
    }

    private _stats: BigBrowserV2UserStats;
    public get stats() {
        if(!this._stats) {
            this._stats = new BigBrowserV2UserStats(this.userData.stats);
        }

        return this._stats;
    }

    private _dayStats: BigBrowserV2UserStatsTimedDay;
    public get dayStats() {
        if(!this._dayStats) {
            this._dayStats = new BigBrowserV2UserStatsTimedDay(this.userData.dayStats);
        }

        return this._dayStats;
    }
    private _weekStats: BigBrowserV2UserStatsTimedWeek;
    public get weekStats() {
        if(!this._weekStats) {
            this._weekStats = new BigBrowserV2UserStatsTimedWeek(this.userData.weekStats);
        }

        return this._weekStats;
    }

    private _rangedDayStats: BigBrowserV2UserStatsTimedDay;
    public get rangedDayStats() {
        if(!this._rangedDayStats) {
            this._rangedDayStats = new BigBrowserV2UserStatsTimedDay(this.userData.rangedDayStats);
        }

        return this._rangedDayStats;
    }
    private _rangedWeekStats: BigBrowserV2UserStatsTimedWeek;
    public get rangedWeekStats() {
        if(!this._rangedWeekStats) {
            this._rangedWeekStats = new BigBrowserV2UserStatsTimedWeek(this.userData.rangedWeekStats);
        }

        return this._rangedWeekStats;
    }

    public get tracking() {
        return this.userData.tracking;
    }
    public set tracking(value) {
        this.userData.tracking = value;
    }

    public addXPBonus(value: number) {
        this.stats.xpBonus += value;
        this.dayStats.xpBonus += value;
        this.rangedDayStats.xpBonus += value;
    }

    public get displayName() {
        return this.userData.displayName;
    }
    public get name() {
        return this.userData.name;
    }
    public get isBot() {
        return this.userData.isBot;
    }
    public get joinedTimestamp() {
        return this.userData.joinedTimestamp;
    }
    public get roles() {
        return this.userData.roles || [];
    }
    public get isWeird() {
        return this.userData.isWeird || false;
    }
    public get id() {
        return this.userData.id;
    }
    
    public get bannerTemplateKey() {
        return this.userData.bannerTemplateKey;
    }
    public set bannerTemplateKey(value) {
        this.userData.bannerTemplateKey = value;
    }

    public resetDayWeekStats() {
        this.userData.dayStats = {
            date: 0,
            data: BigBrowserV2UserStats.create(this).stats
        }
        this.userData.weekStats = {
            date: 0,
            data: BigBrowserV2UserStats.create(this).stats
        }
        this.userData.rangedDayStats = {
            date: 0,
            data: BigBrowserV2UserStats.create(this).stats
        }
        this.userData.rangedWeekStats = {
            date: 0,
            data: BigBrowserV2UserStats.create(this).stats
        }
    }

    public toJSON() {
        return undefined;
    }
}

export class BigBrowserV2 {
    public getRosterRanks(guild: Guild, nbRoster = 10, getLast = false) {
        const users = this.getFilteredUsers(guild)
            .filter(user => !user.userData.isBot);

        const extract = (statsMapper: (user: BigBrowserV2User) => BigBrowserV2UserStats) => users
            .map(user => ({
                user: user,
                stats: statsMapper(user)
            }))
            .filter(obj => obj.stats)
            .sort((a, b) => b.stats.xp - a.stats.xp)
            .slice(0, nbRoster);

        const day = getLast ? (user: BigBrowserV2User) => user.rangedDayStats.last : (user: BigBrowserV2User) => user.rangedDayStats;
        const week = getLast ? (user: BigBrowserV2User) => user.rangedWeekStats.last : (user: BigBrowserV2User) => user.rangedWeekStats;
        
        return {
            day: extract(day),
            week: extract(user => BigBrowserV2UserStats.merge(user, week(user), day(user))),
            global: extract(user => user.stats)
        }
    }

    public static readonly ranks: IBigBrowserV2Rangs = (() => {
        const ranks = config.server.ranks;

        let index = -1;
        let lastRank = undefined;
        for(const rankStart in ranks)
        {
            const rank = ranks[rankStart];
            rank.start = rankStart as any as number;
            rank.index = ++index;
    
            if(lastRank)
                lastRank.end = rank.start;
    
            lastRank = rank;
        }

        return ranks;
    })();

    protected servers: IBigBrowserV2Servers;
    
    private _xpMultiplier: number = 1;
    public get xpMultiplier() {
        return this._xpMultiplier;
    }
    public set xpMultiplier(value) {
        this._xpMultiplier = value ?? 1;
    }
    
    private dayRangeDefault = [{
        name: 'Semaine',
        days: [ 0, 1, 2, 3, 4 ],
        start: 18,
        end: 23
    }, {
        name: 'Weekend',
        days: [ 5, 6 ],
        start: 10,
        end: 23
    }];

    private _dayRange = this.dayRangeDefault;
    public get dayRange() {
        return this._dayRange;
    }
    public set dayRange(value) {
        this._dayRange = value ?? this.dayRangeDefault;
    }

    public isInDayRange(dateTime: number = Date.now()) {
        const m = moment(dateTime);
        const day = (m.day() - 1 + 7) % 7;
        const hour = m.hour();

        for(const range of this.dayRange) {
            if(range.days.includes(day)) {
                if(range.start <= range.end) {
                    return range.start <= hour && hour <= range.end;
                } else {
                    return range.start <= hour || hour <= range.end;
                }
            }
        }
        
        return false;
    }

    getServers()
    {
        if(!this.servers)
            this.servers = {};
        
        return this.servers;
    }

    getServer(guild: { id: string, name: string })
    {
        const servers = this.getServers();
        const now = Date.now();

        const serverId = guild.id;

        let server = servers[serverId];
        if(!server)
        {
            server = {
                id: serverId,
                name: guild.name,
                createDate: now,
                users: {}
            };

            servers[serverId] = server;
        }
        
        return server;
    }

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

    getUserRanking(user: IBigBrowserV2User | BigBrowserV2User, server: Guild | IBigBrowserV2Server)
    {
        const users = this.getSortedUsers(server).reverse();
        const len = users.length;

        let index;
        for(index = 0; index < len; ++index)
        {
            if(users[index].id == user.id)
                break;
        }
        
        return {
            index: index,
            total: len
        }
    }

    deleteUser(member)
    {
        const id = member.id;
        const server = this.getServer(member.guild);

        if(!server.users)
            server.users = {};

        delete server.users[id];
    }

    deleteServer(guild: Guild)
    {
        const servers = this.getServers();

        delete servers[guild.id];
    }

    getUserById(guild: { id: string, name: string }, userId: string): BigBrowserV2User {
        const server = this.getServer(guild);
        const user = server.users[userId];

        return user && BigBrowserV2User.get(user);
    }

    getUser(member: GuildMember): BigBrowserV2User {
        const now = Date.now();

        const id = member.id;
        const server = this.getServer(member.guild);

        if(!server.users)
            server.users = {};

        let user = server.users[id];
        if(!user)
        {
            user = {
                id: id,
                createDate: now
            } as any;
            server.users[id] = user;
        }

        const userInst = BigBrowserV2User.get(user);
        
        user.lastUpdate = now;
        user.displayName = member.displayName;
        user.name = member.nickname;

        if((member as any).bot !== undefined)
            user.isBot = (member as any).bot;
        if(member.user && member.user.bot !== undefined)
            user.isBot = member.user.bot;
        
        if(!user.stats) {
            user.stats = BigBrowserV2UserStats.create(userInst).stats;
        }

        if(!user.dayStats) {
            user.dayStats = {
                date: 0,
                data: BigBrowserV2UserStats.create(userInst).stats
            }
        }
        if(!user.weekStats) {
            user.weekStats = {
                date: 0,
                data: BigBrowserV2UserStats.create(userInst).stats
            }
        }
        
        if(!user.rangedDayStats) {
            user.rangedDayStats = {
                date: 0,
                data: BigBrowserV2UserStats.create(userInst).stats
            }
        }
        if(!user.rangedWeekStats) {
            user.rangedWeekStats = {
                date: 0,
                data: BigBrowserV2UserStats.create(userInst).stats
            }
        }

        if(!user.joinedTimestamp)
            user.joinedTimestamp = member.joinedTimestamp;

        if(member.roles)
            user.roles = member.roles.array().map((role) => role.name);

        if(member.roles)
            user.isWeird = member.roles.array().some((role) => role.name === 'EN phase de test' || role.name === 'Tenno') && !user.stats.tvt;

        const zero = (name) => {
            if(user.stats[name] === undefined)
                user.stats[name] = 0;
        }
        
        zero('totalWarframeDiscordTimeMs');
        zero('totalWarframeDiscordTimeMsNot');
        zero('totalWarframeDiscordTimeMsUndefined');

        return BigBrowserV2User.get(user);
    }

    save() {
        return {
            servers: this.getServers(),
            xpMultiplier: this.xpMultiplier,
            dayRange: this.dayRange
        };
    }
    load(obj: any, ctx) {
        this.servers = obj.servers;
        this.xpMultiplier = obj.xpMultiplier;
        this.dayRange = obj.dayRange;
        
        this.cleanupData();
        
        if(obj.servers) {
            console.log(`******* BigBrowserV2 info *******`);
            console.log(`== Servers ==`);
            for(const propName in obj.servers) {
                const server = obj.servers[propName];

                //console.log();
                console.log(`> ${server.name} (${propName}): ${JSON.stringify(server).length} chars / ${Object.keys(server.users).length} users`);
                //console.log(JSON.stringify(server.users[Object.keys(server.users)[0]]));
                
                /*console.log(`===== Users ==`);
                for(const userId in server.users) {
                    const user = server.users[userId];
                    console.log(`= ${user.displayName} (${userId}): ${JSON.stringify(user).length} chars`);
                }*/
            }
            console.log(`**************`);
        }
    }

    cleanupData() {

        const oldP = [
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
        ]

        const newP = [
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
        ]

        const servers = this.getServers();

        for(const serverId in servers) {
            const server = servers[serverId];

            const users = server.users;
            for(const userId in users) {
                const user = users[userId];

                delete (user as any).v1;
                delete (user as any).__debug;
                delete (user as any).___debug;
                delete user.__userInst;

                const clean = (obj) => {
                    if(!obj) {
                        return;
                    }

                    for(let i = 0; i < oldP.length; ++i) {
                        const oldPropName = oldP[i];
                        const newPropName = newP[i];

                        if(obj[oldPropName] !== undefined) {
                            obj[newPropName] = obj[oldPropName];
                            delete obj[oldPropName];
                        }
                    }
                }

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
    }

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

    updateServer(guild: Guild) {
        return new Promise<void>((resolve) => {
            const server = this.getServer(guild);

            const members = guild.members.array();

            for(const userId in server.users) {
                const user = server.users[userId];

                if(members.some(m => m.id === userId)) {
                    delete user.removedDate;
                } else {
                    user.removedDate = Date.now();
                }
            }

            for(const member of members) {
                const now = Date.now();

                /*
                if(member.displayName !== 'Akamelia ♡')
                    return;*/
                const user = this.getUser(member);

                let isInWarframe = undefined;
                if(config.server.info.game && member.user.presence && member.user.presence.game && member.user.presence.game.name) {
                    isInWarframe = member.user.presence.game.name.toLowerCase() === config.server.info.game.processName;
                }

                const updateStats = (stats: BigBrowserV2UserStats, updateData = true) => {
                    if(isInWarframe !== undefined)
                    {
                        if(isInWarframe)
                        {
                            if(!stats.wasWarframeDiscordLastTick)
                            {
                                stats.wasWarframeDiscordLastTick = true;
                            }
                            else
                            {
                                if(updateData) {
                                    stats.totalWarframeDiscordTimeMs += now - stats.lastWarframeDiscordDate;
                                }
                            }
                            
                            stats.lastWarframeDiscordDate = now;
                            stats.wasWarframeDiscordLastTickNot = false;
                        }
                        else
                        {
                            if(!stats.wasWarframeDiscordLastTickNot)
                            {
                                stats.wasWarframeDiscordLastTickNot = true;
                            }
                            else
                            {
                                if(updateData) {
                                    stats.totalWarframeDiscordTimeMsNot += now - stats.lastWarframeDiscordDateNot;
                                }
                            }
                            
                            stats.lastWarframeDiscordDateNot = now;
                            stats.wasWarframeDiscordLastTick = false;
                        }
                        
                        stats.wasWarframeDiscordLastTickUndefined = false;
                    }
                    else
                    {
                        if(!stats.wasWarframeDiscordLastTickUndefined)
                        {
                            stats.wasWarframeDiscordLastTickUndefined = true;
                        }
                        else
                        {
                            if(updateData) {
                                stats.totalWarframeDiscordTimeMsUndefined += now - stats.lastWarframeDiscordDateUndefined;
                            }
                        }
                        
                        stats.lastWarframeDiscordDateUndefined = now;
                        stats.wasWarframeDiscordLastTickNot = false;
                        stats.wasWarframeDiscordLastTick = false;
                    }
                    
                    if(member.voiceChannelID && !member.deaf && member.voiceChannelID !== guild.afkChannelID)
                    {
                        if(!stats.wasVoicingLastTick)
                        {
                            stats.wasVoicingLastTick = true;
                        }
                        else
                        {
                            if(updateData) {
                                stats.totalVoiceTimeMs += now - stats.lastVocalDate;
                            }
                        }
                        
                        stats.lastVocalDate = now;
                    }
                    else
                    {
                        stats.wasVoicingLastTick = false;
                    }
                }

                if(user.dayStats.isObsolete) {
                    user.dayStats.injectInto(user.weekStats);
                    user.dayStats.finalize();
                }
                if(user.weekStats.isObsolete) {
                    user.weekStats.finalize();
                }
                if(user.rangedDayStats.isObsolete) {
                    user.rangedDayStats.injectInto(user.rangedWeekStats);
                    user.rangedDayStats.finalize();
                }
                if(user.rangedWeekStats.isObsolete) {
                    user.rangedWeekStats.finalize();
                }

                updateStats(user.stats);
                updateStats(user.dayStats);
                updateStats(user.rangedDayStats, this.isInDayRange(now));
            }

            process.nextTick(resolve);
        });
    }

    public resetDayWeekStats(guild: Guild) {
        const server = this.getServer(guild);

        for(const userId in server.users) {
            const user = BigBrowserV2User.get(server.users[userId]);
            user.resetDayWeekStats();
        }
    }

    updateUserText(message)
    {
        const content = message.content;

        if(content)
        {
            const member = message.member;

            /*
            if(member.displayName !== 'Akamelia ♡')
                return;*/
            const user = this.getUser(member);
            const now = Date.now();

            const updateData = (stats: BigBrowserV2UserStats, updateData = true) => {
                if(stats.lastTextContent !== content)
                {
                    if(updateData) {
                        ++stats.nbTextMessages;
                        stats.totalTextSize += message.content.length;
                    }
                    stats.lastNotDuplicateTextDate = now;
                }

                if(updateData) {
                    stats.lastTextContent = content;
                    ++stats.nbTextMessagesWithDuplicates;
                    stats.totalTextSizeWithDuplicates += message.content.length;
                }

                stats.lastTextDate = now;
            }

            updateData(user.stats);
            updateData(user.dayStats);
            updateData(user.rangedDayStats, this.isInDayRange(now));
        }
    }

    setTrackingUser(member, isTracking)
    {
        const user = this.getUser(member);

        if(isTracking)
        {
            if(user && user.tracking === false) {
                this.deleteUser(member);
            }
        }
        else
        {
            if(user)
            {
                for(const propName in user) {
                    delete user[propName];
                }
                
                user.tracking = false;
            }
        }
    }

    setTrackingServer(guild: Guild, isTracking)
    {
        const server = this.getServer(guild);

        if(isTracking)
        {
            if(server && server.tracking === false)
                this.deleteServer(guild);
        }
        else
        {
            if(server)
            {
                for(const propName in server)
                    delete server[propName];
                
                server.tracking = false;
            }
        }
    }

    getServersText(servers, withBOM = false) {
        let result = '';
        let isFirst = true;

        for(let server of servers)
        {
            if(!isFirst)
                result += '\r\n';

            isFirst = false;

            if(server.constructor && server.constructor.name === 'Guild')
                server = this.getServer(server);

            if(server.tracking !== false)
            {
                const body = this.getServerText(server);
                const firstLine = body.split(/\r?\n/img, 2)[1];

                let header = '';
                let nbCharsLeft = firstLine.length - (server.name.length + 4) * 3 - 4 * 2;
                for(let i = 0; i < 4; ++i)
                    header += '=';
                header += `[ ${server.name} ]`;
                for(let i = 0; i < nbCharsLeft / 2; ++i)
                    header += '=';
                header += `[ ${server.name} ]`;
                for(let i = 0; i < nbCharsLeft / 2; ++i)
                    header += '=';
                header += `[ ${server.name} ]`;
                for(let i = 0; i < 4; ++i)
                    header += '=';

                let footer = '';
                while(footer.length < firstLine.length)
                    footer += '=';

                result += `${header}\r\n`;
                result += body;
                result += `\r\n${footer}\r\n`;
            }
        }

        return result;
    }

    getServersCSV(servers, withBOM) {
        let result = withBOM ? decodeURIComponent('%EF%BB%BF') : '';
        let isFirst = true;

        for(let server of servers)
        {
            if(!isFirst)
                result += '\r\n\r\n';

            isFirst = false;

            if(server.constructor && server.constructor.name === 'Guild')
                server = this.getServer(server);

            if(server.tracking !== false)
            {
                result += `================================;${server.name}\r\n`;
                result += this.getServerCSV(server, false);
            }
        }

        return result;
    }

    getServersMarkDown(servers) {
        let result = '';
        let isFirst = true;

        for(let server of servers)
        {
            if(!isFirst)
                result += '\r\n\r\n';

            isFirst = false;

            if(server.constructor && server.constructor.name === 'Guild')
                server = this.getServer(server);

            if(server.tracking !== false)
            {
                result += `**${server.name}**\r\n`;
                result += this.getServerMarkDown(server);
            }
        }

        return result;
    }

    getServerCSV(server, withBOM) {
        
        const formatter = {
            SKIP: {},
            row: function(...argss: any[]) {
                argss = argss.filter(a => a !== formatter.SKIP);
                const args = [];
        
                for(const arg of argss)
                {
                    if(arg === undefined || arg === null)
                        args.push('?');
                    else
                        args.push(arg.toString());
                }
                
                return `${args.join(';')}\r\n`;
            },
            noRow: undefined as ((...args: any[]) => string)
        };

        formatter.noRow = formatter.row;

        const text = this.getServerFormatted(server, formatter);

        return (withBOM ? decodeURIComponent('%EF%BB%BF') : '') + text;
    }

    getServerMarkDown(server) {

        let nbCols = undefined;

        const formatter = {
            SKIP: {},
            headerEnd: function() {
                let text = '';

                for(let i = 0; i < nbCols; ++i)
                    text += '|-';

                return `${text}|\r\n`;
            },
            row: function(...argss: any[]) {
                argss = argss.filter(a => a !== formatter.SKIP);
                if(nbCols === undefined)
                    nbCols = argss.length;
                
                const args = [];

                for(const arg of argss)
                {
                    if(arg === undefined || arg === null)
                        args.push('?');
                    else
                        args.push(arg.toString());
                }
                
                return `| ${args.join(' | ')} |\r\n`;
            },
            noRow: function(...argss: any[]) {
                argss = argss.filter(a => a !== formatter.SKIP);
                const args = [];
        
                for(const arg of argss)
                {
                    if(arg === undefined || arg === null)
                        args.push('?');
                    else
                        args.push(arg.toString());
                }
                
                return `| ${args.join(' ')} |\r\n`;
            }
        };

        return this.getServerFormatted(server, formatter);
    }

    getServerText(server) {

        const pad = (value, nb: number = 0, char?: string) => {
            value = value === undefined || value === null ? '' : value.toString();
            
            if(char === undefined)
                char = ' ';

            while(value.length < nb)
                value = `${char}${value}`;

            return value;
        };

        let pads = [
            35, 35,  0,  0, 20,
            20,  0,  0,  0,  0,
            0,  0,  0,  0,  0,
            0,  0,  0,  0,  0,
            0,  0,  0,  0,  0,
            0,  0,  0,  0,  0,
        ];

        let isFirstRow = true;
        
        const formatter = {
            SKIP: {},
            headerEnd: function() {
                let str = '';

                for(const padding of pads)
                {
                    if(padding)
                    {
                        str += pad('', padding + 3, '=');
                    }
                }
                
                return str.substring(0, str.length - 3) + '\r\n';
            },
            row: function(...argss: any[]) {
                argss = argss.filter(a => a !== formatter.SKIP);
                const args = [];
                let index = 0;
        
                for(const arg of argss)
                {
                    if(arg === undefined || arg === null)
                        args.push(pad('?', pads[index]));
                    else
                        args.push(pad(arg.toString(), pads[index]));

                    ++index;
                }

                if(isFirstRow)
                {
                    isFirstRow = false;

                    pads = args.map((str, i) => {
                        const pad = pads[i];
                        if(!pad)
                            return str.length;
                        else
                            return pad;
                    })
                }
                
                return `${args.join(' | ')}\r\n`;
            },
            noRow: function(...argss: any[]) {
                argss = argss.filter(a => a !== formatter.SKIP);
                const args = [];
        
                for(const arg of argss)
                {
                    if(arg === undefined || arg === null)
                        args.push('?');
                    else
                        args.push(arg.toString());
                }
                
                return `${args.join(' ')}\r\n`;
            }
        };

        return this.getServerFormatted(server, formatter);
    }

    public getFilteredUsers(_server: Guild | IBigBrowserV2Server) {
        if(_server.constructor && _server.constructor.name === 'Guild')
            _server = this.getServer(_server);

        const server = _server as IBigBrowserV2Server;

        const users = Object.keys(server.users)
            .map(id => server.users[id])
            .filter(user => !user.removedDate)
            .filter(user => user.tracking !== false)
            .map(user => BigBrowserV2User.get(user));

        return users;
    }

    getSortedUsers(_server: Guild | IBigBrowserV2Server) {
        if(_server.constructor && _server.constructor.name === 'Guild')
            _server = this.getServer(_server);

        const server = _server as IBigBrowserV2Server;

        const users = Object.keys(server.users)
            .map(id => server.users[id])
            .filter(user => !user.removedDate)
            .filter(user => user.tracking !== false)
            .map(user => BigBrowserV2User.get(user))
            .sort((u1, u2) => {
                const u1exp = u1.stats.xp;
                const u2exp = u2.stats.xp;
                
                return u1exp > u2exp ? 1 : u1exp === u2exp ? 0 : -1;
            });

        return users;
    }

    getServerFormatted(server: Guild | IBigBrowserV2Server, formatter) {
        let text = '';
        
        formatter.asDate = formatter.asDate || ((date, includeTime) => {
            let dateString;
            let dateObj = moment(date).tz('Europe/Paris');

            if(includeTime === false)
                dateString = dateObj.format('DD/MM/YYYY');
            else
                dateString = dateObj.format('DD/MM/YYYY HH:mm');

            return dateString;
        });

        formatter.asPercent = formatter.asPercent || ((value) => {
            value = value || 0;
            return (value * 100).toString();
        });
        
        formatter.asInteger = formatter.asInteger || ((value) => {
            value = value || 0;
            value = Math.floor(value);
            return value.toString();
        });
        
        formatter.asSeconds = formatter.asSeconds || ((value) => {
            return formatter.asInteger((value || 0) / 1000).toString();
        });

        formatter.asFloat = formatter.asFloat || ((value) => {
            value = value || 0;
            return value.toString();
        });

        formatter.asBool = formatter.asBool || ((value) => {
            return value ? '1' : '0';
        });

        formatter.asString = formatter.asString || ((value) => {
            return value !== undefined && value !== null ? value.toString() : ''
        });

        const users = this.getSortedUsers(server);

        if(formatter.onStart)
            formatter.onStart(users);

        if(users.length === 0)
        {
            text = formatter.noRow();
        }
        else
        {
            if(formatter.headerStart)
                text += formatter.headerStart();

            text += formatter.row(
                formatter.asString('Utilisateur (nom affiché)'),
                formatter.asString('Utilisateur (compte)'),
                formatter.asString('Est un bot ?'),

                formatter.asString('Expérience totale (exp)'),
                formatter.asString('Rang'),
                formatter.asString('Prochain rang'),
                formatter.asString('Progression vers le prochain rang (%)'),
                formatter.asString('Expérience restante avant prochain rang (exp)'),
                formatter.asString('Expérience restante avant prochain rang (%)'),

                formatter.asString('Expérience vocale (exp)'),
                formatter.asString('Temps total en vocal (sec)'),
                formatter.asString('Dernière mise à jour exp vocale'),

                formatter.asString('Expérience écrite (exp)'),
                formatter.asString('Dernière mise à jour exp écrite'),

                formatter.asString('Nb messages textes'),
                formatter.asString('Taille totale des messages textes'),
                formatter.asString('Nb messages textes (avec duplicatas)'),
                formatter.asString('Taille totale des messages textes (avec duplicatas)'),
                
                config.server.info.game ? formatter.asString(`Temps total sur ${config.server.info.game.name} (%)`) : formatter.SKIP,

                config.server.info.game ? formatter.asString(`Temps total sur ${config.server.info.game.name} (sec)`) : formatter.SKIP,
                config.server.info.game ? formatter.asString(`Dernière connection à ${config.server.info.game.name}`) : formatter.SKIP,

                config.server.info.game ? formatter.asString(`Temps total sur autre chose que ${config.server.info.game.name} (sec)`) : formatter.SKIP,
                config.server.info.game ? formatter.asString(`Dernier jeu autre que ${config.server.info.game.name}`) : formatter.SKIP,

                config.server.info.game ? formatter.asString('Temps total sur aucune application (sec)') : formatter.SKIP,
                config.server.info.game ? formatter.asString('Dernière connection à aucune application') : formatter.SKIP,

                formatter.asString('Date de join'),
                formatter.asString('Roles'),

                formatter.asString('Inactif ?')
            );

            if(formatter.headerEnd)
                text += formatter.headerEnd();
            
            if(formatter.bodyStart)
                text += formatter.bodyStart();

            for(const user of users)
            {
                const exp = user.stats.xp;
                const rank = user.stats.rank;

                text += formatter.row(
                    formatter.asString(user.displayName),
                    formatter.asString(user.name),
                    formatter.asBool(user.isBot),

                    formatter.asFloat(exp),
                    formatter.asString(rank.currentRank ? rank.currentRank.name : undefined),
                    formatter.asString(rank.nextRank ? rank.nextRank.name : undefined),
                    formatter.asPercent(rank.currentExpPercentToNextRank),
                    formatter.asFloat(rank.expLeftToNextRank),
                    formatter.asPercent(rank.expLeftToNextRankPercent),

                    formatter.asFloat(user.stats.voiceXp),
                    formatter.asSeconds(user.stats.totalVoiceTimeMs),
                    formatter.asDate(user.stats.lastVocalDate),

                    formatter.asFloat(user.stats.textXp),
                    formatter.asDate(user.stats.lastTextDate),

                    formatter.asInteger(user.stats.nbTextMessages),
                    formatter.asInteger(user.stats.totalTextSize),
                    formatter.asInteger(user.stats.nbTextMessagesWithDuplicates),
                    formatter.asInteger(user.stats.totalTextSizeWithDuplicates),

                    config.server.info.game ? (
                        !user.stats.lastWarframeDiscordDate && !user.stats.lastWarframeDiscordDateNot
                            ? formatter.asString('N/A')
                            : formatter.asPercent(user.stats.totalWarframeDiscordTimeMs / (user.stats.totalWarframeDiscordTimeMs + user.stats.totalWarframeDiscordTimeMsNot + user.stats.totalWarframeDiscordTimeMsUndefined))
                    ) : formatter.SKIP,

                    config.server.info.game ? formatter.asSeconds(user.stats.totalWarframeDiscordTimeMs) : formatter.SKIP,
                    config.server.info.game ? formatter.asDate(user.stats.lastWarframeDiscordDate) : formatter.SKIP,

                    config.server.info.game ? formatter.asSeconds(user.stats.totalWarframeDiscordTimeMsNot) : formatter.SKIP,
                    config.server.info.game ? formatter.asDate(user.stats.lastWarframeDiscordDateNot) : formatter.SKIP,

                    config.server.info.game ? formatter.asSeconds(user.stats.totalWarframeDiscordTimeMsUndefined) : formatter.SKIP,
                    config.server.info.game ? formatter.asDate(user.stats.lastWarframeDiscordDateUndefined) : formatter.SKIP,

                    formatter.asDate(user.joinedTimestamp),
                    formatter.asString((user.roles || []).join(' / ')),

                    formatter.asBool(user.isWeird || false)
                );
            }

            if(formatter.bodyEnd)
                text += formatter.bodyEnd();
        }

        return (text as any).trimRight();
    }
}
