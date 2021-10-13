
export interface IErrorManagerEntry {
    domain: string
    error: string
}

export class ErrorManager {
    public static instance = new ErrorManager();

    public errorList: IErrorManagerEntry[] = [];
    public errorListMax: number = 15;

    public load(obj: any) {
        if(obj) {
            this.errorList = obj.errorList ?? this.errorList
        }
    }

    public save() {
        return {
            errorList: this.errorList
        }
    }

    public error(domain: string, error: any) {
        if(error) {
            if(this.errorList.length > this.errorListMax) {
                this.errorList.pop();
            }

            this.errorList.unshift({
                domain: domain,
                error: error.toString()
            });
        }
    }

    public async wrapPromise(domain: string, content: Promise<any>) {
        try {
            return await content;
        } catch(ex) {
            this.error(domain, ex);
        }
    }
    public async wrapAsync(domain: string, content: () => Promise<any>) {
        try {
            return await content();
        } catch(ex) {
            this.error(domain, ex);
        }
    }
}
