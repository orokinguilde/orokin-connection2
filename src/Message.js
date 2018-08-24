const ExecutionPool = require('./ExecutionPool');
const findById = require('./globals').findById;
const globals = require('./globals');

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
            globals.saver.save();
            
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
            this.channel.fetchMessage(obj.message).then((msg) => this.msg = msg)
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

module.exports = Message;
