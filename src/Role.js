"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = void 0;
var Role = /** @class */ (function () {
    function Role(nameOrFilter, guild) {
        var _this = this;
        this.guild = guild;
        if (typeof nameOrFilter === 'function') {
            this.filter = nameOrFilter;
        }
        else {
            this.name = nameOrFilter;
            this.filter = function (role) { return _this.name.trim().split(/\s+/img).every(function (part) { return role.name.toLowerCase().indexOf(part) >= 0; }); };
        }
    }
    Object.defineProperty(Role.prototype, "role", {
        get: function () {
            if (!this._role && this.guild) {
                this._role = this.guild.roles.find(this.filter);
            }
            return this._role;
        },
        set: function (value) {
            this._role = value;
        },
        enumerable: false,
        configurable: true
    });
    Role.prototype.cloneForGuild = function (guild) {
        return new Role(this.name || this.filter, guild);
    };
    return Role;
}());
exports.Role = Role;
