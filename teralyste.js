
const Discord = require('discord.js');
const request = require('request');
const moment = require('moment');
const fs = require('fs');

moment.locale('fr');

function pad(value)
{
    value = value.toString();
    while(value.length < 2)
        value = '0' + value;
    return value;
}

function findById(collection, id)
{
    return collection.filter(item => item.id === id).first();
}

function Twitch(streamer, channel, originalMessage)
{
    this.streamer = streamer;
    this.message = new Message(channel, originalMessage);
}
Twitch.getCurrentInformation = function(streamer, callback) {
    request({
        url: 'https://api.twitch.tv/kraken/streams/' + streamer,
        headers: {
            'Client-ID': '3zzmx0l2ph50anf78iefr6su9d8byj8',
            'Accept': 'application/json'
        }
    }, (e, res, body) => {
        console.log(JSON.parse(body.toString()));
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
    return Twitch.getCurrentInformation(this.streamer, callback);
}
Twitch.prototype.notify = function(info) {
    if(info)
    {
        const channel = this.message.channel;
        if(channel)
        {
            if(info.isStreaming)
                channel.send(`:small_blue_diamond: @everyone, ${this.streamer} est en live. ${this.getURL()}`);
            else
                channel.send(`:small_orange_diamond: ${this.streamer} n'est pas en live. ${this.getURL()}`);
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
                msg = `:small_blue_diamond: ${this.streamer} est en live. ${this.getURL()}`;
            else
                msg = `:small_orange_diamond: ${this.streamer} n'est pas en live. ${this.getURL()}`;
            this.message.update(msg);

            this.lastInformation = info;
        }

        if(callback)
            callback(this.lastInformation);
    })
}

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
    console.log(this.twitches.length);
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
    return twitch => twitch.streamer === streamer && twitch.channel.id === channel.id && twitch.channel.guild.id === channel.guild.id;
}
Application.prototype.addTwitch = function(streamer, channel, messageToReplace) {
    const matchingTwitches = this.twitches.filter(Application.twitchMatcher(streamer, channel));

    if(matchingTwitches.length === 0)
    {
        const twitch = new Twitch(streamer, channel, messageToReplace);
        this.twitches.push(twitch);
        return twitch;
    }
    else
    {
        return matchingTwitches[0];
    }
}
Application.prototype.removeTwitch = function(streamer, channel) {
    this.twitches = this.twitches.filter(twitch => !Application.twitchMatcher(streamer, channel)(twitch));
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

function Saver(filePath, object)
{
    this.filePath = filePath;
    this.object = object;
    this.executionPool = new ExecutionPool();
}
Saver.prototype.save = function(callback) {
    this.executionPool.add((done) => {
        const obj = this.object.save();
        const data = JSON.stringify(obj);
        
        fs.writeFile(this.filePath, data, () => {
            done();
            if(callback)
                callback();
        })
    })
}
Saver.prototype.load = function(callback)
{
    fs.readFile(this.filePath, (e, content) => {
        if(!e && content)
        {
            const data = JSON.parse(content.toString());
            this.object.load(data);
        }

        if(callback)
            callback();
    })
}

function Bot(options)
{
    if(!options)
        options = {};
    
    this.options = options;

    this.application = new Application(this, this.options);

    this.errorCounters = {};
    this.stops = {
        memberAdd: {},
        memberRemove: {},
        eidolonsWarning: {}
    };

    if(!this.noAutoInitialization)
        this.initialize();
}
Bot.prototype.save = function() {
    return {
        application: this.application.save(),
        stops: this.stops
    };
}
Bot.prototype.load = function(obj) {
    const ctx = {
        bot: this
    };

    this.application.load(obj.application, ctx);
    this.stops = obj.stops;
}
Bot.prototype.start = function(token) {
    this.client.login(token || this.options.token);
}
Bot.getRandomColor = function() {
    const colors = [
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
}
Bot.prototype.ocCommand = function(message) {

    Message.deleteMessage(message);

    //let argson = message.content.split(" ").slice(1);
    //let vcsmsg = argson.join(" ")
    let messageContent = message.content;
    if(!message.guild.channels.find('name', 'orokin-connection'))
        return message.reply('Erreur: le channel `orokin connection` est introuvable');
    if(message.channel.name !== 'orokin-connection')
        return message.reply('Commande a effectuer dans `orokin-connection`');
    if(!messageContent)
        return message.reply('Merci d\'envoyer un "message" à envoyer dans la globalité des discords');

    const regex = /@([^@]+)/img;

    let newText = messageContent;
    let match = regex.exec(messageContent);
    while(match && match.length > 1)
    {
        const nameAndText = match[1];

        for(const [ id, user ] of this.client.users)
        {
            let nameFound;
            if(nameAndText.indexOf(user.tag) === 0)
                nameFound = user.tag;
            else if(nameAndText.indexOf(user.username) === 0)
                nameFound = user.username;

            if(nameFound)
            {
                while(newText.indexOf(`@${nameFound}`) !== -1)
                    newText = newText.replace(`@${nameFound}`, `<@${user.id}>`);
                break;
            }
        }
        
        match = regex.exec(messageContent);
    }

    messageContent = newText;
    
    var embed = new Discord.RichEmbed()
        .setColor(Bot.getRandomColor())
        .setAuthor(message.guild.name + ' / ' + message.author.username, message.guild.iconURL)
        .setThumbnail('https://media.discordapp.net/attachments/473609056163201024/475828867979018240/Capturecc2.PNG');
    
    this.client.channels.findAll('name', 'orokin-connection').map(channel => {
        console.log('SENDING message to ', channel.guild.name);
        
        channel.send(embed);
        channel.send(messageContent);
    })
}
Bot.findTrioTeamRole = function(guild) {
    return guild.roles.find(role => role.name.replace(/\s+/, '').toLowerCase() === 'trioteam');
}
Bot.prototype.joinTrioCommand = function(message) {
    const role = Bot.findTrioTeamRole(message.guild);
    message.member.addRole(role);

    message.channel.send('Vous avez rejoint Trio Team ! :tada: ');
}
Bot.prototype.leaveTrioCommand = function(message) {
    const role = Bot.findTrioTeamRole(message.guild);
    message.member.removeRole(role);
    
    message.channel.send('Vous avez quitté Trio Team ! :cry: ');
}
Bot.prototype.helpCommand = function(message) {

    var embed = new Discord.RichEmbed()
        .setColor(Bot.getRandomColor())
        .setAuthor('Help me!', 'https://media.discordapp.net/attachments/473609056163201024/475758769402544128/embleme_alliance.png?width=50&height=50')
        .setThumbnail('https://media.discordapp.net/attachments/473609056163201024/475758769402544128/embleme_alliance.png?width=50&height=50')
        .setDescription(`
=====================[ Tridolon ]====================
:small_blue_diamond: **!trio** | Affiche les informations sur le trio
:small_blue_diamond: **!join trio** | Rejoindre le role @Trio Team
:small_orange_diamond: **!leave trio** | Quitter le role @Trio Team
:small_orange_diamond: **!nonotif eidolonswarning** | Désactive les notifications de l'arrivée des Eidolons
:small_blue_diamond: **!notif eidolonswarning** | Active les notifications de l'arrivée des Eidolons
====================[ Membres ]====================
:small_orange_diamond: **!nonotif memberadd** | Désactive les notifications lors de l'ajout d'un nouveau membre
:small_blue_diamond: **!notif memberadd** | Active les notifications lors de l'ajout d'un nouveau membre
:small_orange_diamond: **!nonotif memberleave** | Désactive les notifications lorsqu'un membre quitte le clan
:small_blue_diamond: **!notif memberleave** | Active les notifications lorsqu'un membre quitte le clan
=================[ Twitch Disponible ]=================
:small_blue_diamond: **!twitch** <name> | Obtenir des informations sur une chaine Twitch`);

    message.delete();
    message.channel.send(embed);
}
Bot.findGeneralChannel = function(channels) {
    const channelNames = [
        /^[^a-zA-Z0-9]*g[eé]n[eé]ral[^a-zA-Z0-9]*$/img,
        /^[^a-zA-Z0-9]*discussion[^a-zA-Z0-9]*$/img,
        /^[^a-zA-Z0-9]*warframe[^a-zA-Z0-9]*$/img
    ];
    
    const matchingChannels = channels
        .filter(channel => channel.constructor.name === 'TextChannel')
        /*
        .filter(channel => {
            if(channel.name.indexOf('discussion') !== -1)
                console.log(channel.name, /^[^a-zA-Z0-9]*discussion[^a-zA-Z0-9]*$/img.test(channel.name));
            return true;
        })*/
        .filter(channel => channelNames.some(regex => regex.test(channel.name)))
        .array();
                
    if(matchingChannels.length > 0)
    {
        const firstMatchingChannel = matchingChannels[0];
        return firstMatchingChannel;
    }
    else
    {
        return undefined;
    }
}
Bot.isAdmin = function(member) {
    return member.hasPermission('ADMINISTRATOR');
}
Bot.prototype.initialize = function() {
    const client = new Discord.Client();
    this.client = client;

    client.on('message', message => {
        const checkForCommand = (regexCmd) => {
            return regexCmd.test(message.content);
        };
        
        if(this.debug)
        {
            if(message.content[0] !== '@')
                return;
            
            message.content = message.content.slice(1);
        }

        if(checkForCommand(/^\s*!trio\s*$/img))
        {
            this.application.addServerChannel(message.channel);
            message.delete();
            saver.save();
        }
        else if(checkForCommand(/^\s*!nonotif\s+memberadd\s*$/img))
        {
            if(Bot.isAdmin(message.member))
            {
                this.stops.memberAdd[message.guild.id] = true;
                message.reply(':small_orange_diamond: Désactivation des notifications lorsqu\'un membre rejoint le clan');
                saver.save();
            }
        }
        else if(checkForCommand(/^\s*!notif\s+memberadd\s*$/img))
        {
            if(Bot.isAdmin(message.member))
            {
                delete this.stops.memberAdd[message.guild.id];
                message.reply(':small_blue_diamond: Activation des notifications lorsqu\'un membre rejoint le clan');
                saver.save();
            }
        }
        else if(checkForCommand(/^\s*!nonotif\s+memberleave\s*$/img))
        {
            if(Bot.isAdmin(message.member))
            {
                this.stops.memberRemove[message.guild.id] = true;
                message.reply(':small_orange_diamond: Désactivation des notifications lorsqu\'un membre quitte le clan');
                saver.save();
            }
        }
        else if(checkForCommand(/^\s*!notif\s+memberleave\s*$/img))
        {
            if(Bot.isAdmin(message.member))
            {
                delete this.stops.memberRemove[message.guild.id];
                message.reply(':small_blue_diamond: Activation des notifications lorsqu\'un membre quitte le clan');
                saver.save();
            }
        }
        else if(checkForCommand(/^\s*!nonotif\s+eidolonswarning\s*$/img))
        {
            if(Bot.isAdmin(message.member))
            {
                this.stops.eidolonsWarning[message.guild.id] = true;
                message.reply(':small_orange_diamond: Désactivation des notifications pour les Eidolons');
                saver.save();
            }
        }
        else if(checkForCommand(/^\s*!notif\s+eidolonswarning\s*$/img))
        {
            if(Bot.isAdmin(message.member))
            {
                delete this.stops.eidolonsWarning[message.guild.id];
                message.reply(':small_blue_diamond: Activation des notifications pour les Eidolons');
                saver.save();
            }
        }
        else if(checkForCommand(/^\s*!helpme\s*$/img))
        {
            this.helpCommand(message);
        }
        else if(checkForCommand(/^\s*!join trio\s*$/img))
        {
            this.joinTrioCommand(message);
        }
        else if(checkForCommand(/^\s*!leave trio\s*$/img))
        {
            this.leaveTrioCommand(message);
        }
        else if(checkForCommand(/^\s*!twitch\s*.+$/img))
        {
            console.log('TWITCH');
            //this.twitchCommand(message);
            const msg = message.content.trim();
            const streamer = msg.split(' ', 2)[1];
            
            const twitch = this.application.addTwitch(streamer, message.channel, message);
            twitch.update();
            saver.save();
        }
        else if(message.author.id !== this.client.user.id && message.channel.name === 'orokin-connection')
        {
            this.ocCommand(message);
        }
        console.log(message.content.trim());
    })
    
    client.on('guildMemberAdd', member => {
        
        if(!this.stops.memberRemove[member.guild.id])
        {
            const channelGeneral = Bot.findGeneralChannel(member.guild.channels);
            
            if(channelGeneral)
            {
                console.log('SENDING WELCOME');
                channelGeneral.send(` Bienvenue ${member} ! have fun :wink: !`);
            }
        }
    })

    client.on('guildMemberRemove', member => {
        console.log('guildMemberRemove');

        if(!this.stops.memberRemove[member.guild.id])
        {
            member.createDM().then(channel => {
                console.log('SENDING BYE BYE');
                return channel.send('hey! ben c\'est dommage de partir :( bonne continuation ...')
            })
        }
    })

    client.on('ready', () => {
        console.log('READY');

        setTimeout(() => {
            client.user.setAvatar('./embleme alliance.png');
        }, 5000);
        client.user.setActivity('connecter la guilde');

        this.application.start();
        if(this._onReady)
            this._onReady();
    })
}
Bot.prototype.onReady = function(fn) {
    this._onReady = fn;
}

function ExecutionPool()
{
    this.poolSetContent = [];
}
ExecutionPool.prototype.add = function(fn) {
    this.poolSetContent.push(() => {
        fn(() => {
            this.poolSetContent.shift();

            if(this.poolSetContent.length >= 1)
            {
                process.nextTick(() => {
                    this.poolSetContent[0]();
                });
            }
        });
    });

    if(this.poolSetContent.length === 1)
        this.poolSetContent[0]();
}


function Message(channel, messageToReplace, newMessage)
{
    this.channel = channel;
    this.executionPool = new ExecutionPool();
    
    Message.deleteMessage(messageToReplace);

    if(newMessage)
        this.update(newMessage);
}
Message.displayPermissionRequired = function(channel) {
    if(!Message.guilds)
        Message.guilds = {};
    if(!Message.guilds[channel.id])
        Message.guilds[channel.id] = 0;
    
    const nb = Message.guilds[channel.id];

    if(nb <= 0)
    {
        Message.guilds[channel.id] = 5;
        channel.send('Je n\'ai pas pu supprimer ton message. Met moi le rôle `Gérer les messages` ou `Admin`.');
    }
    else
    {
        --Message.guilds[channel.id];
    }
}
Message.deleteMessage = function(message) {
    if(message)
    {
        message
            .delete()
            .catch(ex => {
                if(ex.code === 50013)
                {
                    Message.displayPermissionRequired(message.channel);
                }
            });
    }
}
Message.prototype.update = function(message) {
    this.executionPool.add((done) => {
        console.log('TRYING TO SEND EMBED', !!this.msg);

        let promise;
        if(this.msg)
            promise = this.msg.edit(message);
        else
            promise = this.channel.send(message);

        promise.then(m => {
            console.log('MESSAGE EMBED SET');
            this.msg = m;
            saver.save();
            
            done();
        });
    });
}
Message.prototype.delete = function() {
    Message.deleteMessage(this.msg);
    this.msg = undefined;
}
Message.prototype.save = function() {
    return {
        channel: this.channel.id,
        guild: this.channel.guild.id,
        message: this.msg ? this.msg.id : undefined
    };
}
Message.prototype.load = function(obj, ctx) {
    if(obj.guild)
    {
        const guild = findById(ctx.bot.client.guilds, obj.guild);
        const channel = findById(guild.channels, obj.channel);

        this.channel = channel;

        if(obj.message)
        {
            this.channel.fetchMessages().then((messages) => {
                this.msg = findById(messages, obj.message);
            })
        }
    }
}
Message.createUniqueServerWideMessage = function() {
    const obj = {
        getMessage: function(channel) {
            if(channel && this.message && this.message.channel.id !== channel.id)
            {
                this.message.delete();
                this.message = undefined;
            }
        
            if(!this.message)
            {
                if(!channel)
                    console.error('No channel provided, but it was required');
                this.message = new Message(channel);
            }
            
            return this.message;
        },
        save: function() {
            return {
                message: this.message.save()
            }
        },
        load: function(obj, ctx) {
            this.message = new Message();
            this.message.load(obj.message, ctx);
        },
        getChannel: function() {
            return this.message ? this.message.channel : undefined;
        },
        getGuild: function() {
            const channel = this.getChannel();

            return channel ? channel.guild : undefined;
        }
    };

    return obj;
}

function Server(application, eidelon)
{
    this.application = application;
    this.eidelon = eidelon;

    this.messageManager = Message.createUniqueServerWideMessage();
}
Server.prototype.save = function() {
    return {
        messageManager: this.messageManager.save()
    };
}
Server.prototype.load = function(obj, ctx) {
    this.messageManager.load(obj.messageManager, ctx);
}
Server.prototype.warnForEidolons = function(info, force) {
    if(!info.isDay || this.application.bot.stops.eidolonsWarning[this.messageManager.getGuild().id])
        return;
    
    if((force || Math.trunc(this.expirationDate / 10000) !== Math.trunc(info.expirationDate / 10000)) && info.timeLeft.totalMs <= 600000)
    {
        this.expirationDate = info.expirationDate;

        const channelGeneral = Bot.findGeneralChannel(this.messageManager.getGuild().channels);
        
        if(channelGeneral)
        {
            var role = channelGeneral.guild.roles.filter(role => role.name === 'Trio Team').array()[0];
            channelGeneral.send(`Les Eidolons arrivent dans quelques minutes! Préparez-vous! ${role ? role : '' }`);
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

function Eidelon()
{ }
Eidelon.nearEndOfDayText = fs.readFileSync('./messagenuit.md');
Eidelon.prototype.createNightMessage = function(info) {
    const timesImg = [
        [       Infinity, 'https://cdn.discordapp.com/attachments/437388704072466433/437388856036425738/1Warframe-45min0000.jpg' ],
        [ 45 * 60 * 1000, 'https://cdn.discordapp.com/attachments/437388704072466433/437388844707479571/1Warframe-40min0000.jpg' ],
        [ 40 * 60 * 1000, 'https://cdn.discordapp.com/attachments/437388704072466433/437388818274975745/1Warframe-30min0000.jpg' ],
        [ 30 * 60 * 1000, 'https://cdn.discordapp.com/attachments/437388704072466433/437388806266683404/1Warframe-25min0000.jpg' ],
        [ 25 * 60 * 1000, 'https://cdn.discordapp.com/attachments/437388704072466433/437388794015121429/1Warframe-20min0000.jpg' ],
        [ 20 * 60 * 1000, 'https://cdn.discordapp.com/attachments/437388704072466433/437388770506178570/1Warframe-11min0671.jpg' ],
        [ 11 * 60 * 1000, 'https://cdn.discordapp.com/attachments/437388704072466433/437388754366496778/1Warframe-8min0670.jpg' ],
        [  8 * 60 * 1000, 'https://cdn.discordapp.com/attachments/437388704072466433/437388731402420224/1Warframe-5min0672.jpg' ],
        [  5 * 60 * 1000, 'https://cdn.discordapp.com/attachments/437388704072466433/437388878899314698/Warframe_fin_de_la_nuit_0000.jpg' ],
    ].reverse();

    let index = 0;
    for(const [ time ] of timesImg)
    {
        if(info.timeLeft.totalMs > time)
            ++index;
    }

    const expirationDateLocal = moment(info.expirationDate);

    return {
        content: `**\n\n** **__Temps restant de cette nuit __**🕓\n${pad(info.timeLeft.h)}:${pad(info.timeLeft.m)}:${pad(info.timeLeft.s)}\n\n\n**__Debut du jour__ **\nà ${expirationDateLocal.format('LT')}\n\n\nIl fait nuit tenno!`,
        img: timesImg[index][1] //'https://vignette.wikia.nocookie.net/warframe/images/4/4c/Conclave_Moon.png/revision/latest?cb=20150327081658&path-prefix=fr'
    };
}
Eidelon.prototype.createDayMessage = function(info) {
    const timesImg = [
        [       Infinity, 'https://cdn.discordapp.com/attachments/437388704072466433/437388980380499979/Warframe1h33_restant_du_jour_0000.jpg' ],
        [ 93 * 60 * 1000, 'https://cdn.discordapp.com/attachments/437388704072466433/437388972877152267/Warframe1h30_retant_du_jour0000.jpg' ],
        [ 90 * 60 * 1000, 'https://cdn.discordapp.com/attachments/437388704072466433/437388951939055616/Warframe1h25_restant_de_la_nuit0000.jpg' ],
        [ 85 * 60 * 1000, 'https://cdn.discordapp.com/attachments/437388704072466433/437388941705084930/Warframe1h20_restant_du_jour0000.jpg' ],
        [ 80 * 60 * 1000, 'https://cdn.discordapp.com/attachments/437388704072466433/437388932725080064/Warframe1h15_restant_du_jour0000.jpg' ],
        [ 75 * 60 * 1000, 'https://cdn.discordapp.com/attachments/437388704072466433/437388922948157441/Warframe1h10_restant_du_jour0000.jpg' ],
        [ 70 * 60 * 1000, 'https://cdn.discordapp.com/attachments/437388704072466433/437388912516923393/Warframe1h05_restrant_du_jour0000.jpg' ],
        [ 65 * 60 * 1000, 'https://cdn.discordapp.com/attachments/437388704072466433/437388902282559509/Warframe1h_restant_du_jour0000.jpg' ],
        [ 60 * 60 * 1000, 'https://cdn.discordapp.com/attachments/437388704072466433/437389116405973003/Warframe55min_restant_du_jour0000.jpg' ],
        [ 55 * 60 * 1000, 'https://cdn.discordapp.com/attachments/437388704072466433/437389108193525760/Warframe50min_restant_du_jours0000.jpg' ],
        [ 50 * 60 * 1000, 'https://cdn.discordapp.com/attachments/437388704072466433/437389093622644756/Warframe45min_restant_du_jours_0000.jpg' ],
        [ 45 * 60 * 1000, 'https://cdn.discordapp.com/attachments/437388704072466433/437389084227534848/Warframe40min_restant_du_jour_0000.jpg' ],
        [ 40 * 60 * 1000, 'https://cdn.discordapp.com/attachments/437388704072466433/437389073724997634/Warframe35min_restant_du_jour0000.jpg' ],
        [ 35 * 60 * 1000, 'https://cdn.discordapp.com/attachments/437388704072466433/437389064732278785/Warframe30min_restant_du_jour0000.jpg' ],
        [ 30 * 60 * 1000, 'https://cdn.discordapp.com/attachments/437388704072466433/437389055785697290/Warframe25_min_restant_du_jour0000.jpg' ],
        [ 25 * 60 * 1000, 'https://cdn.discordapp.com/attachments/437388704072466433/437389045123907584/Warframe20min_restant_du_jour0000.jpg' ],
        [ 20 * 60 * 1000, 'https://cdn.discordapp.com/attachments/437388704072466433/437389027272949770/Warframe15min_restant_du_jour0000.jpg' ],
        [ 15 * 60 * 1000, 'https://cdn.discordapp.com/attachments/437388704072466433/437389013637398533/Warframe10min_restant_du_jour0000.jpg' ],
        [ 10 * 60 * 1000, 'https://cdn.discordapp.com/attachments/437388704072466433/437389002111451136/Warframe5min_restant_du_jour0000.jpg' ],
        [  5 * 60 * 1000, 'https://cdn.discordapp.com/attachments/437388704072466433/437388991638142987/Warframe1min_restant_du_jour_coucher_du_soleil0000.jpg' ]
    ].reverse();

    let index = 0;
    for(const [ time ] of timesImg)
    {
        if(info.timeLeft.totalMs > time)
            ++index;
    }

    const timeLeft = info.timeLeft.totalMs < 1200000;

    const expirationDateLocal = moment(info.expirationDate);

    return {
        content: `**\n\n** **__Temps restant avant la nuit__**🕓 \n ${pad(info.timeLeft.h)}:${pad(info.timeLeft.m)}:${pad(info.timeLeft.s)}\n\n\n**__Debut de la nuit__** \n à ${expirationDateLocal.format('LT')} ${timeLeft ? Eidelon.nearEndOfDayText : ''}\n\n\nIl fait jour...`,
        img: timesImg[index][1]
    };
}
Eidelon.prototype.createMessageFromInformation = function(info) {
    const message = info.isDay ? this.createDayMessage(info) : this.createNightMessage(info);
    return message;
};
Eidelon.prototype.createMessage = function(callback) {

    this.getInformation(info => {
        if(!info)
            return callback();
        
        callback(this.createMessageFromInformation(info), info);
    });
};
Eidelon.prototype.getInformation = function(callback) {
    request({
        url: 'https://whatever-origin.herokuapp.com/get?url=http://content.warframe.com/dynamic/worldState.php'
    }, (e, res, body) => {
        try
        {
            const contents = JSON.parse(JSON.parse(body.toString()).contents);

            const syndicate = contents.SyndicateMissions.find(el => el.Tag === 'CetusSyndicate');

            if(!syndicate)
                return callback(undefined);

            const eido_timestamp = Math.floor(syndicate["Expiry"]["$date"]["$numberLong"] / 1000);

            const d = new Date();
            const time = d.getTime() / 1000;
            // This time is the end of night and start of day
            const start_time = (eido_timestamp - 150 * 60)
            const irltime_m = ((time - start_time)/60) % 150;  // 100m of day + 50m of night
            
            let eidotime_in_h = (irltime_m / 6.25) + 6;
            if (eidotime_in_h < 0) eidotime_in_h += 24;
            if (eidotime_in_h > 24) eidotime_in_h -= 24;
            const eidotime_h = Math.floor(eidotime_in_h);
            const eidotime_m = Math.floor((eidotime_in_h * 60) % 60);
            const eidotime_s = Math.floor((eidotime_in_h * 60 * 60) % 60);

            let next_interval;
            let isDay = false;

            // Night is from 9pm to 5am
            // Day is from 5am to 9pm
            if (150 - irltime_m > 50) {
                isDay = true;
                next_interval = 21;
            } else {
                isDay = false;
                next_interval = 5;
            }

            let eido_until_h = next_interval - (eidotime_h % 24);
            if(eido_until_h < 0)
                eido_until_h += 24;
            const eido_until_m = 60 - eidotime_m;
            const eido_until_s = 60 - eidotime_s;

            let irl_until_in_m = 150 - irltime_m;

            if(irl_until_in_m > 50)
                irl_until_in_m -= 50;

            const irl_until_h = Math.floor(irl_until_in_m / 60);
            const irl_until_m = Math.floor(irl_until_in_m % 60);
            const irl_until_s = Math.floor((irl_until_in_m * 60) % 60);

            const toMS = (h, m, s) => ((h * 60 + m) * 60 + s) * 1000;

            const info = {
                isDay: isDay,
                timeLeft: {
                    h: irl_until_h,
                    m: irl_until_m,
                    s: irl_until_s,
                    totalMs: toMS(irl_until_h, irl_until_m, irl_until_s)
                },
                eidotime: {
                    h: eidotime_h,
                    m: eidotime_m,
                    s: eidotime_s,
                    totalMs: toMS(eidotime_h, eidotime_m, eidotime_s)
                },
                irl: {
                    h: eido_until_h,
                    m: eido_until_m,
                    s: eido_until_s,
                    totalMs: toMS(eido_until_h, eido_until_m, eido_until_s)
                }
            };
            
            const expirationDate = moment().add(info.timeLeft.h + 2, 'hours').add(info.timeLeft.m, 'minutes').add(info.timeLeft.s, 'seconds');
            info.expirationDate = expirationDate.valueOf();

            callback(info);
        }
        catch(ex)
        {
            console.error(ex);
            callback();
        }
    });
}

const bot = new Bot({
    token: process.env.TOKEN
});
bot.debug = true;

const saver = new Saver('./state.json', bot);
bot.saver = saver;
bot.onReady(() => {
    saver.load()
})

if(bot.debug)
    console.log('ATTENTION AU MODE DEBUG');

bot.start();
