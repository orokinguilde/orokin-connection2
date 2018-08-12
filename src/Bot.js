const Application = require('./Application');
const Discord = require('discord.js');
const globals = require('./globals');

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

    message.delete();
    message.channel.send(`${message.author} a rejoint Trio Team ! :tada: `);
}
Bot.prototype.leaveTrioCommand = function(message) {
    const role = Bot.findTrioTeamRole(message.guild);
    message.member.removeRole(role);
    
    message.delete();
    message.channel.send(`${message.author} a quitté Trio Team ! :cry: `);
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
:small_blue_diamond: **!twitch** <name> | Obtenir des informations sur une chaine Twitch
:small_orange_diamond: **!twitch remove** <name> | Supprime un message Twitch précédement ajouté`);

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
Bot.adminOnly = function(message, callback) {
    if(Bot.isAdmin(message.member))
    {
        callback();
    }
    else
    {
        message.reply(':small_orange_diamond: Tu n\'as pas les droits pour cette commande');
    }
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

        const setCommonSetting = (message, callback) => {
            Bot.adminOnly(message, () => {
                callback();

                message.delete();
                globals.saver.save();
            });
        }

        if(checkForCommand(/^\s*!trio\s*$/img))
        {
            this.application.addServerChannel(message.channel);
            message.delete();
            globals.saver.save();
        }
        else if(checkForCommand(/^\s*!nonotif\s+memberadd\s*$/img))
        {
            setCommonSetting(message, () => {
                this.stops.memberAdd[message.guild.id] = true;
                message.reply(':small_orange_diamond: Désactivation des notifications lorsqu\'un membre rejoint le clan');
            });
        }
        else if(checkForCommand(/^\s*!notif\s+memberadd\s*$/img))
        {
            setCommonSetting(message, () => {
                delete this.stops.memberAdd[message.guild.id];
                message.reply(':small_blue_diamond: Activation des notifications lorsqu\'un membre rejoint le clan');
            });
        }
        else if(checkForCommand(/^\s*!nonotif\s+memberleave\s*$/img))
        {
            setCommonSetting(message, () => {
                this.stops.memberRemove[message.guild.id] = true;
                message.reply(':small_orange_diamond: Désactivation des notifications lorsqu\'un membre quitte le clan');
            });
        }
        else if(checkForCommand(/^\s*!notif\s+memberleave\s*$/img))
        {
            setCommonSetting(message, () => {
                delete this.stops.memberRemove[message.guild.id];
                message.reply(':small_blue_diamond: Activation des notifications lorsqu\'un membre quitte le clan');
            });
        }
        else if(checkForCommand(/^\s*!nonotif\s+eidolonswarning\s*$/img))
        {
            setCommonSetting(message, () => {
                this.stops.eidolonsWarning[message.guild.id] = true;
                message.reply(':small_orange_diamond: Désactivation des notifications pour les Eidolons');
            });
        }
        else if(checkForCommand(/^\s*!notif\s+eidolonswarning\s*$/img))
        {
            setCommonSetting(message, () => {
                delete this.stops.eidolonsWarning[message.guild.id];
                message.reply(':small_blue_diamond: Activation des notifications pour les Eidolons')
            });
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
        else if(checkForCommand(/^\s*!twitch\s+remove\s*.+$/img))
        {
            console.log('TWITCH REMOVE');

            const msg = message.content.trim();
            const streamer = msg.split(' ', 2)[1];

            const twitch = this.application.removeTwitch(streamer);
            
            if(twitch)
            {
                twitch.delete();
                message.channel.send(`Le message du twitch \`${twitch.streamer}\` a été supprimé`);
            }
            else
                message.channel.send(`Pas de message du twitch \`${streamer}\` a supprimer`);
        }
        else if(checkForCommand(/^\s*!twitch\s*.+$/img))
        {
            console.log('TWITCH');
            
            const msg = message.content.trim();
            const streamer = msg.split(' ', 2)[1];
            
            const { twitch, created } = this.application.addTwitch(streamer, message.channel, message);
            if(created)
            {
                twitch.update();
            }
            else
            {
                twitch.isLive(isLive => {
                    message.channel.send(`Le twitch existe deja sur le channel \`${twitch.message.channel.name}\` ! (\`${twitch.streamer}\` ${isLive ? 'est en live' : 'n\'est pas en live'})`);
                })
            }

            globals.saver.save();
        }
        else if(checkForCommand(/^\s*![twitch]+\s*.+$/img))
        {
            const msg = message.content.trim();
            const streamer = msg.split(' ', 2)[1];

            message.reply('Tu voulais dire `!twitch ' + streamer + '`?');
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

module.exports = Bot;
