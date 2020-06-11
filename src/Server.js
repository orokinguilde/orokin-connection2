const Discord = require('discord.js');
const Message = require('./Message');
const globals = require('./globals');
const moment = require('moment-timezone');

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

    if(obj.warnForEidolonsTimeout && obj.warnForEidolonsMessage)
    {
        this.warnForEidolonsTimeout = obj.warnForEidolonsTimeout;
        
        const { IBot } = require('./Bot');
        const channelGeneral = IBot.findGeneralChannel(this.messageManager.getGuild().channels);
        channelGeneral.fetchMessage(obj.warnForEidolonsMessage).then((msg) => {
            if(msg)
                this.warnForEidolonsMessage = msg;
        }).catch(() => {
            console.log('NOT FOUND');
        });
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
Server.findTrioTeamRole = function(guild) {
    return guild.roles.find(role => role.name.toLowerCase().indexOf('trio') >= 0 && role.name.toLowerCase().indexOf('team') >= 0);
}
Server.prototype.warnForEidolons = function(info, force) {
    if(!info.isDay || this.application.bot.stops.eidolonsWarning[this.messageManager.getGuild().id] || this.application.bot.debug)
        return;

    if(this.warnForEidolonsTimeout && this.warnForEidolonsTimeout < Date.now())
    {
        this.setWarnForEidolonsMessage(undefined); // Supprime l'ancien message
    }
    
    if((force || Math.trunc(this.expirationDate / 10000) !== Math.trunc(info.expirationDate / 10000)) && info.timeLeft.totalMs <= 600000)
    {
        this.expirationDate = info.expirationDate;

        const { IBot } = require('./Bot');
        const channelGeneral = IBot.findGeneralChannel(this.messageManager.getGuild().channels);
        
        if(channelGeneral)
        {
            const role = Server.findTrioTeamRole(channelGeneral.guild);
            channelGeneral.send(`${globals.iconBefore()}Les Eidolons arrivent dans quelques minutes ! Préparez-vous ! ${role ? role : '' } (${moment(this.expirationDate).tz('Europe/Paris').format('LTS')})${globals.iconAfter()}`).then(m => {
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
            .setFooter(`Actualisé à ${moment(new Date()).tz('Europe/Paris').format('LT')}`, 'https://cdn.discordapp.com/attachments/437388704072466433/458396183237361665/nouvelle_vue_sur_lembleme_final_1.png')
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
