import { StorageSQL } from "../storage/StorageSQL";
import * as fs from "fs";

process.env = fs.existsSync('./env.json') ? JSON.parse(fs.readFileSync('./env.json').toString()) : process.env;

const storage = new StorageSQL(process.env.STORAGE_FILE_ID);

console.log('Loading...');

storage.getContent((e, data) => {
    if(e) {
        console.error(e);
    } else {
        console.log(data.___save);
    }
})

