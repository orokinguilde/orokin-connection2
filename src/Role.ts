
export class Role {
    constructor(nameOrFilter, guild) {
        this.guild = guild;

        if(typeof nameOrFilter === 'function') {
            this.filter = nameOrFilter;
        } else {
            this.name = nameOrFilter;
            this.filter = role => this.name.trim().split(/\s+/img).every(part => role.name.toLowerCase().indexOf(part) >= 0);
        }
    }

    name;
    guild;
    filter;

    _role;
    get role() {
        if(!this._role && this.guild) {
            this._role = this.guild.roles.find(this.filter);
        }
        
        return this._role;
    }
    set role(value) {
        this._role = value;
    }

    cloneForGuild(guild) {
        return new Role(this.name || this.filter, guild);
    }
}

