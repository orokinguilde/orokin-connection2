const moment = require('moment-timezone');

function BigBrowserV2()
{ }

BigBrowserV2.prototype.getServers = function()
{
    if(!this.servers)
        this.servers = {};
    
    return this.servers;
}

BigBrowserV2.prototype.getServer = function(guild)
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

BigBrowserV2.prototype.getUserVoiceExp = function(user)
{
    const score30minutes = user.stats.totalVoiceTimeMs / (1000 * 60 * 30);
    return score30minutes;
}

BigBrowserV2.prototype.getUserTextExp = function(user)
{
    const score500chars = user.stats.totalTextSize / 500;
    return score500chars;
}

BigBrowserV2.prototype.getUserExp = function(user)
{
    const voiceScore = this.getUserVoiceExp(user);
    const textScore = this.getUserTextExp(user);

    return voiceScore + textScore;
}

BigBrowserV2.prototype.getUserRanking = function(user, server)
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

BigBrowserV2.prototype.ranks = {
    0: {
        name: 'Chair à canon'
    },
    50: {
        name: 'Galinette cendrée'
    },
    100: {
        name: 'Rejeté'
    },
    150: {
        name: 'Bouclier humain'
    },
    200: {
        name: 'Noob'
    },
    250: {
        name: 'Mauvaise herbe'
    },
    300: {
        name: 'Jeune pousse écrasée'
    },
    350: {
        name: 'Poussin KFC'
    },
    400: {
        name: 'Pion du neant'
    },
    450: {
        name: 'Vagabon'
    },
    500: {
        name: 'Tenno'
    },
    550: {
        name: 'Portier de Lua'
    },
    600: {
        name: 'Apprenti samurai'
    },
    650: {
        name: 'Samurai'
    },
    700: {
        name: 'Rōnin'
    },
    750: {
        name: 'Acharné'
    },
    800: {
        name: 'Fanatique'
    },
    850: {
        name: 'Dur à cuire'
    },
    900: {
        name: 'Orokin apprenti'
    },
    950: {
        name: 'Orokin'
    },
    1000: {
        name: 'Orokin officier'
    },
    1050: {
        name: 'Orokin general'
    },
    1100: {
        name: 'Orokin etat major'
    },
    1150: {
        name: 'Orokin marechal'
    },
    1200: {
        name: 'Vaulted'
    }
};

let index = -1;
let lastRank = undefined;
for(const rankStart in BigBrowserV2.prototype.ranks)
{
    const rank = BigBrowserV2.prototype.ranks[rankStart];
    rank.start = rankStart;
    rank.index = ++index;

    if(lastRank)
        lastRank.end = rank.start;

    lastRank = rank;
}

BigBrowserV2.prototype.getUserRank = function(user, exp)
{
    if(exp === undefined)
        exp = this.getUserExp(user);

    const ranks = this.ranks;

    let lastMatchingRank = ranks[0];
    let nextRank = undefined;
    for(const rankStart in ranks)
    {
        const rank = ranks[rankStart];

        if(exp >= rankStart)
        {
            lastMatchingRank = rank;
        }
        else if(!nextRank)
        {
            nextRank = ranks[rankStart];
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

BigBrowserV2.prototype.deleteUser = function(member)
{
    const id = member.id;
    const server = this.getServer(member.guild);

    if(!server.users)
        server.users = {};

    delete server.users[id];
}

BigBrowserV2.prototype.deleteServer = function(guild)
{
    const servers = this.getServers();

    delete servers[guild.id];
}

BigBrowserV2.prototype.getUser = function(member)
{
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
        };
        server.users[id] = user;
    }
    
    user.lastUpdate = now;
    user.displayName = member.displayName;
    user.name = member.nickname;

    if(member.bot !== undefined)
        user.isBot = member.bot;
    if(member.user && member.user.bot !== undefined)
        user.isBot = member.user.bot;
    
    if(!user.stats)
    {
        user.stats = {
            lastVocalDate: undefined,
            totalVoiceTimeMs: 0,
            nbTextMessages: 0,
            nbTextMessagesWithDuplicates: 0,
            totalTextSize: 0,
            totalTextSizeWithDuplicates: 0,
            lastTextContent: undefined,
            lastTextDate: undefined,
            lastNotDuplicateTextDate: undefined,
            wasVoicingLastTick: false
        };
    }

    if(!user.joinedTimestamp)
        user.joinedTimestamp = member.joinedTimestamp;

    if(member.roles)
        user.roles = member.roles.array().map((role) => role.name);

    if(member.roles)
        user.isWeird = member.roles.array().some((role) => role.name === 'EN phase de test' || role.name === 'Tenno') && !user.stats.totalVoiceTimeMs;

    const zero = (name) => {
        if(user.stats[name] === undefined)
            user.stats[name] = 0;
    }
    
    zero('totalWarframeDiscordTimeMs');
    zero('totalWarframeDiscordTimeMsNot');
    zero('totalWarframeDiscordTimeMsUndefined');

    return user;
}

BigBrowserV2.prototype.save = function()
{
    return this.getServers();
}
BigBrowserV2.prototype.load = function(obj, ctx) {
    this.servers = obj.servers;
}

BigBrowserV2.prototype.initWithV1Data = function(servers)
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

                const user = {
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
                };

                user.stats = JSON.parse(JSON.stringify(user.v1));
                user.v1.oldServerId = serverId;
                user.v1.oldUser = oldUser;

                server.users[userId] = user;
            }
        }
    }
}

