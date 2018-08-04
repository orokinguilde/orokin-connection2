
const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require('fs');
const request = require("request");
const EventEmitter = require('events');
const moment = require('moment');

let servers = {};
let rules = fs.readFileSync('./rules.md')// jai un dossier avec la chatre du serveur dans ./rules.md. je saios pas si il y'a une erreur ici 
bot.login('process.env.TOKEN');
// let stop = false; // for use with while and setTimeout

        bot.on('message', function(message) {
                if(message.content.startsWith("oc")) {
                            message.delete(message.author);
                    let argson = message.content.split(" ").slice(1);
                    let vcsmsg = argson.join(" ")
                    if (!message.guild.channels.find("name", "orokin-connection")) return message.reply("Erreur: le channel `orokin connection` est introuvable");
                    if(message.channel.name !== "orokin-connection") return message.reply("Commande a effectuer dans `orokin-connection`");
                    if(!vcsmsg) return message.reply("Merci d'envoyer un ''message'' à envoyer dans la globalité des discords");
                
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
        member.guild.channels.find("name" , "general").send(` Bienvenue ${member} ! have fun :wink: !`)
})              
bot.on("guildMemberRemove" , member => {
        member.createDM().then(channel => {
                return channel.send('hey! ben c est dommage de partir :( bonne continuation ...')
        })
})
bot.on('ready', function () {
        bot.user.setAvatar('./embleme alliance .png')
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

function update(discord_message, channel) {
        let data; //=> JSON
        let date_expiry; //=> string
        let is_day; //=> boolean
        let expire_in; //=>Moment

        request("https://api.warframestat.us/pc/cetusCycle", function(error, response, file) {
                data = JSON.parse(file);
                data_expiry = moment(data.expiry);
                is_day = data.isDay
                expire_in = moment(data_expiry) - moment(); //=>moment
                expire_in = moment(expire_in).add(-1, 'hour');
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
        });
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
