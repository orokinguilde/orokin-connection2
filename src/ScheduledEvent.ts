import * as moment from 'moment'
import { Guild, TextChannel, RichEmbed, Channel } from 'discord.js';
import { BigBrowserV2 } from './BigBrowserV2';

export interface ScheduledEventContext {
    periodMs: number
}
export abstract class ScheduledEvent {
    public get enabled(): boolean {
        return true;
    }

    public get periodMs(): number {
        return 1000;
    }

    public refreshPeriod() {
    }

    public abstract runtime(ctx: ScheduledEventContext): void;

    public nbErrors = 0;
    public nbErrorsMax = 10;

    public start() {
        if(this.nbErrors > this.nbErrorsMax) {
            console.error('Shuting down scheduled event because of too many errors');
            return;
        }

        this.refreshPeriod();
        const periodMs = this.periodMs;

        setTimeout(() => {
            try {
                if(this.enabled) {
                    this.runtime({
                        periodMs: periodMs
                    });
                    this.nbErrors = 0;
                }
            } catch(ex) {
                ++this.nbErrors;
                console.error(ex);
            } finally {
                this.start();
            }
        }, periodMs);
    }
}

export class XPBonusScheduledEvent extends ScheduledEvent {
    public constructor(public readonly guild: Guild, public readonly bigBrowser: BigBrowserV2, serialized?: any) {
        super();

        if(serialized) {
            this.load(serialized);
        }
    }

    public save() {
        return {
            guildId: this.guild.id,
            channelIds: this.channelIds,
            active: this.active,
            xpBonusOnReact: this.xpBonusOnReact,
            xpBonusOnPopUp: this.xpBonusOnPopUp,
            periodMsMax: this.periodMsMax,
            periodMsMin: this.periodMsMin
        }
    }

    public load(obj: any) {
        this.channelIds = obj.channelIds || {};
        this.active = obj.active ?? false;
        this._periodMsMin = obj.periodMsMin;
        this._periodMsMax = obj.periodMsMax;
        this._xpBonusOnPopUp = obj.xpBonusOnPopUp;
        this._xpBonusOnReact = obj.xpBonusOnReact;
    }

    public active = false;

    public get enabled() {
        const dayOfWeek = (moment().day() - 1 + 7) % 7;
        const isWeekend = dayOfWeek >= 6;

        return this.active && isWeekend;
    }

    private _periodMsMin: number
    public get periodMsMin() {
        return Math.max(this.messageTimeoutMs, this._periodMsMin ?? 1000 * 20);
    }
    public set periodMsMin(value) {
        this._periodMsMin = value;
    }

    private _periodMsMax: number
    public get periodMsMax() {
        return Math.max(this.messageTimeoutMs,  this._periodMsMax ?? 1000 * 60 * 60 * 3);
    }
    public set periodMsMax(value) {
        this._periodMsMax = value;
    }

    private _xpBonusOnPopUp: number
    public get xpBonusOnPopUp() {
        return this._xpBonusOnPopUp ?? 5;
    }
    public set xpBonusOnPopUp(value) {
        this._xpBonusOnPopUp = value;
    }

    private _xpBonusOnReact: number
    public get xpBonusOnReact() {
        return this._xpBonusOnReact ?? 5;
    }
    public set xpBonusOnReact(value) {
        this._xpBonusOnReact = value;
    }
    
    public messageTimeoutSec = 10;

    public get messageTimeoutMs() {
        return this.messageTimeoutSec * 1000;
    }

    public refreshPeriod() {
        this._periodMs = Math.random() * (this.periodMsMax - this.periodMsMin) + this.periodMsMin;
    }

    private _periodMs: number;
    public get periodMs() {
        if(this._periodMs === undefined) {
            this.refreshPeriod();
        }

        return this._periodMs;
    }

    public channelIds: { [id: string]: true } = {};

    public get channels(): readonly TextChannel[] {
        return Object.keys(this.channelIds).map(id => this.guild.channels.find(c => c.id === id) as TextChannel);
    }

    public addChannel(channel: TextChannel) {
        this.channelIds[channel.id] = true;
    }
    public removeChannel(channel: Channel) {
        delete this.channelIds[channel.id];
    }

    public pickRandomChannel() {
        const channels = this.channels;

        return channels[Math.floor(Math.random() * channels.length)];
    }

    public async runtime(ctx: ScheduledEventContext) {
        const channel = this.pickRandomChannel();
        if(channel) {

            for(const m of this.guild.members.array()) {
                if(m.voiceChannelID) {
                    const user = this.bigBrowser.getUser(m);
                    user.addXPBonus(this.xpBonusOnPopUp);
                }
            }

            const message = await channel.send(new RichEmbed({
                image: {
                    url: 'https://media.discordapp.net/attachments/514178068835860498/718771722307764314/XP-bonus.gif'
                }
            }));

            setTimeout(() => {
                
                const userIds: { [id: string]: true } = {};
                for(const reaction of message.reactions.array()) {
                    for(const user of reaction.users.array()) {
                        userIds[user.id] = true;
                    }
                }

                const users = Object.keys(userIds)
                    .map(id => this.bigBrowser.getUserById(message.guild, id));

                for(const user of users) {
                    user.addXPBonus(this.xpBonusOnReact);
                }

                message.delete();

            }, this.messageTimeoutMs);
        }
    }
}
