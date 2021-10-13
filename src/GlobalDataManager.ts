
export interface IGlobalDataManagerEntry {
    name: string
    getter: () => Promise<string>
}

export class GlobalDataManager {
    public static instance = new GlobalDataManager();

    protected entries: IGlobalDataManagerEntry[] = [];
    
    public register(name: string, getter: () => Promise<string>) {
        this.entries.push({
            name: name,
            getter: getter
        })
    }

    public async get(name: string): Promise<string[]>
    public async get(name: string, join: string): Promise<string>
    public async get(name: string, join?: string) {
        const values = await Promise.all(this.entries
            .filter(e => e.name === name)
            .map(e => e.getter()))

        if(join) {
            return values.join(join);
        } else {
            return values;
        }
    }
}
