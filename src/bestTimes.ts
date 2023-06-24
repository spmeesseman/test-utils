import { figures } from "./figures";
import { ITestUtilsOptions, ITestUtilsResults, ITestUtilsSuiteResults } from "./types";
import TestUtilsUtilities from "./utils";


export class TestUtilsBestTimes
{
    private readonly _utils: TestUtilsUtilities;
    private readonly _options: ITestUtilsOptions;
    private readonly _results: ITestUtilsResults;
    private readonly _timeSep = "----------------------------------------------------------------------------------------------------";

    private _storage = {
        async updateStoreValue(...args: any[]) {},
        getStoreValue<T>(...args: any[]) { return 0 as T; }
    };


    constructor(options: ITestUtilsOptions, utils: TestUtilsUtilities, results: ITestUtilsResults)
    {
        this._utils = utils;
        this._options = options;
        this._results = results;

    }


    get results(): ITestUtilsResults {
        return this._results;
    }


    suiteResults(suiteName: string): ITestUtilsSuiteResults {
        return this._results.suiteResults[suiteName];
    }


    private clearProcessTimeStorage = async (storageKey: string, numTests: number) =>
    {
        const _clr = async () => {
            await this._storage.updateStoreValue(storageKey, undefined);
            await this._storage.updateStoreValue(storageKey + "Fmt", undefined);
            await this._storage.updateStoreValue(storageKey + "NumTests", undefined);
            await this._storage.updateStoreValue(storageKey + "Slow", undefined);
            await this._storage.updateStoreValue(storageKey + "SlowFmt", undefined);
            await this._storage.updateStoreValue(storageKey + "SlowNumTests", undefined);
        };
        if (this._options.clearBestTime || this._options.clearAllBestTimes)
        {
            await _clr();
        }
        else if (this._options.clearBestTimesOnTestCountChange)
        {
            const prevNumTests = await this._storage.getStoreValue<number>(storageKey + "NumTests", 0);
            if (prevNumTests < numTests) {
                await _clr();
            }
        }
    };


    private getStorageKey = (baseKey: string) => baseKey + (this._options.isMultiRootWorkspace ? "MWS" : "");


    getSuiteFriendlyName = (suiteName: string) => suiteName.replace(" Tests", "");


    private getTimeElapsedFmt = (timeElapsed: number) =>
    {
        const m = Math.floor(timeElapsed / 1000 / 60),
            s = Math.floor(timeElapsed / 1000 % 60),
            ms = Math.round(timeElapsed % 1000);
        return `${m} minutes, ${s} seconds, ${ms} milliseconds`;
    };


    private logBestTime = async (title: string, storageKey: string, timeElapsedFmt: string) =>
    {
        let msg: string;
        let wsTypeMsg = this._options.isMultiRootWorkspace ? "multi-root" : "single-root";
        const prevBestTimeElapsedFmt = await this._storage.getStoreValue<string>(storageKey + "Fmt", ""),
            slowestTImeFmt = await this._storage.getStoreValue<string>(storageKey + "SlowFmt", ""),
            prevMsg = ` The previous fastest time recorded for a ${wsTypeMsg} workspace was ${prevBestTimeElapsedFmt}`,
            slowMsg = ` The slowest time recorded for a ${wsTypeMsg} workspace was ${slowestTImeFmt}`,
            preMsg = `    ${figures.color.info} ${figures.withColor("!!!", figures.colors.cyan)}`;
        wsTypeMsg = this._options.isMultiRootWorkspace ? "Multi-Root" : "Single-Root";
        if (title)
        {
            if (title.includes("Logging")) {
                msg = ` New Fastest Time with ${title} (${wsTypeMsg} workspace) ${figures.withColor(timeElapsedFmt, figures.colors.cyan)}`;
            }
            else {
                if (this._results.numSuites > 1) {
                    msg = ` New Fastest Time for Suite '${title}' (${wsTypeMsg} workspace) ${figures.withColor(timeElapsedFmt, figures.colors.cyan)}`;
                }
                else {
                    msg = ` New Fastest Time for Suite '${title}' (Single Test)(${wsTypeMsg} workspace) ${figures.withColor(timeElapsedFmt, figures.colors.cyan)}`;
                }
            }
        }
        else {
            msg = ` New Fastest Time for 'All Tests' (${wsTypeMsg} workspace) ${figures.withColor(timeElapsedFmt, figures.colors.cyan)}`;
        }
        // console.log(preMsg);
        console.log(preMsg + figures.withColor(msg, figures.colors.grey));
        console.log(preMsg + figures.withColor(prevMsg, figures.colors.grey));
        console.log(preMsg + figures.withColor(slowMsg, figures.colors.grey));
        // console.log(preMsg);
    };


