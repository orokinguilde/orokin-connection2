import { Message, MessageEmbed } from "discord.js";
import config from "./config";

export class Help {
    public static instance = new Help();

    protected get info() {
        return config.server.info.help;
    }

    public get displayable() {
        return !this.info.displayIn || this.info.displayIn === process.env.APP_SELECTOR;
    }

    public get command() {
        return this.info.command;
    }
    
    protected static getRandomColor() {
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

    public get regex() {
        return new RegExp("^" + (config.server.info.help?.command ?? '!helpme') + "(?:\\s([^\\s]+))?$", 'img');
    }

    protected getInformationAbout(key: string = '') {
        key = Object.keys(this.info.data).find(k => k.trim().toLowerCase() === key.trim().toLowerCase());

        if(key !== undefined) {
            const data = this.info.data[key];

            if(data) {
                const _default = this.info.data._default;

                if(_default) {
                    for(const key in _default) {
                        if(data[key] === undefined) {
                            data[key] = _default[key];
                        }
                    }
                }

                return data;
            }
        }

        return undefined;
    }

    public manageMessage(message: Message, key?: string) {
        const embed = Help.instance.createEmbed(key);

        if(!embed) {
            message.reply(`Option '${key}' non reconnue`);
        } else {
            message.delete();
            message.channel.send({
                embeds: [ embed ]
            });
        }
    }

    public createEmbed(key?: string) {
        const info = this.getInformationAbout(key);

        if(info) {
            const embed = new MessageEmbed();

            embed.setColor(info.color ?? Help.getRandomColor());

            if(info.thumbnail) {
                embed.setThumbnail(info.thumbnail);
            }
            
            if(info.title) {
                embed.setAuthor(info.title, info.icon)
            }

            if(info.fields) {
                for(const key in info.fields) {
                    embed.addField(key, info.fields[key]);
                }
            }

            if(info.desc) {
                embed.setDescription(info.desc);
            }
            
            return embed;
        }

        return undefined;
    }
}
