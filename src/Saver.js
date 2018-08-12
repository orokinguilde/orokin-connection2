const ExecutionPool = require('./ExecutionPool');
const fs = require('fs');

function Saver(filePath, object)
{
    this.filePath = filePath;
    this.object = object;
    this.executionPool = new ExecutionPool();
}
Saver.prototype.save = function(callback) {
    this.executionPool.add((done) => {
        const obj = this.object.save();
        const data = JSON.stringify(obj);
        
        fs.writeFile(this.filePath, data, () => {
            done();
            if(callback)
                callback();
        })
    })
}
Saver.prototype.load = function(callback)
{
    fs.readFile(this.filePath, (e, content) => {
        if(!e && content)
        {
            const data = JSON.parse(content.toString());
            this.object.load(data);
        }

        if(callback)
            callback();
    })
}

module.exports = Saver;
