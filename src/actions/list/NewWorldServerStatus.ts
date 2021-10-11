import * as request from 'request';

export class NewWorldServerStatus {
    public getServerUpState(serverName: string = 'Bifrost'): Promise<'up' | 'down' | 'full' | 'maintenance'> {
        return new Promise((resolve, reject) => {
            request('https://www.newworld.com/en-gb/support/server-status', (e, res, body) => {
                const bodyStr: string = body.toString();
    
                const indexBifrost = bodyStr.toLowerCase().indexOf(serverName.toLowerCase());
                const index = bodyStr.lastIndexOf('<', indexBifrost);
                const indexEnd = bodyStr.lastIndexOf('"', index);
                const indexStart = bodyStr.lastIndexOf('-', indexEnd) + 1;
    
                const str = bodyStr.substring(indexStart, indexEnd);

                resolve(str as any);
            })
        })
    }
}