    private logSlowestTime = async (title: string, storageKey: string, timeElapsedFmt: string) =>
    {
        let msg: string;
        let wsTypeMsg = this._options.isMultiRootWorkspace ? "multi-root" : "single-root";
        const prevBestTimeElapsedFmt = await this._storage.getStoreValue<string>(storageKey + "Fmt", ""),
            slowestTimeFmt = await this._storage.getStoreValue<string>(storageKey + "SlowFmt", ""),
            prevMsg = ` The previous slowest time recorded for a ${wsTypeMsg} workspace was ${slowestTimeFmt}`,
            fastMsg = ` The fastest time recorded for a ${wsTypeMsg} workspace was ${prevBestTimeElapsedFmt}`,
            preMsg = `    ${figures.color.info} ${figures.withColor("!!!", figures.colors.red)}`;
        wsTypeMsg = this._options.isMultiRootWorkspace ? "Multi-Root" : "Single-Root";
        if (title)
        {
            if (title.includes("Logging")) {
                msg = ` New Slowest Time with ${title} (${wsTypeMsg} workspace) ${figures.withColor(timeElapsedFmt, figures.colors.red)}`;
            }
            else {
                if (this._results.numSuites > 1) {
                    msg = ` New Slowest Time for Suite '${title}' (${wsTypeMsg} workspace) ${figures.withColor(timeElapsedFmt, figures.colors.red)}`;
                }
                else {
                    msg = ` New Slowest Time for Suite '${title}' (Single Test)(${wsTypeMsg} workspace) ${figures.withColor(timeElapsedFmt, figures.colors.red)}`;
                }
            }
        }
        else {
            msg = ` New Slowest Time for 'All Tests' (${wsTypeMsg} workspace) ${figures.withColor(timeElapsedFmt, figures.colors.cyan)}`;
        }
        // console.log(preMsg);
        console.log(preMsg + figures.withColor(msg, figures.colors.grey));
        console.log(preMsg + figures.withColor(prevMsg, figures.colors.grey));
        console.log(preMsg + figures.withColor(fastMsg, figures.colors.grey));
        // console.log(preMsg);
    };


