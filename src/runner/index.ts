/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable import/no-extraneous-dependencies */

import runConfig from "./config";
import { ITestUtilsRunOptions } from "src/types";


export async function run(options: ITestUtilsRunOptions): Promise<void>
{
    const runCfg = await runConfig(options); // JSON.parse(process.env.testUtilOptions || "{}"));

    preparePlatform();

    let mochaError: Error | undefined,
        failures = 0;
    try {
        // failures = await new Promise(async (resolve => foreground(childArgs, resolve));
        failures = await new Promise(resolve => runCfg.mocha.run(resolve));
    }
    catch (e) { mochaError = e; }

    if (runCfg.nyc)
    {
        try {
            await sleep(runCfg.mocha.files.length * 5);
            runCfg.nyc.writeCoverageFile();
            await sleep(runCfg.mocha.files.length * 20);
            await runCfg.nyc.writeProcessIndex();
            runCfg.nyc.maybePurgeSourceMapCache();
            console.log(await captureStdout(runCfg.nyc.report.bind(runCfg.nyc)));
        }
        catch (e) {
            console.log("!!!");
            console.log("!!! Error writing coverage file:");
            console.log("!!!    " + e);
            console.log("!!!");
            try { await runCfg.nyc.showProcessTree(); } catch {}
        }
    }

    if (failures > 0 || mochaError)
    {
        throw new Error(!mochaError ? `${failures} tests failed.` : mochaError.message);
    }
}


async function sleep(ms: number) { return new Promise(resolve => setTimeout(resolve, ms)); }


async function captureStdout(fn: any)
{
    // eslint-disable-next-line prefer-const
    let w = process.stdout.write, buffer = "";
    process.stdout.write = (s: string) => { buffer = buffer + s; return true; };
    try {
        await fn();
    }
    catch (e) {
        suppressEPIPE(e);
    }
    finally {
        process.stdout.write = w;
    }
    return buffer;
}


function suppressEPIPE (error: any)
{   //
    // Prevent dumping error when `nyc npm t|head` causes stdout to be closed when reporting runs
    //
    if (error.code !== "EPIPE") { throw error; }
}


function preparePlatform()
{   //
    // Linux: prevent a weird NPE when mocha on Linux requires the window size from the TTY
    // Since we are not running in a tty environment, we just implement he method statically
    //
    if (process.platform === "linux")
    {
        const tty = require("tty");
        if (!tty.getWindowSize)
        {
            tty.getWindowSize = (): number[] => [ 80, 75 ];
        }
    }
}
