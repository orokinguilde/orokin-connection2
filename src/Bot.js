const Application = require('./Application');
const BigBrowser = require('./BigBrowser');
const Discord = require('discord.js');
const Message = require('./Message');
const globals = require('./globals');

function Bot(options)
{
    if(!options)
        options = {};
    
    this.options = options;

    this.application = new Application(this, this.options);
    this.bigBrowser = new BigBrowser();

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
        bigBrowser: this.bigBrowser.save(),
        stops: this.stops
    };
}
Bot.prototype.load = function(obj) {
    const ctx = {
        bot: this
    };

    this.application.load(obj.application, ctx);
    this.stops = obj.stops;

    if(obj.bigBrowser)
        this.bigBrowser.load(obj.bigBrowser, ctx);
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
        
        channel.send(embed).then(() => channel.send(messageContent));
    })
}
Bot.findTrioTeamRole = function(guild) {
    return guild.roles.find(role => role.name.toLowerCase().indexOf('trio') > 0 && role.name.toLowerCase().indexOf('team') > 0);
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
Bot.prototype.helpCommand = function(message, group) {

    const authorIcon = 'https://media.discordapp.net/attachments/473609056163201024/475758769402544128/embleme_alliance.png?width=50&height=50';
    
    const embed = new Discord.RichEmbed()
        .setColor(Bot.getRandomColor())
        .setThumbnail('https://cdn.discordapp.com/attachments/473609056163201024/479491701853913095/Help.png');

    if(!group)
    {
        embed
            .setAuthor('Help me!', authorIcon)
            .addField('Tridolon', '`trio`, `join trio`, `leave trio`, `nonotif eidolonswarning`,\r\n`notif eidolonswarning`\r\n\r\n*Plus de détails :* `!helpme tridolon`\r\n¯¯¯¯¯¯¯¯¯¯¯¯¯¯')
            .addField('Membres', '`nonotif memberadd`, `notif memberadd`, `nonotif memberleave`,\r\n`notif memberleave`\r\n\r\n*Plus de détails :* `!helpme membres`\r\n¯¯¯¯¯¯¯¯¯¯¯¯¯¯')
            .addField('Twitch', '`twitch <name>`, `twitch remove <name>`\r\n\r\n*Plus de détails :* `!helpme twitch`\r\n¯¯¯¯¯¯¯¯¯¯¯¯¯¯')
            .addField('XP Vocal/Textuel', '`server xp`, `server xp md`, `server xp csv`, `server xp txt`,\r\n`start server xp`, `stop server xp`, `start xp`, `stop xp`\r\n\r\n*Plus de détails :* `!helpme xp`\r\n¯¯¯¯¯¯¯¯¯¯¯')
            .setDescription('**Utilisation** : `!<ma_commande>`');
    }
    else if(group.toLowerCase() === 'tridolon')
    {
        embed
            .setAuthor('Tridolon\r\n¯¯¯¯¯¯¯¯', authorIcon)
            .setThumbnail('https://cdn.discordapp.com/attachments/473609056163201024/479613651918127114/Teralyst_1.png')
            .setDescription(`
:small_blue_diamond: **!trio** | Affiche les informations sur le trio
:small_blue_diamond: **!join trio** | Rejoindre le role @Trio Team
:small_orange_diamond: **!leave trio** | Quitter le role @Trio Team
:small_orange_diamond: **!nonotif eidolonswarning** | Désactive les notifications de l'arrivée des Eidolons
:small_blue_diamond: **!notif eidolonswarning** | Active les notifications de l'arrivée des Eidolons`.trim());
    }
    else if(group.toLowerCase() === 'membres')
    {
        embed
            .setAuthor('Membres\r\n¯¯¯¯¯¯¯¯¯', authorIcon)
            .setThumbnail('https://cdn.discordapp.com/attachments/473609056163201024/479619902161027072/unnamed3.png')
            .setDescription(`
:small_blue_diamond: **!notif memberadd** | Active les notifications lors de l'ajout d'un nouveau membre
:small_orange_diamond: **!nonotif memberadd** | Désactive les notifications lors de l'ajout d'un nouveau membre
:small_blue_diamond: **!notif memberleave** | Active les notifications lorsqu'un membre quitte le clan
:small_orange_diamond: **!nonotif memberleave** | Désactive les notifications lorsqu'un membre quitte le clan`.trim());
    }
    else if(group.toLowerCase() === 'twitch')
    {
        embed
            .setAuthor('Twitch\r\n¯¯¯¯¯¯¯', authorIcon)
            .setThumbnail('https://cdn.discordapp.com/attachments/473609056163201024/479614334805213185/1280px-Twitch_logo.png')
            .setDescription(`
:small_blue_diamond: **!twitch** <name> | Obtenir des informations sur une chaine Twitch
:small_orange_diamond: **!twitch remove** <name> | Supprime un message Twitch précédement ajouté`.trim());
    }
    else if(group.toLowerCase() === 'xp')
    {
        embed
            .setAuthor('XP Vocal/Textuel\r\n¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯', authorIcon)
            .setThumbnail('https://cdn.discordapp.com/attachments/473609056163201024/479614949220548610/xp-logo.png')
            .setDescription(`
:small_blue_diamond: **!server xp** | Affiche les statistiques du serveur
:small_blue_diamond: **!server xp md** | Télécharge les stats du serveur au format [MD](https://www.commentcamarche.net/download/telecharger-34055333-notepad)
:small_blue_diamond: **!server xp csv** | Télécharge les stats du serveur au format [CSV](https://www.commentcamarche.net/download/telecharger-209-excel-viewer)
:small_blue_diamond: **!server xp txt** | Télécharge les stats du serveur au format TXT
:small_blue_diamond: **!start server xp** | Démarre le stockage de l'exp du serveur
:small_orange_diamond: **!stop server xp** | Arrête le stockage de l'exp du serveur
:small_blue_diamond: **!start xp** | Démarre le stockage de l'expérience
:small_orange_diamond: **!stop xp** | Arrête le stockage de l'expérience`.trim());
    }

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
        
        if(!message.author.bot)
            this.bigBrowser.increaseTextActivity(message.guild, message.author, 0.5);
        
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
        else if(checkForCommand(/^\s*!(?:help|aide)\s*(?:me|moi)\s*(.*)/img))
        {
            const match = /^\s*!(?:help|aide)\s*(?:me|moi)\s*(.*)/img.exec(message.content);

            this.helpCommand(message, match[1]);
        }
        else if(checkForCommand(/^\s*!(?:join|rejoindre)\s+trio\s*$/img))
        {
            this.joinTrioCommand(message);
        }
        else if(checkForCommand(/^\s*!(?:leave|quitter)\s+trio\s*$/img))
        {
            this.leaveTrioCommand(message);
        }
        else if(checkForCommand(/^\s*!server\s+xp\s*$/img))
        {
            console.log('SERVER STATS');

            const result = this.bigBrowser.getTextSummaryByServer(message.guild);
            
            message.delete();
            message.reply('\r\n' + result);
        }
        else if(checkForCommand(/^\s*!server\s+xp\s+csv\s*$/img))
        {
            console.log('SERVER STATS');

            const result = this.bigBrowser.getTextSummaryByServerCSV(message.guild, true);

            message.delete();
            message.channel.send(new Discord.Attachment(new Buffer(result), 'stats.csv'));
        }
        else if(checkForCommand(/^\s*!server\s+xp\s+md\s*$/img))
        {
            console.log('SERVER STATS');

            const result = this.bigBrowser.getTextSummaryByServer(message.guild);

            message.delete();
            message.channel.send(new Discord.Attachment(new Buffer(result), 'stats.md'));
        }
        else if(checkForCommand(/^\s*!server\s+xp\s+txt\s*$/img))
        {
            console.log('SERVER STATS');

            const result = this.bigBrowser.getTextSummaryByServer(message.guild, false);

            message.delete();
            message.channel.send(new Discord.Attachment(new Buffer(result), 'stats.txt'));
        }
        else if(checkForCommand(/^\s*!global\s+xp\s*$/img))
        {
            console.log('GLOBAL STATS');

            const result = this.bigBrowser.getTextSummaryByServer();

            message.delete();
            message.reply('\r\n' + result);
        }
        else if(checkForCommand(/^\s*!global\s+xp\s+csv\s*$/img))
        {
            console.log('GLOBAL STATS DL');

            const result = this.bigBrowser.getTextSummaryByServerCSV(undefined, true);

            message.delete();
            message.channel.send(new Discord.Attachment(new Buffer(result), 'stats.csv'));
        }
        else if(checkForCommand(/^\s*!global\s+xp\s+md\s*$/img))
        {
            console.log('GLOBAL STATS DL');

            const result = this.bigBrowser.getTextSummaryByServer();

            message.delete();
            message.channel.send(new Discord.Attachment(new Buffer(result), 'stats.md'));
        }
        else if(checkForCommand(/^\s*!global\s+xp\s+txt\s*$/img))
        {
            console.log('GLOBAL STATS DL');

            const result = this.bigBrowser.getTextSummaryByServer(undefined, false);

            message.delete();
            message.channel.send(new Discord.Attachment(new Buffer(result), 'stats.txt'));
        }
        else if(checkForCommand(/^\s*!stop\s+server\s+xp\s*$/img))
        {
            console.log('STOP SERVER XP');

            this.bigBrowser.setServerTracking(message.guild, false);

            message.delete();
            message.reply(':small_orange_diamond: arrêt du stockage de l\'expérience du serveur.');
        }
        else if(checkForCommand(/^\s*!start\s+server\s+xp\s*$/img))
        {
            console.log('START SERVER XP');

            this.bigBrowser.setServerTracking(message.guild, true);

            message.delete();
            message.reply(':small_blue_diamond: démarrage du stockage de l\'expérience du serveur.');
        }
        else if(checkForCommand(/^\s*!stop\s+xp\s*$/img))
        {
            console.log('STOP XP');

            this.bigBrowser.setTracking(message.guild, message.author, false);

            message.delete();
            message.reply(':small_orange_diamond: arrêt du stockage de ton expérience.');
        }
        else if(checkForCommand(/^\s*!start\s+xp\s*$/img))
        {
            console.log('START XP');

            this.bigBrowser.setTracking(message.guild, message.author, true);

            message.delete();
            message.reply(':small_blue_diamond: démarrage du stockage de ton expérience.');
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
        }/*
        else if(checkForCommand(/^\s*![twitch]+\s*.+$/img))
        {
            const msg = message.content.trim();
            const streamer = msg.split(' ', 2)[1];

            message.reply('Tu voulais dire `!twitch ' + streamer + '`?');
        }*/
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
    
    client.on('error', (value) => {
        console.error(value);
    });
    client.on('warn', (value) => {
        console.log(value);
    });

    client.on('ready', () => {
        console.log('READY');

        setTimeout(() => {
            client.user.setAvatar('./embleme alliance.png');
        }, 5000);
        client.user.setActivity('connecter la guilde');

        const startRuntime = () => {
            this.application.start();
            
            setInterval(() => {
                const voiceChannels = client.channels.filter(channel => channel.type === 'voice').array();
                let needToSave = false;

                for(const voiceChannel of voiceChannels)
                {
                    if(!/([^a-zA-Z]|^)[aA][fF][kK]([^a-zA-Z]|$)/img.test(voiceChannel.name))
                    {
                        for(const [ memberId, member ] of voiceChannel.members)
                        {
                            if(!member.user.bot && !member.deaf)
                            {
                                this.bigBrowser.increaseVocalActivity(voiceChannel.guild, member.user, 1 / (30 * 60 * 2));

                                if(member.user.presence && member.user.presence.game && member.user.presence.game.name)
                                {
                                    this.bigBrowser.pingWarframeActivity(voiceChannel.guild, member.user, member.user.presence.game.name.toLowerCase() === 'warframe');
                                }

                                needToSave = true;
                            }
                        }
                    }
                }

                if(needToSave)
                    globals.saver.save();
            }, 500);
        }

        if(this._onReady)
            this._onReady(startRuntime);
        else
            startRuntime();
    })
}
Bot.prototype.onReady = function(fn) {
    this._onReady = fn;
}

module.exports = Bot;
