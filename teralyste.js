
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

function Embed(channel)
{
    this.channel = channel;
    this.poolSetContent = [];
}
Embed.createDiscordEmbed = function(options) {
    const embed = new Discord.RichEmbed()
        .setTitle("[**__trio🌙 eidelon__ **]")
        .setColor(15844367)
        .setThumbnail(options.img)
        .setFooter(`Actualisé à ${moment(new Date()).add(2, 'hour').format('LT')}`, 'https://cdn.discordapp.com/attachments/437388704072466433/458396183237361665/nouvelle_vue_sur_lembleme_final_1.png')
        .setImage('https://media.discordapp.net/attachments/473609056163201024/475829958628081684/Teralyst_2.png?width=299&height=301')
        .setDescription(options.content);

    return embed;
}
Embed.prototype.setContent = function(options) {

    this.poolSetContent.push(() => {
        const embed = Embed.createDiscordEmbed(options);
        console.log('TYING TO SEND EMBED', !!this.embedMessage);

        let promise;
        if(this.embedMessage)
            promise = this.embedMessage.edit(embed);
        else
            promise = this.channel.send(embed);

        promise.then(m => {
            console.log('MESSAGE EMBED SET');
            this.embedMessage = m;
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
Embed.prototype.disable = function() {
    if(this.embedMessage)
    {
        console.log('DELETE');
        this.embedMessage.delete();
        this.embedMessage = undefined;
    }
}

function Twitch(streamer)
{
    this.streamer = streamer;
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
Twitch.prototype.getCurrentInformation = function(callback) {
    return Twitch.getCurrentInformation(this.streamer, callback);
}

function Application(bot, options)
{
    if(!options)
        options = {};
    if(!options.updatePeriodMs)
        options.updatePeriodMs = 15000;

    this.options = options;

    this.eidelon = new Eidelon();
    this.servers = [];
    this.bot = bot;
}
Application.prototype.addServerChannel = function(guild, channel) {
    for(const server of this.servers)
    {
        if(server.guild.id === guild.id)
        {
            server.setChannel(channel);
            server.update();
            return;
        }
    }

    const newServer = new Server(this, guild, channel, this.eidelon);
    this.servers.push(newServer);
    newServer.update();
}
Application.prototype.update = function(callback) {

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
    message
        .delete(message.author)
        .catch(ex => {
            if(ex.code === 50013)
            {
                if(!this.errorCounters.permissionRequired)
                {
                    this.errorCounters.permissionRequired = 5;
                    message.channel.send('Je n\'ai pas pu supprimer ton message. Met moi le rôle gérer `Gérer les messages` ou `Admin`.');
                }
                else
                {
                    --this.errorCounters.permissionRequired;
                }
            }
        });

    //let argson = message.content.split(" ").slice(1);
    //let vcsmsg = argson.join(" ")
    let messageContent = message.content;
    if (!message.guild.channels.find('name', 'orokin-connection'))
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
        console.log('SENDING OC message to ', channel.guild.name);
        
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

    message.channel.send('Vous avez quitté');
}
Bot.prototype.leaveTrioCommand = function(message) {
    const role = Bot.findTrioTeamRole(message.guild);
    message.member.removeRole(role);
}
Bot.prototype.helpCommand = function(message) {

    var embed = new Discord.RichEmbed()
        .setColor(Bot.getRandomColor())
        .setAuthor('Help me!', 'https://media.discordapp.net/attachments/473609056163201024/475758769402544128/embleme_alliance.png?width=50&height=50')
        .setThumbnail('https://media.discordapp.net/attachments/473609056163201024/475758769402544128/embleme_alliance.png?width=50&height=50')
        .setDescription(`
:small_blue_diamond: **!trio** | Affiche les informations sur le trio
:small_blue_diamond: **!join trio** | Rejoindre le role @Trio Team
:small_orange_diamond: **!leave trio** | Quitter le role @Trio Team
:small_orange_diamond: **!oc nonotif memberadd** | Désactive les notifications lors de l'ajout d'un nouveau membre
:small_blue_diamond: **!oc notif memberadd** | Active les notifications lors de l'ajout d'un nouveau membre
:small_orange_diamond: **!oc nonotif memberleave** | Désactive les notifications lorsqu'un membre quitte le clan
:small_blue_diamond: **!oc notif memberleave** | Active les notifications lorsqu'un membre quitte le clan
:small_orange_diamond: **!oc nonotif eidolonswarning** | Désactive les notifications de l'arrivée des Eidolons
:small_blue_diamond: **!oc notif eidolonswarning** | Active les notifications de l'arrivée des Eidolons
`);

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
        .filter(channel => {
            if(channel.name.indexOf('discussion') !== -1)
            console.log(channel.name, /^[^a-zA-Z0-9]*discussion[^a-zA-Z0-9]*$/img.test(channel.name));
            return true;
        })
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
Bot.prototype.initialize = function() {
    const client = new Discord.Client();
    this.client = client;

    client.on('message', message => {
        const checkForCommand = (regexCmd) => {
            return regexCmd.test(message.content);
        };

        if(checkForCommand(/^\s*!trio\s*$/img))
        {
            this.application.addServerChannel(message.guild, message.channel);
            message.delete();
        }
        else if(checkForCommand(/^\s*!oc\s+nonotif\s+memberadd\s*$/img))
        {
            this.stops.memberAdd[message.guild.id] = true;
        }
        else if(checkForCommand(/^\s*!oc\s+notif\s+memberadd\s*$/img))
        {
            delete this.stops.memberAdd[message.guild.id];
        }
        else if(checkForCommand(/^\s*!oc\s+nonotif\s+memberleave\s*$/img))
        {
            this.stops.memberRemove[message.guild.id] = true;
        }
        else if(checkForCommand(/^\s*!oc\s+notif\s+memberleave\s*$/img))
        {
            delete this.stops.memberRemove[message.guild.id];
        }
        else if(checkForCommand(/^\s*!oc\s+nonotif\s+eidolonswarning\s*$/img))
        {
            this.stops.eidolonsWarning[message.guild.id] = true;
        }
        else if(checkForCommand(/^\s*!oc\s+notif\s+eidolonswarning\s*$/img))
        {
            delete this.stops.eidolonsWarning[message.guild.id];
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
            //this.twitchCommand(message);
            const msg = message.content.trim();
            const streamer = msg.split(' ', 2)[1];
            const twitch = new Twitch(streamer);
            twitch.getCurrentInformation(info => {
                if(info.isStreaming)
                {
                    message.channel.send(`:small_blue_diamond: ${streamer} est en live. https://www.twitch.tv/${stream}`);
                }
                else
                {
                    message.channel.send(`:small_orange_diamond: ${streamer} n'est pas en live. https://www.twitch.tv/${stream}`);
                }
            })
        }
        else if(message.author.id !== this.client.user.id && message.channel.name === 'orokin-connection')
        {
            this.ocCommand(message);
        }
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
        
        Bot.findGeneralChannel(client.channels);

        this.application.start();
    })
}

function Server(application, guild, channel, eidelon)
{
    this.application = application;
    this.guild = guild;
    this.channel = channel;
    this.eidelon = eidelon;
}
Server.prototype.warnForEidolons = function(info, force) {
    if(!info.isDay || this.application.bot.stops.eidolonsWarning[this.guild.id])
        return;
    
    if((force || Math.trunc(this.expirationDate / 10000) !== Math.trunc(info.expirationDate / 10000)) && info.timeLeft.totalMs <= 600000)
    {
        this.expirationDate = info.expirationDate;

        const channelGeneral = Bot.findGeneralChannel(this.guild.channels);
        
        if(channelGeneral)
        {
            var role = channelGeneral.guild.roles.filter(role => role.name === 'Trio Team').array()[0];
            channelGeneral.send(`Les Eidolons arrivent dans quelques minutes! Préparez-vous! ${role ? role : '' }`);
        }
    }
}
Server.prototype.getEmbed = function(channel) {
    if(this.embed && this.embed.channel.id !== channel.id)
    {
        this.embed.disable();
        this.embed = undefined;
    }

    if(!this.embed)
        this.embed = new Embed(channel);
    
    return this.embed;
}
Server.prototype.setChannel = function(channel) {
    if(this.channel && this.channel.id === channel.id && this.embed)
    {
        this.embed.disable();
        this.embed = undefined;
    }
    
    this.channel = channel;
}
Server.prototype.update = function(eidelonInfo) {
    this.updateEidelon(eidelonInfo);
}
Server.prototype.updateEidelon = function(info) {

    const exec = () => {
        this.warnForEidolons(info);

        const message = this.eidelon.createMessageFromInformation(info);

        const embed = this.getEmbed(this.channel);
        embed.setContent({
            img: message.img,
            content: message.content
        });
    };

    if(info)
    {
        exec();
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
        content: `**\n \n Il fait nuit tenno! \n \n \n** **__Temps restant de cette nuit __**🕓 \n ${pad(info.timeLeft.h)}:${pad(info.timeLeft.m)}:${pad(info.timeLeft.s)} \n \n \n**__Debut du jour__ ** \n à ${expirationDateLocal.format('LT')}`,
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
        content: `**\n \n Il fait jour... \n \n \n** **__Temps restant avant la nuit__**🕓 \n ${pad(info.timeLeft.h)}:${pad(info.timeLeft.m)}:${pad(info.timeLeft.s)} \n \n \n**__Debut de la nuit__** \n à ${expirationDateLocal.format('LT')} ${timeLeft ? Eidelon.nearEndOfDayText : ''}`,
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

            const info = {
                isDay: isDay,
                timeLeft: {
                    h: irl_until_h,
                    m: irl_until_m,
                    s: irl_until_s,
                    totalMs: ((irl_until_h * 60 + irl_until_m) * 60 + irl_until_s) * 1000
                },
                eidotime: {
                    h: eidotime_h,
                    m: eidotime_m,
                    s: eidotime_s,
                    totalMs: ((eidotime_h * 60 + eidotime_m) * 60 + eidotime_s) * 1000
                },
                irl: {
                    h: eido_until_h,
                    m: eido_until_m,
                    s: eido_until_s,
                    totalMs: ((eido_until_h * 60 + eido_until_m) * 60 + eido_until_s) * 1000
                }
            };
            
            const expirationDate = moment().add(info.timeLeft.h + 2, 'hours').add(info.timeLeft.m, 'minutes').add(info.timeLeft.s, 'seconds');
            info.expirationDate = expirationDate.valueOf();

            callback(info);
        }
        catch(ex)
        {
            callback();
        }
    });
}

const bot = new Bot({
    token: process.env.TOKEN
});

bot.start();
