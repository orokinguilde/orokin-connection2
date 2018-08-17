const ExecutionPool = require('./ExecutionPool');
const StorageFile = require('./StorageFile');

function Saver(fileId, object)
{
    this.file = new StorageFile(fileId);
    this.object = object;
    this.executionPool = new ExecutionPool();
}
Saver.prototype.save = function(callback) {
    this.executionPool.add((done) => {
        const obj = this.object.save();
        const data = JSON.stringify(obj);
        
        this.file.setContent(data, () => {
            done();
            if(callback)
                callback();
        })
    })
}
Saver.prototype.load = function(callback)
{
    this.file.getContent((e, content) => {
        if(!e && content)
        {
            const content = content.toString().trim();

            if(content)
            {
                const data = JSON.parse(content);
                this.object.load(data);
            }
        }

        if(callback)
            callback();
    })
}

module.exports = Saver;
