
function Mentoring()
{ }

Mentoring.prototype.getServers = function()
{
    if(!this.servers)
        this.servers = {};
    
    return this.servers;
}

Mentoring.prototype.getServer = function(guild)
{
    const servers = this.getServers();
    const now = Date.now();

    const serverId = guild.id;

    let server = servers[serverId];
    if(!server)
    {
        server = {
            id: serverId,
            name: guild.name,
            createDate: now,
            users: {}
        };

        servers[serverId] = server;
    }
    
    return server;
}
Mentoring.prototype.getUserById = function(id, guild)
{
    return this.getServer(guild).users[id];
}
Mentoring.prototype.getUser = function(member)
{
    const now = Date.now();

    const id = member.id;
    const server = this.getServer(member.guild);

    if(!server.users)
        server.users = {};

    let user = server.users[id];
    if(!user)
    {
        user = {
            id: id,
            createDate: now
        };
        server.users[id] = user;
    }
    
    user.lastUpdate = now;
    user.displayName = member.displayName;
    user.name = member.nickname;

    if(member.bot !== undefined)
        user.isBot = member.bot;
    if(member.user && member.user.bot !== undefined)
        user.isBot = member.user.bot;
    
    if(!user.mentors)
        user.mentors = {};
    if(!user.disciples)
        user.disciples = {};
    if(user.mentoringSuccess === undefined)
        user.mentoringSuccess = 0;

    return user;
}

Mentoring.prototype.hasMentorsLoop = function(disciple, guild, refs) {
    refs = refs || {};

    for(const id in disciple.mentors)
    {
        if(refs[id])
            return true;
        refs[id] = true;

        const mentor = this.getUserById(id, guild);

        if(this.hasMentorsLoop(mentor, guild, refs))
            return true;
    }

    return false;
}

Mentoring.prototype.setDisciple = function(mentor, disciple) {
    return this.setMentor(mentor, disciple);
}
Mentoring.prototype.setMentor = function(mentor, disciple) {
    const discipleUser = this.getUser(disciple);
    const mentorUser = this.getUser(mentor);
    const guild = mentor.guild;
    const now = Date.now();

    if(mentorUser.isBot || discipleUser.isBot)
        return false; // le mentor ou le disciple est un bot

    if(mentorUser.id === discipleUser.id)
        return false; // fait référence à lui-même

    if(mentorUser.disciples[discipleUser.id])
        return false; // le disciple est deja son disciple

    if(mentorUser.mentors[discipleUser.id])
        return false; // le disciple est mentor du mentor

    if(Object.keys(discipleUser.mentors).length > 0)
        return false; // le disciple a deja des mentors (= 1 seul mentor autorisé par disciple)

    discipleUser.mentors[mentorUser.id] = {
        id: mentorUser.id,
        date: now
    };

    if(this.hasMentorsLoop(discipleUser, guild))
    {
        delete discipleUser.mentors[mentorUser.id];
        delete mentorUser.disciples[discipleUser.id];
        return false;
    }

    mentorUser.disciples[discipleUser.id] = {
        id: discipleUser.id,
        date: now
    };

    for(let id in mentorUser.mentors)
    {
        const mentorOfMentor = this.getUserById(id, guild);
        ++mentorOfMentor.mentoringSuccess;
    }

    return true;
}

Mentoring.prototype.save = function() {
    return {
        servers: this.servers
    };
}
Mentoring.prototype.load = function(obj, ctx) {
    this.servers = obj.servers;
}

module.exports = Mentoring;
