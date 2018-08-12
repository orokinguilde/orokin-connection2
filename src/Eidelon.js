const request = require('request');
const moment = require('moment');
const pad = require('./globals').pad;
const fs = require('fs');

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

module.exports = Eidelon;
