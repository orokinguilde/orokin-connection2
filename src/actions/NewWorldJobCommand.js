"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewWorldJobCommand = void 0;
var discord_js_1 = require("discord.js");
var NewWorldJobCommand = /** @class */ (function () {
    function NewWorldJobCommand() {
    }
    NewWorldJobCommand.prototype.ask = function (channel, text) {
        return __awaiter(this, void 0, void 0, function () {
            var msgs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, channel.send(text)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, channel.awaitMessages({ filter: function () { return true; }, max: 1, time: 60000 * 5 })];
                    case 2:
                        msgs = _a.sent();
                        return [2 /*return*/, msgs.first().content.trim()];
                }
            });
        });
    };
    NewWorldJobCommand.prototype.askReaction = function (channel, title, options) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var embed, _i, options_1, option, msg, reactionsPromise, reaction;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        embed = new discord_js_1.MessageEmbed();
                        embed.setTitle(title);
                        for (_i = 0, options_1 = options; _i < options_1.length; _i++) {
                            option = options_1[_i];
                            embed.addField(option.name + " " + option.emoji, option.desc, true);
                        }
                        return [4 /*yield*/, channel.send({
                                embeds: [embed]
                            })];
                    case 1:
                        msg = _b.sent();
                        reactionsPromise = msg.awaitReactions({ filter: function (r) { return r.users.cache.size > 1; }, max: 1, time: 60000 });
                        options.forEach(function (o) { return msg.react(o.emoji); });
                        return [4 /*yield*/, reactionsPromise];
                    case 2:
                        reaction = (_b.sent()).first();
                        return [2 /*return*/, (_a = options.find(function (o) { return o.emoji === reaction.emoji.name; })) === null || _a === void 0 ? void 0 : _a.value];
                }
            });
        });
    };
    NewWorldJobCommand.prototype.execute = function (options, ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var channel, dm, metiers, defaultUserName, object, metier, quantite, urgence, objetsFournis, pseudo, comments, metierEntry, embed, requestMsg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ctx.message.delete();
                        return [4 /*yield*/, ctx.message.guild.channels.fetch(options.channel)];
                    case 1:
                        channel = _a.sent();
                        if (!channel) {
                            console.error("Le channel " + options.channel + " est introuvable.");
                            return [2 /*return*/];
                        }
                        if (!channel.isText()) {
                            console.error("Le channel " + options.channel + " doit \u00EAtre textuel.");
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, ctx.message.author.createDM()];
                    case 2:
                        dm = _a.sent();
                        metiers = [
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
                        defaultUserName = ctx.message.member.displayName;
                        return [4 /*yield*/, this.ask(dm, "Quel est l'objet dont vous avez besoin ?")];
                    case 3:
                        object = _a.sent();
                        return [4 /*yield*/, this.askReaction(dm, "Quel m\u00E9tier est concern\u00E9 ?", metiers)];
                    case 4:
                        metier = _a.sent();
                        return [4 /*yield*/, this.ask(dm, "Quelle quantit\u00E9 demandez-vous ?")];
                    case 5:
                        quantite = _a.sent();
                        return [4 /*yield*/, this.ask(dm, "Quelle est l'urgence de la commande ? (\"-\" = pas urgent)")];
                    case 6:
                        urgence = _a.sent();
                        return [4 /*yield*/, this.ask(dm, "Quels objects fournissez-vous ? (\"-\" = aucun)")];
                    case 7:
                        objetsFournis = _a.sent();
                        return [4 /*yield*/, this.ask(dm, "Quel est votre pseudo in-game ? (\"-\" = " + defaultUserName + ")")];
                    case 8:
                        pseudo = _a.sent();
                        return [4 /*yield*/, this.ask(dm, "Des commentaires \u00E0 ajouter ? (\"-\" = aucun)")];
                    case 9:
                        comments = _a.sent();
                        metierEntry = metiers.find(function (m) { return m.value === metier; });
                        embed = new discord_js_1.MessageEmbed();
                        embed.setTitle(metierEntry.emoji + " " + object + " [quantit\u00E9 : " + quantite + "]");
                        embed.addField('Pseudo', pseudo === '-' ? defaultUserName : pseudo, true);
                        embed.addField('Urgence', urgence === '-' ? 'Aucune' : urgence, true);
                        if (objetsFournis !== '-') {
                            embed.addField('Objet(s) fourni(s)', objetsFournis);
                        }
                        if (comments !== '-') {
                            embed.addField('Commentaire(s)', comments);
                        }
                        embed.setFooter('✅ Je prends | ❎ Je ne prends pas | ✳️ Je peux prendre si necessaire');
                        return [4 /*yield*/, channel.send({
                                embeds: [embed],
                                content: "<@&" + metier + ">"
                            })];
                    case 10:
                        requestMsg = _a.sent();
                        return [4 /*yield*/, requestMsg.react('✅')];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, requestMsg.react('❎')];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, requestMsg.react('✳️')];
                    case 13:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return NewWorldJobCommand;
}());
exports.NewWorldJobCommand = NewWorldJobCommand;
