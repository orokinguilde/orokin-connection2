const ExecutionPool = require('./ExecutionPool');
const Discord = require('discord.js');
const Message = require('./Message');
const moment = require('moment');

function Server(application, eidelon)
{
    this.application = application;
    this.eidelon = eidelon;

    this.messageManager = Message.createUniqueServerWideMessage();
}
Server.prototype.save = function() {
    return {
        messageManager: this.messageManager.save(),
        warnForEidolonsTimeout: this.warnForEidolonsTimeout,
        warnForEidolonsMessage: this.warnForEidolonsMessage ? this.warnForEidolonsMessage.id : undefined
    };
}
Server.prototype.load = function(obj, ctx) {
    this.messageManager.load(obj.messageManager, ctx);

    if(obj.warnForEidolonsTimeout)
    {
        this.warnForEidolonsTimeout = obj.warnForEidolonsTimeout;
        
        const pool = new ExecutionPool();
        for(const channel of this.messageManager.channels)
        {
            pool.add((next) => {
                channel.fetchMessages().then(() => {
                    const found = findById(channel.messages, obj.warnForEidolonsMessage);
                    if(found)
                        this.warnForEidolonsMessage = found;
                    else
                        next();
                })
            })
        }
    }
}
Server.warnForEidolonsTimeoutMs = 1000 * 60 * 15;
Server.prototype.setWarnForEidolonsMessage = function(msg) {
    if(this.warnForEidolonsMessage)
    {
        this.warnForEidolonsMessage.delete();
        this.warnForEidolonsTimeout = undefined;
    }
    
    if(msg)
    {
        this.warnForEidolonsMessage = msg;
        this.warnForEidolonsTimeout = Date.now() + Server.warnForEidolonsTimeoutMs;
    }
}
Server.prototype.warnForEidolons = function(info, force) {
    if(!info.isDay || this.application.bot.stops.eidolonsWarning[this.messageManager.getGuild().id])
        return;

    if(this.warnForEidolonsTimeout && this.warnForEidolonsTimeout < Date.now())
    {
        this.setWarnForEidolonsMessage(undefined); // Supprime l'ancien message
    }
    
    if((force || Math.trunc(this.expirationDate / 10000) !== Math.trunc(info.expirationDate / 10000)) && info.timeLeft.totalMs <= 600000)
    {
        this.expirationDate = info.expirationDate;

        const channelGeneral = Bot.findGeneralChannel(this.messageManager.getGuild().channels);
        
        if(channelGeneral)
        {
            var role = channelGeneral.guild.roles.filter(role => role.name === 'Trio Team').array()[0];
            channelGeneral.send(`Les Eidolons arrivent dans quelques minutes! Préparez-vous! ${role ? role : '' }`).then(m => {
                this.setWarnForEidolonsMessage(m);
            });
        }
    }
}
Server.prototype.getMessage = function(channel) {
    return this.messageManager.getMessage(channel);
}
Server.prototype.setChannel = function(channel) {
    this.messageManager.getMessage(channel);
}
Server.prototype.getChannel = function() {
    return this.messageManager.getChannel();
}
Server.prototype.getGuild = function() {
    return this.messageManager.getGuild();
}
Server.prototype.update = function(eidelonInfo) {
    this.updateEidelon(eidelonInfo);
}
Server.prototype.updateEidelon = function(info) {

    if(info)
    {
        this.warnForEidolons(info);

        const message = this.eidelon.createMessageFromInformation(info);

        const embed = this.getMessage();
        const options = {
            isDay: info.isDay,
            img: message.img,
            content: message.content
        }
        const content = new Discord.RichEmbed()
            .setTitle("[**__trio🌙 eidelon__ **]")
            .setColor(15844367)
            .setThumbnail(options.img)
            .setFooter(`Actualisé à ${moment(new Date()).add(2, 'hour').format('LT')}`, 'https://cdn.discordapp.com/attachments/437388704072466433/458396183237361665/nouvelle_vue_sur_lembleme_final_1.png')
            .setImage(options.isDay ? 'https://media.discordapp.net/attachments/473609056163201024/476216651281596420/sun_PNG13422.png' : 'https://media.discordapp.net/attachments/437388704072466433/475991088813965312/Sans_titre-12.png?width=759&height=702')
            .setDescription(options.content);
        embed.update(content);
    }
    else
    {
        this.eidelon.getInformation(info => {
            if(!info)
                return console.log('COULD NOT GET THE INFO OF EIDELON');
            
            this.updateEidelon(info);
        });
    }
}

module.exports = Server;