BigBrowserV2.prototype.updateServer = function(guild)
{
    const now = Date.now();

    const server = this.getServer(guild);

    let nbUsers = server.users.length + 1;
    const onDone = () => {
        --nbUsers;

        if(nbUsers === 0)
        {
            this.save();
        }
    }

    for(const userId in server.users)
    {
        const user = server.users[userId];

        if(!user.removedDate)
        {
            guild.fetchMember(userId).then(() => {
                onDone();
            }).catch(() => {
                user.removedDate = Date.now();

                onDone();
            })
        }
    }

    guild.members.forEach((member) => {

        /*
        if(member.displayName !== 'Akamelia ♡')
            return;*/
        const user = this.getUser(member);

        let isInWarframe = undefined;
        if(member.user.presence && member.user.presence.game && member.user.presence.game.name)
            isInWarframe = member.user.presence.game.name.toLowerCase() === 'warframe';

        if(isInWarframe !== undefined)
        {
            if(isInWarframe)
            {
                if(!user.stats.wasWarframeDiscordLastTick)
                {
                    user.stats.wasWarframeDiscordLastTick = true;
                }
                else
                {
                    user.stats.totalWarframeDiscordTimeMs += now - user.stats.lastWarframeDiscordDate;
                }
                
                user.stats.lastWarframeDiscordDate = now;
                user.stats.wasWarframeDiscordLastTickNot = false;
            }
            else
            {
                if(!user.stats.wasWarframeDiscordLastTickNot)
                {
                    user.stats.wasWarframeDiscordLastTickNot = true;
                }
                else
                {
                    user.stats.totalWarframeDiscordTimeMsNot += now - user.stats.lastWarframeDiscordDateNot;
                }
                
                user.stats.lastWarframeDiscordDateNot = now;
                user.stats.wasWarframeDiscordLastTick = false;
            }
            
            user.stats.wasWarframeDiscordLastTickUndefined = false;
        }
        else
        {
            if(!user.stats.wasWarframeDiscordLastTickUndefined)
            {
                user.stats.wasWarframeDiscordLastTickUndefined = true;
            }
            else
            {
                user.stats.totalWarframeDiscordTimeMsUndefined += now - user.stats.lastWarframeDiscordDateUndefined;
            }
            
            user.stats.lastWarframeDiscordDateUndefined = now;
            user.stats.wasWarframeDiscordLastTickNot = false;
            user.stats.wasWarframeDiscordLastTick = false;
        }
        
        if(member.voiceChannelID && !member.deaf && member.voiceChannelID !== guild.afkChannelID)
        {
            if(!user.stats.wasVoicingLastTick)
            {
                user.stats.wasVoicingLastTick = true;
            }
            else
            {
                user.stats.totalVoiceTimeMs += now - user.stats.lastVocalDate;
            }
            
            user.stats.lastVocalDate = now;
        }
        else
        {
            user.stats.wasVoicingLastTick = false;
        }
    })

    onDone();
}

BigBrowserV2.prototype.updateUserText = function(message)
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

        if(user.stats.lastTextContent !== content)
        {
            ++user.stats.nbTextMessages;
            user.stats.totalTextSize += message.content.length;
            user.stats.lastNotDuplicateTextDate = now;
        }

        user.stats.lastTextContent = content;
        ++user.stats.nbTextMessagesWithDuplicates;
        user.stats.totalTextSizeWithDuplicates += message.content.length;
        user.stats.lastTextDate = now;
    }
}

BigBrowserV2.prototype.setTrackingUser = function(member, isTracking)
{
    const user = this.getUser(member);

    if(isTracking)
    {
        if(user && user.tracking === false)
            this.deleteUser(member);
    }
    else
    {
        if(user)
        {
            for(const propName in user)
                delete user[propName];
            
            user.tracking = false;
        }
    }
}

BigBrowserV2.prototype.setTrackingServer = function(guild, isTracking)
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

