
const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require('fs');
const request = require("request");
const EventEmitter = require('events');
const moment = require('moment');

moment.locale('fr');

let servers = {};
let rules = fs.readFileSync('./rules.md')// jai un dossier avec la chatre du serveur dans ./rules.md. je saios pas si il y'a une erreur ici 
bot.login(process.env.TOKEN);
// let stop = false; // for use with while and setTimeout

bot.on('message', function(message) {
    if(message.content.startsWith("oc"))
    {
        message.delete(message.author);
        let argson = message.content.split(" ").slice(1);
        let vcsmsg = argson.join(" ")
        if (!message.guild.channels.find("name", "orokin-connection"))
            return message.reply("Erreur: le channel `orokin connection` est introuvable");
        if(message.channel.name !== "orokin-connection")
            return message.reply("Commande a effectuer dans `orokin-connection`");
        if(!vcsmsg)
            return message.reply("Merci d'envoyer un ''message'' à envoyer dans la globalité des discords");

        var replys = [
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

        let reponse = (replys[Math.floor(Math.random() * replys.length)])
        var embed = new Discord.RichEmbed()
            .setColor(reponse)
            .setAuthor("Orokin Connection", bot.user.avatarURL)
            .addField("message en provenance de:", message.guild.name, true)
            .addField("_________________", message.author.tag)
            .addField("____", vcsmsg)
            .setFooter(" by Orokin Guilde")
            .setTimestamp()
        bot.channels.findAll('name', 'orokin-connection').map(channel => channel.send(embed))
    }
})
                
bot.on("guildMemberAdd" , member => {
    const channelNames = [
        /^g[eé]n[eé]ral$/img
    ];
    
    const matchingChannels = member.guild.channels
        .filter(channel => channelNames.some(regex => regex.test(channel.name))
        .array();
                
    if(matchingChannels.length > 0)
    {
        const firstMatchingChannel = matchingChannels[0];
        firstMatchingChannel.send(` Bienvenue ${member} ! have fun :wink: !`);
    }
})              
bot.on("guildMemberRemove" , member => {
        member.createDM().then(channel => {
                return channel.send('hey! ben c est dommage de partir :( bonne continuation ...')
        })
})
bot.on('ready', function () {
        bot.user.setAvatar('./embleme alliance.png')
        bot.user.setActivity('connecter la guilde');
})

bot.on('message', function (message) {
        const mess = message.content.toLowerCase();
        const channel = message.channel;
        //let bot_message;
        if(mess.startsWith("!trio")){
                setInterval(function() {
                        update(message, channel);
                }, 15000);
        }
        var server = servers[message.guild.id];
        if(!servers[message.guild.id]) servers[message.guild.id] ={
                anti_spam: 0,
                bot_message: []
        }
})

function getTimes(callback) {
    request({
        url: 'https://whatever-origin.herokuapp.com/get?url=http://content.warframe.com/dynamic/worldState.php'
    }, (e, res, body) => {
        const contents = JSON.parse(JSON.parse(body.toString()).contents);

        const syndicate = contents.SyndicateMissions.find(el => el.Tag === 'CetusSyndicate');

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

        callback({
            isDay: isDay,
            time: {
                h: irl_until_h,
                m: irl_until_m,
                s: irl_until_s
            },
            eidotime: {
                h: eidotime_h,
                m: eidotime_m,
                s: eidotime_s
            },
            irl: {
                h: eido_until_h,
                m: eido_until_m,
                s: eido_until_s
            }
        });
    })
}

function pad(value) {
        value = value.toString();
        while(value.length < 2)
                value = '0' + value;
        return value;
}
function update(discord_message, channel) {
        getTimes(info => {
                const message = {};
                const expirationDate = moment().add(info.time.h + 2, 'hours').add(info.time.m, 'minutes').add(info.time.s, 'seconds');
                const expirationTimeMs = (info.time.h * 60 * 60 + info.time.m * 60 + info.time.s) * 1000;

                if (!info.isDay){
                        //Nuit
                        message.content = `**\n \n Il fait nuit tenno! \n \n \n** **__Temps restant de cette nuit __**🕓 \n ${pad(info.time.h)}:${pad(info.time.m)}:${pad(info.time.s)} \n \n \n**__Debut du jour__ ** \n à ${expirationDate.format('LT')}`
                        message.img = "https://vignette.wikia.nocookie.net/warframe/images/4/4c/Conclave_Moon.png/revision/latest?cb=20150327081658&path-prefix=fr"
                }else{
                        //Jour
                        message.content = `**\n \n Il fait jour... \n \n \n** **__Temps restant avant la nuit__**🕓 \n ${pad(info.time.h)}:${pad(info.time.m)}:${pad(info.time.s)} \n \n \n**__Debut de la nuit__** \n à ${expirationDate.format('LT')}`
                        let nuit = fs.readFileSync('./messagenuit.md')
                        if(expirationTimeMs < 1200000){ // moins de 20 mins
                                message.content += (nuit)
                        }
                        if(expirationTimeMs <= 600000 && (expirationTimeMs >= 585000)){
                        bot.channels.get("336080127609929728").send('```Les Eidolons arrivent dans quelques minutes! Préparez-vous!```');
                        }
                        if(expirationTimeMs <= 6000000 && (expirationTimeMs >= 5400000)){
                        message.img = "https://cdn.discordapp.com/attachments/437388704072466433/437388980380499979/Warframe1h33_restant_du_jour_0000.jpg"
                        }         
                        if(expirationTimeMs <= 5399999 && (expirationTimeMs >= 4800000)){
                        message.img = "https://cdn.discordapp.com/attachments/437388704072466433/437388972877152267/Warframe1h30_retant_du_jour0000.jpg"
                        }
                        if(expirationTimeMs <= 4799999 && (expirationTimeMs >= 4200000)){
                        message.img = "https://cdn.discordapp.com/attachments/437388704072466433/437388932725080064/Warframe1h15_restant_du_jour0000.jpg"
                        }
                        if(expirationTimeMs <= 4199999 && (expirationTimeMs >= 3600000)){
                        message.img = "https://cdn.discordapp.com/attachments/437388704072466433/437388902282559509/Warframe1h_restant_du_jour0000.jpg"
                        }
                        if(expirationTimeMs <= 3599999 && (expirationTimeMs >= 3000000)){
                        message.img = "https://cdn.discordapp.com/attachments/437388704072466433/437389108193525760/Warframe50min_restant_du_jours0000.jpg"
                        } 
                        if(expirationTimeMs <= 2999999 && (expirationTimeMs >= 2400000)){
                        message.img = "https://cdn.discordapp.com/attachments/437388704072466433/437389084227534848/Warframe40min_restant_du_jour_0000.jpg"
                        }
                        if(expirationTimeMs <= 2399999 && (expirationTimeMs >= 1800000)){
                        message.img = "https://cdn.discordapp.com/attachments/437388704072466433/437389064732278785/Warframe30min_restant_du_jour0000.jpg"
                        }
                        if(expirationTimeMs <= 1799999 && (expirationTimeMs >= 600000)){
                        message.img = "https://cdn.discordapp.com/attachments/437388704072466433/437389013637398533/Warframe10min_restant_du_jour0000.jpg"
                        }
                        if(expirationTimeMs <= 599999 && (expirationTimeMs >= 20)){
                        message.img = "https://cdn.discordapp.com/attachments/437388704072466433/437388991638142987/Warframe1min_restant_du_jour_coucher_du_soleil0000.jpg" 
                }//ça marche mais c'est pas tres opti... ques tu en pense ? (ça envois des images differantes selon le moment expire in )
                }
                writeMessage(message, discord_message);
        });
        /*
        let data; //=> JSON
        let date_expiry; //=> string
        let is_day; //=> boolean
        let expire_in; //=>Moment

        request("https://api.warframestat.us/pc/cetusCycle", function(error, response, file) {
                data = JSON.parse(file);
                data_expiry = moment(data.expiry);
                is_day = data.isDay
                expire_in = moment(data_expiry) - moment(); //=>moment
                expire_in = moment(expire_in);//.add(-1, 'hour');
                const message = {};

                if (!is_day){
                        //Nuit
                        message.content = `**\n \n Il fait nuit tenno! \n \n \n** **__Temps restant de cette nuit __**🕓 \n ${moment(expire_in).format('HH:mm:ss')} \n \n \n**__Debut du jour__ ** \n à ${data_expiry.format('LT')}`
                        message.img = "https://vignette.wikia.nocookie.net/warframe/images/4/4c/Conclave_Moon.png/revision/latest?cb=20150327081658&path-prefix=fr"
                }else{
                        //Jour
                        message.content = `**\n \n Il fait jour... \n \n \n** **__Temps restant avant la nuit__**🕓 \n ${moment(expire_in).format('HH:mm:ss')} \n \n \n**__Debut de la nuit__** \n à ${data_expiry.format('LT')}`
                        let nuit = fs.readFileSync('./messagenuit.md')
                        if(moment(expire_in) < 1200000){ // moins de 20 mins
                                message.content += (nuit)
                        }
                        if(moment(expire_in) <= 600000 && (moment(expire_in) >= 585000)){
                        bot.channels.get("336080127609929728").send('```<@444568556441698315> Les Eidolons arrivent dans quelques minutes! Préparez-vous!```');
                        }
                        if(moment(expire_in) <= 6000000 && (moment(expire_in) >= 5400000)){
                        message.img = "https://cdn.discordapp.com/attachments/437388704072466433/437388980380499979/Warframe1h33_restant_du_jour_0000.jpg"
                        }         
                        if(moment(expire_in) <= 5399999 && (moment(expire_in) >= 4800000)){
                        message.img = "https://cdn.discordapp.com/attachments/437388704072466433/437388972877152267/Warframe1h30_retant_du_jour0000.jpg"
                        }
                        if(moment(expire_in) <= 4799999 && (moment(expire_in) >= 4200000)){
                        message.img = "https://cdn.discordapp.com/attachments/437388704072466433/437388932725080064/Warframe1h15_restant_du_jour0000.jpg"
                        }
                        if(moment(expire_in) <= 4199999 && (moment(expire_in) >= 3600000)){
                        message.img = "https://cdn.discordapp.com/attachments/437388704072466433/437388902282559509/Warframe1h_restant_du_jour0000.jpg"
                        }
                        if(moment(expire_in) <= 3599999 && (moment(expire_in) >= 3000000)){
                        message.img = "https://cdn.discordapp.com/attachments/437388704072466433/437389108193525760/Warframe50min_restant_du_jours0000.jpg"
                        } 
                        if(moment(expire_in) <= 2999999 && (moment(expire_in) >= 2400000)){
                        message.img = "https://cdn.discordapp.com/attachments/437388704072466433/437389084227534848/Warframe40min_restant_du_jour_0000.jpg"
                        }
                        if(moment(expire_in) <= 2399999 && (moment(expire_in) >= 1800000)){
                        message.img = "https://cdn.discordapp.com/attachments/437388704072466433/437389064732278785/Warframe30min_restant_du_jour0000.jpg"
                        }
                        if(moment(expire_in) <= 1799999 && (moment(expire_in) >= 600000)){
                        message.img = "https://cdn.discordapp.com/attachments/437388704072466433/437389013637398533/Warframe10min_restant_du_jour0000.jpg"
                        }
                        if(moment(expire_in) <= 599999 && (moment(expire_in) >= 20)){
                        message.img = "https://cdn.discordapp.com/attachments/437388704072466433/437388991638142987/Warframe1min_restant_du_jour_coucher_du_soleil0000.jpg" 
                }//ça marche mais c'est pas tres opti... ques tu en pense ? (ça envois des images differantes selon le moment expire in )
                }
                writeMessage(message, discord_message);
        });*/
}
                          
function writeMessage(_message, discord_message){
        var server = servers[discord_message.guild.id];
        const embed = new Discord.RichEmbed()
                .setTitle("[**__trio🌙 eidelon__ **]")
                .setColor(15844367)
                .setThumbnail(_message.img)
                .setFooter(`Actualisé à ${new Date().toLocaleTimeString()}`, "https://cdn.discordapp.com/attachments/430306848793690114/435516047395913738/embleme_alliance_.png")
                .setImage("https://cdn.discordapp.com/attachments/430306848793690114/435515262964334623/dd.png")
                .setDescription(_message.content)
        if(server.anti_spam === 0){
                server.anti_spam = 1
                discord_message.channel.send(embed)
                .then(m => {
                        server.bot_message = m;
                });
        } else{
                server.bot_message.edit(embed).then((m => {
                        server.bot_message = m;
                }))
        }
}
