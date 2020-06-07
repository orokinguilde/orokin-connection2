const ExecutionPool = require('./ExecutionPool');
const StorageFile = require('./StorageFile');
const moment = require('moment');

function Saver(fileId, object)
{
    this.file = new StorageFile(fileId);
    this.object = object;
    //this.executionPool = new ExecutionPool();
    this.pendingSave = [];
}
Saver.prototype.startAutosave = function() {
    this.forceSave(() => {
        setTimeout(() => this.startAutosave(), 3000);
    });
}
Saver.prototype.saveIfChanged = function(callback) {
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
Saver.prototype.forceSave = function(callback) {
    const obj = this.object.save();
    obj.___save = {
        dateStr: moment().format(),
        date: Date.now()
    }

    const data = JSON.stringify(obj);

    this.forceSaveOf(data, callback);
}
Saver.prototype.forceSaveOf = function(dataStr, callback) {
    this.file.setContent(dataStr, () => callback && callback())
}
Saver.prototype.save = function(callback) {
    process.nextTick(() => callback && callback());
    return;

    this.executionPool.add((done) => {
        const obj = this.object.save();
        const data = JSON.stringify(obj);
        
        this.file.setContent(data, (e) => {
            done();
            if(callback)
                callback();
        })
    })
}
Saver.prototype.load = function(callback)
{
    this.file.getContent((e, content) => {
        let dataLoaded = false;

        if(!e && content) {
            content = content.toString().trim();

            if(content && content.length > 0) {
                const data = JSON.parse(content);

                if(data) {
                    console.log('Data info :', data.___save);

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
    })
}

module.exports = Saver;
