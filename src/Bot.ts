import { Client, TextChannel, GuildChannel, Collection, Message } from "discord.js";

export abstract class IBot {
    public constructor(options) {
        if(!options)
            options = {};
        
        this.options = options;

        if(!this.noAutoInitialization)
            this.initialize();
    }
    
    private _onReady;
    public options;
    public noAutoInitialization;
    public client: Client;
    public debug = false;

    public abstract save(): any
    public abstract _load(obj: any, ctx: any): void

    public load(obj: any) {
        const ctx = {
            bot: this
        };

        this._load(obj, ctx);
    }

    public start(token: string = this.options.token) {
        this.client.login(token);

        setInterval(() => {
            if(global.gc) {
                console.log('Start GC');
                global.gc();
                console.log('GC executed');
            } else {
                console.log('GC not available for manual triggering');
            }
        }, 1000 * 60);
    }

    public static findGeneralChannel(channels: Collection<string, GuildChannel>): TextChannel {
        const channelNames = [
            /^[^a-zA-Z0-9]*g[eé]n[eé]ral[^a-zA-Z0-9]*$/img,
            /^[^a-zA-Z0-9]*discussion[^a-zA-Z0-9]*$/img,
            /^[^a-zA-Z0-9]*warframe[^a-zA-Z0-9]*$/img
        ];
        
        const matchingChannels = channels
            .filter(channel => channel.constructor.name === 'TextChannel')
            .filter(channel => channelNames.some(regex => regex.test(channel.name)))
            .array();
                    
        if(matchingChannels.length > 0) {
            const firstMatchingChannel = matchingChannels[0];
            return firstMatchingChannel as TextChannel;
        } else {
            return undefined;
        }
    }
    
    public static isAdmin(member) {
        return member.hasPermission('ADMINISTRATOR');
    }

    public static adminOnly(message, callback) {
        if(IBot.isAdmin(message.member)) {
            callback();
        } else {
            message.reply(':small_orange_diamond: Tu n\'as pas les droits pour cette commande');
        }
    }

    protected abstract onMessage(message: Message, checkForCommand: (regexCmd: RegExp) => boolean, params: string[]): void;

    protected abstract _initialize(): void;
    
    public initialize() {
        const client = new Client();
        this.client = client;

        const managerRoleByMessage = (message, user, callback) => {
            if(message.message.channel.name === 'éditez-vos-grades' || message.message.channel.id.toString() === '532671748059955200')
            {
                const guild = message.message.guild;

                guild.fetchMember(user).then((member) => {
                    callback(member, message.message.mentions.roles);
                }).catch(() => {});
            }
        }
        
        this.client.on('raw', packet => {
            // We don't want this to run on unrelated packets
            if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
            // Grab the channel to check the message from
            const channel = this.client.channels.get(packet.d.channel_id) as TextChannel;
            // There's no need to emit if the message is cached, because the event will fire anyway for that
            if (channel.messages.has(packet.d.message_id)) return;
            // Since we have confirmed the message is not cached, let's fetch it
            channel.fetchMessage(packet.d.message_id).then(message => {
                // Emojis can have identifiers of name:id format, so we have to account for that case as well
                const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
                // This gives us the reaction we need to emit the event properly, in top of the message object
                const reaction = message.reactions.get(emoji);
                // Check which type of event it is before emitting
                if (packet.t === 'MESSAGE_REACTION_ADD') {
                    this.client.emit('messageReactionAdd', reaction, this.client.users.get(packet.d.user_id));
                }
                if (packet.t === 'MESSAGE_REACTION_REMOVE') {
                    this.client.emit('messageReactionRemove', reaction, this.client.users.get(packet.d.user_id));
                }
            });
        });

        client.on('messageReactionAdd', (message, user) => {
            managerRoleByMessage(message, user, (member, roles) => {
                member.addRoles(roles);
            })
        })

        client.on('messageReactionRemove', (message, user) => {
            managerRoleByMessage(message, user, (member, roles) => {
                member.removeRoles(roles);
            })
        })
        
        client.on('raw', packet => {
            // We don't want this to run on unrelated packets
            if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
            // Grab the channel to check the message from
            const channel = client.channels.get(packet.d.channel_id) as TextChannel;
            // There's no need to emit if the message is cached, because the event will fire anyway for that
            if (channel.messages.has(packet.d.message_id)) return;
            // Since we have confirmed the message is not cached, let's fetch it
            channel.fetchMessage(packet.d.message_id).then(message => {
                // Emojis can have identifiers of name:id format, so we have to account for that case as well
                const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
                // This gives us the reaction we need to emit the event properly, in top of the message object
                const reaction = message.reactions.get(emoji);
                // Check which type of event it is before emitting
                if (packet.t === 'MESSAGE_REACTION_ADD') {
                    client.emit('messageReactionAdd', reaction, client.users.get(packet.d.user_id));
                }
                if (packet.t === 'MESSAGE_REACTION_REMOVE') {
                    client.emit('messageReactionRemove', reaction, client.users.get(packet.d.user_id));
                }
            });
        });

        client.on('message', message => {
            const params: string[] = [];

            const checkForCommand = (regexCmd: RegExp) => {
                const localParams = regexCmd.exec(message.content);
                if(localParams) {
                    for(let i = 0; i < localParams.length; ++i) {
                        params[i] = localParams[i];
                    }
                }

                return !!localParams;
            };
            
            if(this.debug) {
                if(message.content[0] !== '@')
                    return;
                
                message.content = message.content.slice(1);
            }

            this.onMessage(message, checkForCommand, params);
        });

        client.on('error', (value) => {
            console.error(value);
        });
        client.on('warn', (value) => {
            console.log(value);
        });

        client.on('ready', () => {
            console.log('READY');

            this.ready();

            if(this._onReady)
                this._onReady(() => this.startRuntime());
            else
                this.startRuntime();
        })
    }

    protected abstract ready(): void;

    protected abstract startRuntime(): void;

    public onReady(fn) {
        this._onReady = fn;
    }
}
