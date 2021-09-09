
export class Ticker {
    public static start(delayTime: number, fn: () => Promise<void>) {
        setTimeout(async () => {
            try {
                await fn();
            } catch(ex) {
                console.error(ex);
            }

            process.nextTick(() => Ticker.start(delayTime, fn));
        }, delayTime);
    }
}
