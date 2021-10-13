
export class TickerCtx {
    public dispose: boolean = false;
}

export class Ticker {
    public static start(delayTime: number, fn: (ctx: TickerCtx) => Promise<void>, initialDelay?: number) {
        setTimeout(async () => {
            try {
                const ctx = new TickerCtx();
                await fn(ctx);
                
                if(ctx.dispose) {
                    return;
                }
            } catch(ex) {
                console.error(ex);
            }

            process.nextTick(() => Ticker.start(delayTime, fn));
        }, initialDelay ?? delayTime);
    }
}
