const Message = require('./Message');
const Eidelon = require('./Eidelon');
const Twitch = require('./Twitch');
const Server = require('./Server');

function Application(bot, options)
{
    if(!options)
        options = {};
    if(!options.updatePeriodMs)
        options.updatePeriodMs = 15000;

    this.options = options;

    this.currentTwitchIndex = 0;
    this.twitches = [];
    this.eidelon = new Eidelon();
    this.servers = [];
    this.bot = bot;
}
Application.prototype.toJSON = function() {
    return {
        options: this.options,
        currentTwitchIndex: this.currentTwitchIndex,
        twitches: this.twitches,
        eidelon: this.eidelon,
        servers: this.servers
    }
}
Application.prototype.save = function() {
    return {
        servers: this.servers.map(server => server.save()),
        twitches: this.twitches.map(server => server.save())
    };
}
Application.prototype.load = function(obj, ctx) {
    if(obj.servers)
    {
        this.servers = obj.servers.map(serverObj => {
            const server = new Server(this, this.eidelon);
            server.load(serverObj, ctx);
            return server;
        });
    }

    if(obj.twitches)
    {
        this.twitches = obj.twitches.map(twitchObj => {
            const twitch = new Twitch();
            twitch.load(twitchObj, ctx);
            return twitch;
        });
    }
}
Application.prototype.addServerChannel = function(channel) {
    for(const server of this.servers)
    {
        if(server.getGuild().id === channel.guild.id)
        {
            server.setChannel(channel);
            server.update();
            return;
        }
    }

    const newServer = new Server(this, this.eidelon);
    newServer.setChannel(channel);
    this.servers.push(newServer);
    newServer.update();
}
Application.prototype.updateEidelon = function(callback) {
    if(this.servers.length === 0)
    {
        if(callback)
            callback();
        return;
    }

    this.eidelon.getInformation(eidelonInfo => {
        for(const server of this.servers)
            server.update(eidelonInfo);

        if(callback)
            callback();
    })
}
Application.prototype.updateTwitches = function(callback) {
    if(this.twitches.length > 0)
    {
        const twitch = this.twitches[this.currentTwitchIndex];
        this.currentTwitchIndex = (this.currentTwitchIndex + 1) % this.twitches.length;

        if(twitch)
            twitch.update();
    }

    if(callback)
        callback();
}
Application.twitchMatcher = function(streamer, channel) {
    return twitch => {
        const twitchChannel = twitch.getChannel();
        return twitch.streamer === streamer && (!channel || twitchChannel.id === channel.id && twitchChannel.guild.id === channel.guild.id);
    };
}
Application.prototype.addTwitch = function(streamer, channel, messageToReplace) {
    const matchingTwitches = this.twitches.filter(Application.twitchMatcher(streamer, channel));

    if(matchingTwitches.length === 0)
    {
        const twitch = new Twitch(streamer, channel, messageToReplace);
        this.twitches.push(twitch);
        return {
            twitch: twitch,
            created: true
        };
    }
    else
    {
        Message.deleteMessage(messageToReplace);
        return {
            twitch: matchingTwitches[0],
            created: false
        };
    }
}
Application.prototype.removeTwitch = function(streamer, channel) {
    const matchingTwitches = this.twitches.filter(Application.twitchMatcher(streamer, channel));
    const found = matchingTwitches.length > 0;

    if(found)
    {
        this.twitches = this.twitches.filter(twitch => !Application.twitchMatcher(streamer, channel)(twitch));
        return matchingTwitches[0];
    }
    else
    {
        return false;
    }
}
Application.prototype.update = function(callback) {
    this.updateEidelon(() => {
        this.updateTwitches(callback);
    })
}
Application.prototype.start = function(force) {
    if(!this.interval || force)
    {
        this.stop();
        
        this.interval = setInterval(() => {
            this.update();
        }, this.options.updatePeriodMs);

        this.update();
    }
}
Application.prototype.stop = function() {
    if(this.interval)
    {
        clearInterval(this.interval);
        this.interval = undefined;
    }
}

module.exports = Application;
