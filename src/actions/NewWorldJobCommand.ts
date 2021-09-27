import { DMChannel, MessageEmbed } from "discord.js";
import { IAction, IActionCtx } from "../ActionsManager";

export interface INewWorldJobCommandOptions {
    channel: string
}

export class NewWorldJobCommand implements IAction {
    protected async ask(channel: DMChannel, text: string) {
        await channel.send(text);
        const msgs = await channel.awaitMessages({ filter: () => true, max: 1, time: 60000 * 5 });
        return msgs.first().content.trim();
    }

    protected async askReaction(channel: DMChannel, title: string, options: { name: string, desc: string, emoji: string, value: string }[]) {
        const embed = new MessageEmbed();
        embed.setTitle(title);

        for(const option of options) {
            embed.addField(`${option.name} ${option.emoji}`, option.desc, true);
        }

        const msg = await channel.send({
            embeds: [ embed ]
        });
        
        const reactionsPromise = msg.awaitReactions({ filter: (r) => r.users.cache.size > 1, max: 1, time: 60000 });

        options.forEach(o => msg.react(o.emoji));

        const reaction = (await reactionsPromise).first();
        return options.find(o => o.emoji === reaction.emoji.name)?.value;
    }

    public async execute(options: INewWorldJobCommandOptions, ctx: IActionCtx) {
        ctx.message.delete();

        const channel = await ctx.message.guild.channels.fetch(options.channel);

        if(!channel) {
            console.error(`Le channel ${options.channel} est introuvable.`);
            return;
        }
        if(!channel.isText()) {
            console.error(`Le channel ${options.channel} doit être textuel.`);
            return;
        }

        const dm = await ctx.message.author.createDM();

        const metiers = [
            { "name": "Ameublement", "desc": "Meubles, Espaces de rangement et Trophées.", "value": "891052471806459934", "emoji": "🪑" },
            { "name": "Arts obscurs", "desc": "Potions, Armes magiques et Teintures.", "value": "891054049363910727", "emoji": "⚗️" },
            { "name": "Cuisine", "desc": "Repas et Boissons.", "value": "891054145287630859", "emoji": "🍽️" },
            { "name": "Forge d'armes", "desc": "Épées, Rapières, Haches, Marteaux de guerre et Boucliers.", "value": "891054199587094628", "emoji": "⚔️" },
            { "name": "Forge d'armures", "desc": "Toutes armures et Sacs de stockage.", "value": "891054246672363540", "emoji": "🛡️" },
            { "name": "Ingénierie", "desc": "Arcs, Mousquets, Outils de metiers et Munitions.", "value": "891054289055793162", "emoji": "🛠️" },
            { "name": "Joaillerie", "desc": "Amulettes, Anneaux et Boucles d'oreille.", "value": "891054329891553291", "emoji": "💎" },
            { "name": "Mineur", "desc": "Minerais, Huiles et Essences.", "value": "891054387634520144", "emoji": "⛏️" },
            { "name": "Dépeceur", "desc": "Peaux et Viandes.", "value": "891054423596498945", "emoji": "🔪" },
            { "name": "Pêcheur", "desc": "Poissons et Poissons spéciaux.", "value": "891054452591702076", "emoji": "🎣" },
            { "name": "Bûcheron", "desc": "Bois et ressources rares liées aux arbres.", "value": "891054492743770162", "emoji": "🪓" },
            { "name": "Cueilleur", "desc": "Plantes, Fibres et Plantes magiques.", "value": "891054537840934932", "emoji": "🌿" },
            { "name": "Tailleur de pierres", "desc": "Gemmes taillées, Emplacements et Briques.", "value": "891054578102075432", "emoji": "🪨" },
            { "name": "Travail du cuir", "desc": "Cuir pour armes et armures.", "value": "891054609693565060", "emoji": "🐂" },
            { "name": "Fondeur", "desc": "Lingots pour armes et armures.", "value": "891054651720466522", "emoji": "🧱" },
            { "name": "Couture", "desc": "Tissus pour armures et sacs.", "value": "891054684519940116", "emoji": "🪡" },
            { "name": "Travail du bois", "desc": "Pour Ingénierie et Projets de ville.", "value": "891054725682855996", "emoji": "🪵" }
        ];

        const defaultUserName = ctx.message.member.displayName;

        const object = await this.ask(dm, `Quel est l'objet dont vous avez besoin ?`);
        const metier = await this.askReaction(dm, `Quel métier est concerné ?`, metiers);
        const quantite = await this.ask(dm, `Quelle quantité demandez-vous ?`);
        const urgence = await this.ask(dm, `Quelle est l'urgence de la commande ? ("-" = pas urgent)`);
        const objetsFournis = await this.ask(dm, `Quels objects fournissez-vous ? ("-" = aucun)`);
        const pseudo = await this.ask(dm, `Quel est votre pseudo in-game ? ("-" = ${defaultUserName})`);
        const comments = await this.ask(dm, `Des commentaires à ajouter ? ("-" = aucun)`);

        const metierEntry = metiers.find(m => m.value === metier);

        const embed = new MessageEmbed();

        embed.setTitle(`${metierEntry.emoji} ${object} [quantité : ${quantite}]`);

        embed.addField('Pseudo', pseudo === '-' ? defaultUserName : pseudo, true);
        embed.addField('Urgence', urgence === '-' ? 'Aucune' : urgence, true);

        if(objetsFournis !== '-') {
            embed.addField('Objet(s) fourni(s)', objetsFournis);
        }

        if(comments !== '-') {
            embed.addField('Commentaire(s)', comments);
        }

        embed.setFooter('✅ Je prends | ❎ Je ne prends pas | ✳️ Je peux prendre si necessaire');

        const requestMsg = await channel.send({
            embeds: [ embed ],
            content: `<@&${metier}>`
        })

        await requestMsg.react('✅');
        await requestMsg.react('❎');
        await requestMsg.react('✳️');
    }
}
