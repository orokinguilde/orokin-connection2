import { IStorage } from "./storage/IStorage";
import { StorageFile } from './storage/StorageFile';
//import { StorageSQL } from './storage/StorageSQL';
import * as moment from 'moment-timezone'
import config from "./config";
import { ErrorManager } from "./ErrorManager";

//const StorageSystem = StorageSQL;
const StorageSystem = StorageFile

export class Saver {
    public constructor(fileId: string, object: any, fileIdFallback: string) {
        const muter = (fileId: string) => fileId.replace('/', `/${config.server.fsFriendlyName}_`);

        if(fileId) {
            this.file = new StorageSystem(muter(fileId));
            this.fileFallback = fileIdFallback && new StorageSystem(muter(fileIdFallback));
        }
        
        this.object = object;
    }

    protected file: IStorage;
    protected fileFallback: IStorage;
    protected object: any;
    protected pendingSave: any[] = [];
    protected lastData: any;

    public dataCreationDate: number = Date.now();

    public toJSON = function() {
        return {
            file: this.file,
            pendingSave: this.pendingSave
        }
    }
    
    public startAutosave() {
        this.forceSave(() => {
            setTimeout(() => this.startAutosave(), 10000);
        });
    }

    protected forceSave(callback: () => void) {
        if(this.file) {
            const obj = this.object.save();
            obj._ErrorManager = ErrorManager.instance.save();
            obj.___save = {
                dateStr: moment().format(),
                date: Date.now(),
                dataCreationDate: this.dataCreationDate
            }

            const data = JSON.stringify(obj);

            this.file.setContent(data, () => callback && callback())
        } else {
            callback && process.nextTick(callback);
        }
    }

    public load(callback: () => void) {
        if(!this.file) {
            callback && process.nextTick(callback);

            return;
        }

        const load = (e, data) => {
            let dataLoaded = false;

            if(data) {
                console.log(`**************`);
                console.log('Data info :', data.___save);
                
                for(const propName in data) {
                    console.log(`${propName}: ${JSON.stringify(data[propName]).length} chars`);
                }
                console.log(`**************`);

                this.dataCreationDate = data.___save?.dataCreationDate || this.dataCreationDate;
                this.object.load(data);
                ErrorManager.instance.load(data?._ErrorManager);
                dataLoaded = true;
            }

            if(dataLoaded) {
                console.log('Data loaded.');
            } else {
                console.error('Impossible to load the data.');
            }

            if(callback) {
                callback();
            }

            setTimeout(() => this.startAutosave(), 1000);
        }

        this.file.getContent((e, content) => {
            /*if(e && this.fileFallback) {
                this.fileFallback.getContent((e, content) => load(e, content));
            } else {
                load(undefined, content);
            }*/
            load(undefined, content);
        })
    }
}
