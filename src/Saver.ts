import { IStorage } from "./storage/IStorage";
import { StorageFile } from './storage/StorageFile';
import { StorageSQL } from './storage/StorageSQL';
import * as moment from 'moment-timezone'

const StorageSystem = StorageSQL; // StorageFile

export class Saver {
    public constructor(fileId: string, object: any, fileIdFallback: string) {
        this.file = new StorageSystem(fileId);
        this.fileFallback = fileIdFallback && new StorageSystem(fileIdFallback);
        this.object = object;
    }

    protected file: IStorage;
    protected fileFallback: IStorage;
    protected object: any;
    protected pendingSave: any[] = [];
    protected lastData: any;

    public toJSON = function() {
        return {
            file: this.file,
            pendingSave: this.pendingSave
        }
    }
    
    public startAutosave() {
        this.forceSave(() => {
            setTimeout(() => this.startAutosave(), 3000);
        });
    }
    public saveIfChanged(callback) {
        const obj = this.object.save();
        const data = JSON.stringify(obj);

        if(this.lastData !== data) {
            this.lastData = data;
            this.forceSaveOf(data, callback);

            return true;
        } else {
            return false;
        }
    }
    public forceSave(callback) {
        const obj = this.object.save();
        obj.___save = {
            dateStr: moment().format(),
            date: Date.now()
        }

        const data = JSON.stringify(obj);

        this.forceSaveOf(data, callback);
    }
    public forceSaveOf(dataStr, callback) {
        this.file.setContent(dataStr, () => callback && callback())
    }
    public save(callback) {
        process.nextTick(() => callback && callback());
    }
    public load(callback) {
        const load = (e, content) => {
            let dataLoaded = false;

            if(!e && content) {
                content = content.toString().trim();

                if(content && content.length > 0) {
                    const data = JSON.parse(content);

                    if(data) {
                        console.log(`**************`);
                        console.log('Data info :', data.___save);
                        
                        for(const propName in data) {
                            console.log(`${propName}: ${JSON.stringify(data[propName]).length} chars`);
                        }
                        console.log(`**************`);

                        this.object.load(data);
                        dataLoaded = true;
                    }
                }
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
            if(e && this.fileFallback) {
                this.fileFallback.getContent((e, content) => load(e, content));
            } else {
                load(undefined, content);
            }
        })
    }
}
