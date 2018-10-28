const moment = require('moment-timezone');

function BigBrowser()
{
    this.servers = {};
}
BigBrowser.prototype.getServerObject = function(server) {
    let serverObj = this.servers[server.id];
    if(!serverObj)
    {
        serverObj = {
            __name__: server.name,
            __id__: server.id
        };
        this.servers[server.id] = serverObj;
    }
    
    return serverObj;
}
BigBrowser.prototype.getUserObject = function(server, user) {
    const serverObj = this.getServerObject(server);
    
    let userObj = serverObj[user.id];
    if(!userObj)
    {
        userObj = {
            __name__: user.username,
            __id__: user.id
        };
        serverObj[user.id] = userObj;
    }

    return userObj;
}
BigBrowser.prototype.setServerValue = function(server, name, value) {
    const obj = this.getServerObject(server);

    obj[name] = value;
    obj[name + '_date'] = Date.now();
}
BigBrowser.prototype.setUserValue = function(server, user, name, value) {
    const obj = this.getUserObject(server, user);

    obj[name] = value;
    obj[name + '_date'] = Date.now();
}
BigBrowser.prototype.increaseUserValue = function(server, user, name, value) {
    const obj = this.getUserObject(server, user);
    if(!obj[name])
        obj[name] = 0;
    
    obj[name] += value;
    obj[name + '_date'] = Date.now();
}
BigBrowser.prototype.clearServerProperty = function(server, propertyName) {
    const serverObj = this.servers[server.id];
    if(serverObj)
    {
        for(const key of serverObj.users)
        {
            const user = serverObj.users[key];

            delete user[propertyName];
            delete user[propertyName + '_date'];
        }
    }
}
BigBrowser.prototype.pingUserValue = function(server, user, name, ping) {
    if(ping)
        this.increaseUserValue(server, user, name, 1);
    this.increaseUserValue(server, user, name + '_total', 1);
}
BigBrowser.prototype.clearVocalActivity = function(server) {
    this.clearServerProperty(server, 'vocalActivity');
}
BigBrowser.prototype.pingWarframeActivity = function(server, user, ping) {
    this.pingUserValue(server, user, 'warframeActivity', ping);
}
BigBrowser.prototype.increaseVocalActivity = function(server, user, amount) {
    this.increaseUserValue(server, user, 'vocalActivity', amount);
}
BigBrowser.prototype.clearTextActivity = function(server) {
    this.clearServerProperty(server, 'textActivity');
}
BigBrowser.prototype.increaseTextActivity = function(server, user, amount) {
    this.increaseUserValue(server, user, 'textActivity', amount);
}
BigBrowser.prototype.setTracking = function(server, user, value) {
    this.setUserValue(server, user, 'tracking', !!value);
}
BigBrowser.prototype.setServerTracking = function(server, value) {
    this.setServerValue(server, 'tracking', !!value);
}
/*
BigBrowser.prototype.getTextSummaryOfUser = function(user) {
    const userServer = [];

    for(const key of Object.keys(this.servers))
    {
        const server = this.servers[key];
        const serverUser = server[user.id];
        
        if(serverUser)
        {
            userServer.push({
                server: server,
                user: serverUser
            });
        }
    }
}*/
BigBrowser.prototype.getTextSummaryByServer = function(server, markdown) {
    let text = '';
    const md = markdown !== false;

    if(server)
    {
        const nameTitle = 'Utilisateur';
        const vocalActivityTitle = 'Activité vocale';
        const textActivityTitle = 'Activité textuelle';
        const warframeActivityTitle = 'Activité Warframe';

        let maxNameSize = nameTitle.length;
        let maxVocalActivitySize = vocalActivityTitle.length;
        let maxTextActivitySize = textActivityTitle.length;
        let warframeActivity = warframeActivityTitle.length;

        const usersObj = this.servers[server.id || server.__id__ || server];
        
        if(usersObj)
        {
            if(usersObj.tracking === false)
            {
                return 'XP désactivé';
            }

            const users = Object.keys(usersObj)
                .filter(k => k[0] !== '_')
                .map(k => usersObj[k])
                .filter(user => user.tracking !== false)
                .filter(user => user.vocalActivity !== undefined && user.vocalActivity !== null || user.textActivity !== undefined && user.textActivity !== null)
                .sort((u1, u2) => (u1.vocalActivity || 0) > (u2.vocalActivity || 0) ? 1 : (u1.vocalActivity || 0) === (u2.vocalActivity || 0) ? 0 : -1);

            const formatTextAndDate = (text, date, time) => {
                let dateString;
                let dateObj = moment(date).tz('Europe/Paris');

                if(time === false)
                    dateString = dateObj.format('DD/MM/YYYY');
                else
                    dateString = dateObj.format('DD/MM/YYYY HH:mm');

                return `${text} (${dateString})`;
            }
            const formatValueAndDate = (value, date) => {
                if(!value)
                    return '0';
                value = Math.trunc(value);
                
                return formatTextAndDate(value + ' xp', date);
            }
            
            for(const user of users)
            {
                if(user.tracking !== false)
                {
                    if(maxNameSize < user.__name__.length)
                        maxNameSize = user.__name__.length;
                    if(user.vocalActivity !== undefined && user.vocalActivity !== null)
                    {
                        const str = formatValueAndDate(user.vocalActivity, user.vocalActivity_date);
                        if(maxVocalActivitySize < str.length)
                            maxVocalActivitySize = str.length;
                    }
                    if(user.textActivity !== undefined && user.textActivity !== null)
                    {
                        const str = formatValueAndDate(user.textActivity, user.textActivity_date);
                        if(maxTextActivitySize < str.length)
                            maxTextActivitySize = str.length;
                    }
                }
            }

            const pad = (value, nbChars, rightPadding, paddingChar) => {
                if(!paddingChar)
                    paddingChar = ' ';
                if(value === undefined || value === null)
                    value = 0;
                if(value.constructor === Number)
                    value = Math.trunc(value);
                value = value.toString();

                while(value.length < nbChars)
                {
                    if(rightPadding)
                        value = value + paddingChar;
                    else
                        value = paddingChar + value;
                }

                return value;
            };
            
            text += `${md ? '`' : ''}+ ${pad(nameTitle, maxNameSize)} | ${pad(vocalActivityTitle, maxVocalActivitySize)} | ${pad(textActivityTitle, maxTextActivitySize)} | ${pad(warframeActivityTitle, warframeActivity)} +${md ? '`' : ''}\r\n`;
            text += `${md ? '`' : ''}+-${pad('', maxNameSize, undefined, '-')}---${pad('', maxVocalActivitySize, undefined, '-')}---${pad('', maxTextActivitySize, undefined, '-')}---${pad('', warframeActivity, undefined, '-')}-+${md ? '`' : ''}\r\n`;

            if(users.length === 0)
            {
                return pad('Aucun résultat à afficher', (maxNameSize + maxVocalActivitySize + maxTextActivitySize + warframeActivity + 2 + 3 + 3 + 3 + 2) / 2);
            }
            else
            {
                for(const user of users)
                {
                    if(user.tracking !== false)
                    {
                        text += `${md ? '`' : ''}+ ${pad(user.__name__, maxNameSize)} | ${pad(formatValueAndDate(user.vocalActivity, user.vocalActivity_date), maxVocalActivitySize)} | ${pad(formatValueAndDate(user.textActivity, user.textActivity_date), maxTextActivitySize)} | ${pad(user.warframeActivity ? formatTextAndDate(Math.trunc(user.warframeActivity / user.warframeActivity_total * 100) + '%', user.warframeActivity_date, false) : 'N/A', warframeActivity)} +${md ? '`' : ''}\r\n`;
                    }
                }
            }

            text += `${md ? '`' : ''}+-${pad('', maxNameSize, undefined, '-')}---${pad('', maxVocalActivitySize, undefined, '-')}---${pad('', maxTextActivitySize, undefined, '-')}---${pad('', warframeActivity, undefined, '-')}-+${md ? '`' : ''}\r\n`;
        }
    }
    else
    {
        for(const key of Object.keys(this.servers))
        {
            const server = this.servers[key];
            
            if(server.tracking !== false)
            {
                const serverText = this.getTextSummaryByServer(server, markdown);

                text += `${md ? '**' : ''}[${server.__name__}]${md ? '**' : ''}\r\n${serverText}\r\n\r\n`;
            }
        }
    }

    return text.trim();
}
BigBrowser.prototype.getTextSummaryByServerCSV = function(server, withBOM) {
    let text = '';

    if(server)
    {
        const nameTitle = 'Utilisateur';
        const vocalActivityTitle = 'Activité vocale';
        const textActivityTitle = 'Activité textuelle';
        const warframeActivityTitle = 'Activité Warframe';

        const usersObj = this.servers[server.id || server.__id__ || server];
        
        if(usersObj)
        {
            const users = Object.keys(usersObj)
                .filter(k => k[0] !== '_')
                .map(k => usersObj[k])
                .filter(user => user.tracking !== false)
                .filter(user => user.vocalActivity !== undefined && user.vocalActivity !== null || user.textActivity !== undefined && user.textActivity !== null)
                .sort((u1, u2) => (u1.vocalActivity || 0) > (u2.vocalActivity || 0) ? 1 : (u1.vocalActivity || 0) === (u2.vocalActivity || 0) ? 0 : -1);

            const formatTextAndDate = (text, date, time) => {
                let dateString;
                let dateObj = moment(date).tz('Europe/Paris');

                if(time === false)
                    dateString = dateObj.format('DD/MM/YYYY');
                else
                    dateString = dateObj.format('DD/MM/YYYY HH:mm');

                return `${text} (${dateString})`;
            }
            const formatValueAndDate = (value, date) => {
                if(!value)
                    return '0';
                value = Math.trunc(value);
                
                return formatTextAndDate(value + ' xp', date);
            }

            text += `${nameTitle};${vocalActivityTitle};${textActivityTitle};${warframeActivityTitle}\r\n`;

            if(users.length === 0)
            {
                text = 'Aucun résultat à afficher\r\n';
            }
            else
            {
                for(const user of users)
                {
                    if(user.tracking !== false)
                    {
                        text += `${user.__name__};${formatValueAndDate(user.vocalActivity, user.vocalActivity_date)};${formatValueAndDate(user.textActivity, user.textActivity_date)};${user.warframeActivity ? formatTextAndDate(Math.trunc(user.warframeActivity / user.warframeActivity_total * 100) + '%', user.warframeActivity_date, false) : 'N/A'}\r\n`;
                    }
                }
            }
        }
    }
    else
    {
        for(const key of Object.keys(this.servers))
        {
            const server = this.servers[key];
            const serverText = this.getTextSummaryByServerCSV(server);

            text += `${server.__name__}\r\n${serverText}\r\n\r\n`;
        }
    }

    return (withBOM ? decodeURIComponent('%EF%BB%BF') : '') + text.trim();
}
BigBrowser.prototype.save = function() {
    return {
        servers: this.servers
    };
}
BigBrowser.prototype.load = function(obj, ctx) {
    this.servers = obj.servers;
}

module.exports = BigBrowser;
