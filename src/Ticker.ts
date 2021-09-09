
export class Ticker {
    public static start(delayTime: number, fn: () => Promise<void>) {
        setInterval(async () => {
            await fn();
            process.nextTick(() => Ticker.start(delayTime, fn));
        }, delayTime);
    }
}
