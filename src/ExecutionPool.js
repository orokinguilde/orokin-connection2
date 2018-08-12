function ExecutionPool()
{
    this.poolSetContent = [];
}
ExecutionPool.prototype.add = function(fn) {
    this.poolSetContent.push(() => {
        fn(() => {
            this.poolSetContent.shift();

            if(this.poolSetContent.length > 0)
            {
                process.nextTick(() => {
                    this.poolSetContent[0]();
                });
            }
        });
    });

    if(this.poolSetContent.length === 1)
        this.poolSetContent[0]();
}

module.exports = ExecutionPool;
