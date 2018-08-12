const Message = require('./Message');
const request = require('request');

function Twitch(streamer, channel, originalMessage)
{
    this.streamer = streamer;
    this.message = new Message(channel, originalMessage);
}
Twitch.prototype.getChannel = function() {
    return this.message.channel;
}
Twitch.getCurrentInformation = function(streamer, callback) {
    request({
        url: 'https://api.twitch.tv/kraken/streams/' + streamer,
        headers: {
            'Client-ID': '3zzmx0l2ph50anf78iefr6su9d8byj8',
            'Accept': 'application/json'
        }
    }, (e, res, body) => {
        const stream = JSON.parse(body.toString()).stream;
        const result = {
            isStreaming: !!stream
        };

        if(result.isStreaming)
        {
            result.startDate = stream.created_at;
            result.title = stream.channel.status;
            result.game = stream.game;
        }

        callback(result);
    });
}
Twitch.prototype.getURL = function() {
    return `https://www.twitch.tv/${this.streamer}`;
}
Twitch.prototype.save = function() {
    return {
        streamer: this.streamer,
        message: this.message.save()
    };
}
Twitch.prototype.load = function(obj, ctx) {
    this.streamer = obj.streamer;
    this.message.load(obj.message, ctx);
}
Twitch.prototype.getCurrentInformation = function(callback) {
    Twitch.getCurrentInformation(this.streamer, callback);
}
Twitch.prototype.isLive = function(callback) {
    Twitch.getCurrentInformation(this.streamer, (info) => {
        callback(info.isStreaming);
    });
}
Twitch.prototype.delete = function() {
    this.message.delete();
}
Twitch.prototype.notify = function(info) {
    if(info)
    {
        const channel = this.message.channel;
        if(channel)
        {
            if(info.isStreaming)
                channel.send(`:small_blue_diamond: @everyone, \`${this.streamer}\` est en live. ${this.getURL()}`);
            else
                channel.send(`:small_orange_diamond: \`${this.streamer}\` n'est pas en live. ${this.getURL()}`);
        }
        else
            console.log('Pas de channel défini pour Twitch');
    }
    else
    {
        this.getCurrentInformation(info => this.notify(info));
    }
}
Twitch.prototype.update = function(callback) {
    this.getCurrentInformation(info => {
        if(info)
        {
            if(info.isStreaming && (!this.lastInformation || info.startDate !== this.lastInformation.startDate))
            {
                //this.notify(info);
            }

            let msg;
            if(info.isStreaming)
                msg = `:small_blue_diamond: \`${this.streamer}\` est en live. ${this.getURL()}`;
            else
                msg = `:small_orange_diamond: \`${this.streamer}\` n'est pas en live. ${this.getURL()}`;
            this.message.update(msg);

            this.lastInformation = info;
        }

        if(callback)
            callback(this.lastInformation);
    })
}

module.exports = Twitch;