    private processBestTime = async (logTitle: string, storageKey: string, timeElapsed: number, numTests: number) =>
    {
        const title = !logTitle || logTitle.includes("Logging") ? "All Tests " + logTitle : logTitle,
            msg = (figures.withColor("-- ", figures.colors.magenta) +
                    figures.withColor(title.toUpperCase(), figures.colors.white) +
                    figures.withColor(` ${this._timeSep.substring(0, this._timeSep.length - title.length - 4)}`, figures.colors.magenta));
        console.log(`    ${figures.color.info} ${msg}`);

        await this.clearProcessTimeStorage(storageKey, numTests);

        let bestTimeElapsed = await this._storage.getStoreValue<number>(storageKey, 0);
        if (bestTimeElapsed === 0) {
            bestTimeElapsed = timeElapsed + 1;
        }
        const worstTimeElapsedStored = await this._storage.getStoreValue<number>(`${storageKey}Slow`, 0);
        let worstTimeElapsed = worstTimeElapsedStored;
        if (worstTimeElapsed === 0) {
            worstTimeElapsed = timeElapsed + 1;
        }

        const timeElapsedFmt = this.getTimeElapsedFmt(timeElapsed);
        if (timeElapsed > 0 && timeElapsed < bestTimeElapsed)
        {
            await this.logBestTime(logTitle, storageKey, timeElapsedFmt);
            await this.saveProcessTimeToStorage(storageKey, timeElapsed, timeElapsedFmt, numTests);
            if (worstTimeElapsedStored === 0) {
                await this.saveProcessTimeToStorage(`${storageKey}Slow`, timeElapsed, timeElapsedFmt, numTests);
            }
        }
        else if (timeElapsed > 0 && (timeElapsed > worstTimeElapsed || worstTimeElapsedStored === 0))
        {
            await this.logSlowestTime(logTitle, storageKey, timeElapsedFmt);
            await this.saveProcessTimeToStorage(`${storageKey}Slow`, timeElapsed, timeElapsedFmt, numTests);
        }
        else
        {
            let bestTimeElapsedFmt = await this._storage.getStoreValue<string>(storageKey + "Fmt", ""),
                worstTimeElapsedFmt = await this._storage.getStoreValue<string>(storageKey + "SlowFmt", "");
            const wsTypeMsg = this._options.isMultiRootWorkspace ? "multi-root" : "single-root",
                msg1 = `The time elapsed was ${timeElapsedFmt}`,
                msg2 = timeElapsed > 0 ? `The fastest time recorded for a ${wsTypeMsg} workspace is ${bestTimeElapsedFmt}` :
                                        "Fastest time tracking not available for tests running at 0 ms";
            if (!bestTimeElapsedFmt) {
                await this.saveProcessTimeToStorage(storageKey, timeElapsed, timeElapsedFmt, numTests);
                bestTimeElapsedFmt = timeElapsedFmt;
            }
            if (!worstTimeElapsedFmt) {
                await this.saveProcessTimeToStorage(`${storageKey}Slow`, timeElapsed, timeElapsedFmt, numTests);
                worstTimeElapsedFmt = timeElapsedFmt;
            }
            console.log(`    ${figures.color.info} ${figures.withColor(msg1, figures.colors.grey)}`);
            console.log(`    ${figures.color.info} ${figures.withColor(msg2, figures.colors.grey)}`);
            if (timeElapsed > 0)
            {
                const msg3 = `The slowest time recorded for a ${wsTypeMsg} workspace is ${worstTimeElapsedFmt}`;
                console.log(`    ${figures.color.info} ${figures.withColor(msg3, figures.colors.grey)}`);
            }
        }
    };


    private processSuiteTimes = async () =>
    {
        const suiteResults = Object.values(this._results.suiteResults).filter(v => v.suiteName !== "Deactivate Extension");
        for (const suiteResult of suiteResults)
        {
            const typeKey = this._results.numSuites === 1 ? "Single" : "",
                storageKey = this._utils.getSuiteKey(suiteResult.suiteName, this.getStorageKey("bestTimeElapsedSuite" + typeKey));
            if (this._options.clearAllBestTimes) {
                await this.clearProcessTimeStorage(storageKey, this._results.numTests);
                await this.clearProcessTimeStorage(`${storageKey}Slow`, this._results.numTests);
            }
            if (suiteResult.timeFinished && suiteResult.timeStarted)
            {
                const timeElapsed = suiteResult.timeFinished - suiteResult.timeStarted;
                await this.processBestTime(suiteResult.suiteName, storageKey, timeElapsed, this._results.numTests);
            }
        }
    };