BigBrowserV2.prototype.getServersText = function(servers, withBOM) {
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

BigBrowserV2.prototype.getServersCSV = function(servers, withBOM) {
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

BigBrowserV2.prototype.getServersMarkDown = function(servers) {
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

BigBrowserV2.prototype.getServerCSV = function(server, withBOM) {
    
    const formatter = {
        row: function(/* arguments... */) {
            const args = [];
    
            for(const arg of arguments)
            {
                if(arg === undefined || arg === null)
                    args.push('?');
                else
                    args.push(arg.toString());
            }
            
            return `${args.join(';')}\r\n`;
        }
    };

    formatter.noRow = formatter.row;

    const text = this.getServerFormatted(server, formatter);

    return (withBOM ? decodeURIComponent('%EF%BB%BF') : '') + text;
}

BigBrowserV2.prototype.getServerMarkDown = function(server) {

    let nbCols = undefined;

    const formatter = {
        headerEnd: function() {
            let text = '';

            for(let i = 0; i < nbCols; ++i)
                text += '|-';

            return `${text}|\r\n`;
        },
        row: function(/* arguments... */) {
            if(nbCols === undefined)
                nbCols = arguments.length;
            
            const args = [];

            for(const arg of arguments)
            {
                if(arg === undefined || arg === null)
                    args.push('?');
                else
                    args.push(arg.toString());
            }
            
            return `| ${args.join(' | ')} |\r\n`;
        },
        noRow: function(/* arguments... */) {
            const args = [];
    
            for(const arg of arguments)
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

BigBrowserV2.prototype.getServerText = function(server) {

    const pad = (value, nb, char) => {
        value = value === undefined || value === null ? '' : value.toString();
        nb = nb || 0;
        
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
        row: function(/* arguments... */) {
            const args = [];
            let index = 0;
    
            for(const arg of arguments)
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
        noRow: function(/* arguments... */) {
            const args = [];
    
            for(const arg of arguments)
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

BigBrowserV2.prototype.getSortedUsers = function(server) {
    if(server.constructor && server.constructor.name === 'Guild')
        server = this.getServer(server);

    const users = Object.keys(server.users)
        .map(id => server.users[id])
        .filter(user => !user.removedDate)
        .filter(user => user.tracking !== false)
        .sort((u1, u2) => {
            const u1exp = this.getUserExp(u1);
            const u2exp = this.getUserExp(u2);
            
            return u1exp > u2exp ? 1 : u1exp === u2exp ? 0 : -1;
        });

    return users;
}

BigBrowserV2.prototype.getServerFormatted = function(server, formatter) {
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
        value = Math.trunc(value);
        return value.toString();
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
            formatter.asString('Temps total en vocal (ms)'),
            formatter.asString('Dernière mise à jour exp vocale'),

            formatter.asString('Expérience écrite (exp)'),
            formatter.asString('Dernière mise à jour exp écrite'),

            formatter.asString('Nb messages textes'),
            formatter.asString('Taille totale des messages textes'),
            formatter.asString('Nb messages textes (avec duplicatas)'),
            formatter.asString('Taille totale des messages textes (avec duplicatas)'),
            
            formatter.asString('Temps total sur Warframe (%)'),

            formatter.asString('Temps total sur Warframe (ms)'),
            formatter.asString('Dernière connection à Warframe'),

            formatter.asString('Temps total sur autre chose que Warframe (ms)'),
            formatter.asString('Dernier jeu autre que Warframe'),

            formatter.asString('Temps total sur aucune application (ms)'),
            formatter.asString('Dernière connection à aucune application'),

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
            const exp = this.getUserExp(user);
            const rank = this.getUserRank(user, exp);

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

                formatter.asFloat(this.getUserVoiceExp(user)),
                formatter.asInteger(user.stats.totalVoiceTimeMs),
                formatter.asDate(user.stats.lastVocalDate),

                formatter.asFloat(this.getUserTextExp(user)),
                formatter.asDate(user.stats.lastTextDate),

                formatter.asInteger(user.stats.nbTextMessages),
                formatter.asInteger(user.stats.totalTextSize),
                formatter.asInteger(user.stats.nbTextMessagesWithDuplicates),
                formatter.asInteger(user.stats.totalTextSizeWithDuplicates),

                !user.stats.lastWarframeDiscordDate && !user.stats.lastWarframeDiscordDateNot
                    ? formatter.asString('N/A')
                    : formatter.asPercent(user.stats.totalWarframeDiscordTimeMs / (user.stats.totalWarframeDiscordTimeMs + user.stats.totalWarframeDiscordTimeMsNot + user.stats.totalWarframeDiscordTimeMsUndefined)),

                formatter.asInteger(user.stats.totalWarframeDiscordTimeMs),
                formatter.asDate(user.stats.lastWarframeDiscordDate),

                formatter.asInteger(user.stats.totalWarframeDiscordTimeMsNot),
                formatter.asDate(user.stats.lastWarframeDiscordDateNot),

                formatter.asInteger(user.stats.totalWarframeDiscordTimeMsUndefined),
                formatter.asDate(user.stats.lastWarframeDiscordDateUndefined),

                formatter.asDate(user.joinedTimestamp),
                formatter.asString((user.roles || []).join(' / ')),

                formatter.asBool(user.isWeird || false)
            );
        }

        if(formatter.bodyEnd)
            text += formatter.bodyEnd();
    }

    return text.trimRight();
}

module.exports = BigBrowserV2;
