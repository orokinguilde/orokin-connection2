import mysql = require('mysql');
import { IStorage } from './IStorage';

export class StorageSQL implements IStorage {
    public constructor(name: string) {
        this.name = name;
    }

    public name: string;

    protected connect() {
        const connection = mysql.createConnection({
            host: process.env.SQL_HOST,
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_DATABASE,
            port: process.env.SQL_PORT
        });
        
        connection.connect();

        return connection;
    }

    public setContent(content: string, callback: (e?: any) => void) {
        const connection = this.connect();
        
        connection.query(`UPDATE json_data SET json = ? WHERE name = ?`, [ content, this.name ], (error, results, fields) => {
            if(error || !results || !results[0]) {
                callback(error || new Error('Cannot write Database'));
            } else {
                callback();
            }
        });
        
        connection.end();
    }

    public getContent(callback: (e: any, content?: string) => void) {
        const connection = this.connect();
        
        connection.query(`SELECT json FROM json_data WHERE name = ?`, [ this.name ], (error, results, fields) => {
            if(error || !results || !results[0]) {
                callback(error || new Error('Cannot read Database'));
            } else {
                const json = results[0].json;
                
                callback(undefined, json);
            }
        });
        
        connection.end();
    }
}