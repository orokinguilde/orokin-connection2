import { Client, TextChannel, GuildChannel, Message, Intents, GuildMember, PartialMessageReaction, MessageReaction, PartialUser, User, MessageOptions, PartialGuildMember } from "discord.js";
import config, { IConfigMemberChange, isDebug } from "./config";
import { ActionsManagerV2 } from "./actions/ActionsManagerV2";
import { ErrorManager } from "./ErrorManager";

export abstract class IBot {
    public constructor(options) {
        if(!options)
            options = {};
        
        this.options = options;

        if(!this.noAutoInitialization)
            this.initialize();
    }
    
    private _onReady?: (callback: () => void) => void;
    public options;
    public noAutoInitialization;
    public client: Client;
    public get debug() {
        return isDebug;
    }

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

        /*
        setInterval(() => {
            if(global.gc) {
                console.log('Start GC');
                global.gc();
                console.log('GC executed');
            } else {
                console.log('GC not available for manual triggering');
            }
        }, 1000 * 60);*/
    }

    public static findGeneralChannel(channels: GuildChannel[]): TextChannel {
        const channelNames = [
            /^[^a-zA-Z0-9]*g[eé]n[eé]ral[^a-zA-Z0-9]*$/img,
            /^[^a-zA-Z0-9]*discussion[^a-zA-Z0-9]*$/img,
            /^[^a-zA-Z0-9]*warframe[^a-zA-Z0-9]*$/img
        ];
        
        const matchingChannels = channels
            .filter(channel => channel.constructor.name === 'TextChannel')
            .filter(channel => channelNames.some(regex => regex.test(channel.name)))
            [0];
            
        return matchingChannels as TextChannel;
    }
    
    public static isAdmin(member: GuildMember) {
        return member.permissions.has('ADMINISTRATOR');
    }

    public static adminOnly(message: Message, callback) {
        if(IBot.isAdmin(message.member)) {
            callback();
        } else {
            message.reply(':small_orange_diamond: Tu n\'as pas les droits pour cette commande');
        }
    }

    protected abstract onMessage(message: Message, checkForCommand: (regexCmd: RegExp) => boolean, params: string[]): void;

    protected abstract _initialize(): void;
    
    public initialize() {
        const client = new Client({
            intents: [
                Intents.FLAGS.DIRECT_MESSAGES,
                Intents.FLAGS.DIRECT_MESSAGE_TYPING,
                Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.GUILD_MEMBERS,
                Intents.FLAGS.GUILD_PRESENCES,
                Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
                Intents.FLAGS.GUILD_VOICE_STATES
            ],
            restTimeOffset: 0
        });
        this.client = client;

        client.on('raw', async packet => {
            // We don't want this to run on unrelated packets
            if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
            // Grab the channel to check the message from
            const channel = client.channels.cache.get(packet.d.channel_id);
            
            if(channel instanceof TextChannel && channel.isText()) {
                // There's no need to emit if the message is cached, because the event will fire anyway for that
                if (channel.messages.cache.has(packet.d.message_id)) return;
                // Since we have confirmed the message is not cached, let's fetch it
                channel.messages.fetch(packet.d.message_id).then(message => {
                    // Emojis can have identifiers of name:id format, so we have to account for that case as well
                    const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
                    // This gives us the reaction we need to emit the event properly, in top of the message object
                    const reaction = message.reactions.cache.get(emoji);
                    // Adds the currently reacting user to the reaction's users collection.
                    if (reaction) reaction.users.cache.set(packet.d.user_id, client.users.cache.get(packet.d.user_id));
                    // Check which type of event it is before emitting
                    if (packet.t === 'MESSAGE_REACTION_ADD') {
                        client.emit('messageReactionAdd', reaction, client.users.cache.get(packet.d.user_id));
                    }
                    if (packet.t === 'MESSAGE_REACTION_REMOVE') {
                        client.emit('messageReactionRemove', reaction, client.users.cache.get(packet.d.user_id));
                    }
                });
            }
        });

        const managerRoleByMessage = (message: MessageReaction | PartialMessageReaction, user: User | PartialUser, callback) => {
            const channel = message?.message?.channel;
            if(channel && channel instanceof TextChannel && (channel.name === 'éditez-vos-grades' || channel.id.toString() === '532671748059955200')) {
                const guild = message.message.guild;

                callback(user, message.message.mentions.roles);
            }
        }

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

        client.on('messageCreate', message => {
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

            if(!this.actionsManagerV2.catchMessage(message, checkForCommand, params)) {
                try {
                    this.onMessage(message, checkForCommand, params);
                } catch(ex) {
                    ErrorManager.instance.error('Bot', ex);
                }
            }
        });

        client.on('error', (value) => {
            console.error(value);
        });
        client.on('warn', (value) => {
            console.log(value);
        });
        
        if(config.server.info.memberChange && config.server.info.memberChange.on === process.env.APP_SELECTOR) {
            const execMemberChange = async (member: GuildMember | PartialGuildMember, actions: IConfigMemberChange[]) => {
                const guilds = this.client.guilds.valueOf().map(g => g);
                
                for(const action of actions) {
                    const messageOptions: MessageOptions = {
                        content: action.message,
                        embeds: action.embeds
                    };
    
                    if(action.channelId) {
                        for(const guild of guilds) {
                            const channel = await guild.channels.fetch(action.channelId);
    
                            if(channel) {
                                if(channel.isText()) {
                                    channel.send(messageOptions);
                                }
                                break;
                            }
                        }
                    } else {
                        member.send(messageOptions);
                    }
                }
            }
            if(config.server.info.memberChange.add && config.server.info.memberChange.add.length > 0) {
                client.on('guildMemberAdd', async member => execMemberChange(member, config.server.info.memberChange.add));
            }
            if(config.server.info.memberChange.remove && config.server.info.memberChange.remove.length > 0) {
                client.on('guildMemberRemove', async member => execMemberChange(member, config.server.info.memberChange.remove));
            }
        }

        client.on('ready', () => {
            console.log('READY');

            const botName = config.server.info.name;

            if(botName) {
                client.user.setUsername(botName);
            }

            this.ready();

            if(this._onReady) {
                this._onReady(() => this.startRuntime());
            } else {
                this.startRuntime();
            }
        })
    }

    protected abstract ready(): void;

    protected actionsManagerV2 = new ActionsManagerV2(this);

    protected startRuntime(): void {
        this._startRuntime();
        
        this.actionsManagerV2.createTickers();
    }
    protected abstract _startRuntime(): void;

    public onReady(fn: (callback: () => void) => void) {
        this._onReady = fn;
    }
}