    private processTimesWithLogEnabled = async (timeElapsed: number) =>
    {
        if (this._options.clearAllBestTimes)
        {
            await this.clearProcessTimeStorage(this.getStorageKey("bestTimeElapsedWithLogging"), this._results.numTests);
            await this.clearProcessTimeStorage(this.getStorageKey("bestTimeElapsedWithLoggingFile"), this._results.numTests);
            await this.clearProcessTimeStorage(this.getStorageKey("bestTimeElapsedWithLoggingOutput"), this._results.numTests);
            await this.clearProcessTimeStorage(this.getStorageKey("bestTimeElapsedWithLoggingConsole"), this._results.numTests);
            await this.clearProcessTimeStorage(this.getStorageKey("slowTimeElapsedWithLogging"), this._results.numTests);
            await this.clearProcessTimeStorage(this.getStorageKey("slowTimeElapsedWithLoggingFile"), this._results.numTests);
            await this.clearProcessTimeStorage(this.getStorageKey("slowTimeElapsedWithLoggingOutput"), this._results.numTests);
            await this.clearProcessTimeStorage(this.getStorageKey("slowTimeElapsedWithLoggingConsole"), this._results.numTests);
        }
        if (this._options.isLogEnabled)
        {
            await this.processBestTime("Logging Enabled", this.getStorageKey("bestTimeElapsedWithLogging"), timeElapsed, this._results.numTests);
            await this.processBestTime("Logging Enabled", this.getStorageKey("slowTimeElapsedWithLogging"), timeElapsed, this._results.numTests);
            if (this._options.isFileLogEnabled)
            {
                await this.processBestTime("File Logging Enabled", this.getStorageKey("bestTimeElapsedWithLoggingFile"), timeElapsed, this._results.numTests);
                await this.processBestTime("File Logging Enabled", this.getStorageKey("slowTimeElapsedWithLoggingFile"), timeElapsed, this._results.numTests);
            }
            if (this._options.isOutputWindowLogEnabled)
            {
                await this.processBestTime("Output Window Logging Enabled", this.getStorageKey("bestTimeElapsedWithLoggingOutput"), timeElapsed, this._results.numTests);
                await this.processBestTime("Output Window Logging Enabled", this.getStorageKey("slowTimeElapsedWithLoggingOutput"), timeElapsed, this._results.numTests);
            }
            if (this._options.isConsoleLogEnabled)
            {
                await this.processBestTime("Console Logging Enabled", this.getStorageKey("bestTimeElapsedWithLoggingConsole"), timeElapsed, this._results.numTests);
                await this.processBestTime("Console Logging Enabled", this.getStorageKey("slowTimeElapsedWithLoggingConsole"), timeElapsed, this._results.numTests);
            }
        }
    };


    processTimes = async (timeStarted: number, hadRollingCountError: boolean) =>
    {
        const timeFinished = Date.now(),
            timeElapsed = timeFinished - timeStarted,
            tzOffset = (new Date()).getTimezoneOffset() * 60000,
            timeFinishedFmt = (new Date(Date.now() - tzOffset)).toISOString().slice(0, -1).replace("T", " ").replace(/[\-]/g, "/");

        console.log(`    ${figures.color.info} ${figures.withColor("Time Finished: " + timeFinishedFmt, figures.colors.grey)}`);
        console.log(`    ${figures.color.info} ${figures.withColor("Time Elapsed: " + this.getTimeElapsedFmt(timeElapsed), figures.colors.grey)}`);

        if (this._results.numTestsFail === 0 && !hadRollingCountError)
        {
            if (this._results.numSuites > 3)  { // > 3, sometimes i string the single test together with a few others temp
                await this.processBestTime("", this.getStorageKey("bestTimeElapsed"), timeElapsed, this._results.numTests);
                await this.processTimesWithLogEnabled(timeElapsed);
            }
            await this.processSuiteTimes();
        }
        else {
            const skipMsg = this._results.numTestsFail > 0 ?
                                `There were ${this._results.numTestsFail} failed tests, best time processing skipped` :
                                "There was a rolling count failure, best time processing skipped";
            console.log(`    ${figures.color.info} ${figures.withColor(skipMsg, figures.colors.grey)}`);
        }

        console.log(`    ${figures.color.info} ${figures.withColor(this._timeSep, figures.colors.magenta)}`);
    };


    private saveProcessTimeToStorage = async (key: string, timeElapsed: number, timeElapseFmt: string, numTests: number) =>
    {
        await this._storage.updateStoreValue(key, timeElapsed);
        await this._storage.updateStoreValue(key + "Fmt", timeElapseFmt);
        await this._storage.updateStoreValue(key + "NumTests", numTests);
    };

}