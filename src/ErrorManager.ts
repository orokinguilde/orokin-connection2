
export interface IErrorManagerEntry {
    domain: string
    error: any
}

export class ErrorManager {
    public static instance = new ErrorManager();

    public errorList: IErrorManagerEntry[] = [];
    public errorListMax: number = 30;

    public error(domain: string, error: any) {
        if(error) {
            if(this.errorList.length > this.errorListMax) {
                this.errorList.pop();
            }

            this.errorList.unshift({
                domain: domain,
                error: error
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
