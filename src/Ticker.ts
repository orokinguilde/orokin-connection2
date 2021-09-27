
export class Ticker {
    public static start(delayTime: number, fn: () => Promise<void>, initialDelay?: number) {
        setTimeout(async () => {
            try {
                await fn();
            } catch(ex) {
                console.error(ex);
            }

            process.nextTick(() => Ticker.start(delayTime, fn));
        }, initialDelay ?? delayTime);
    }
}
