
import { figures } from "../utils/figures";
import { TestTracker } from "../tracker";
import { ITestTrackerOptions, ITestResults } from "../interface";


export class TestUtilsUtilities
{
    private _testTimer = 0;
    private _hasRollingCountError = false;
    private readonly _results: ITestResults;
    private readonly _options: ITestTrackerOptions;


    constructor(bestTimesInst: TestTracker)
    {
        this._options = bestTimesInst.options;
        this._results = bestTimesInst.results;
    }


    consoleWrite = (msg?: string, icon?: string, pad = "") =>
        console.log(`    ${pad}${icon || figures.color.info}${msg ? " " + figures.withColor(msg, figures.colors.grey) : ""}`);


    getSuccessCount = (instance: Mocha.Context) =>
    {
        const mTest = instance.test || instance.currentTest as Mocha.Runnable,
              suite = mTest.parent as Mocha.Suite,
              suiteKey = this.getSuiteKey(suite.title),
              suiteResults = this._results.suiteResults[suiteKey];
        return suiteResults.successCount;
    };


    endRollingCount = (instance: Mocha.Context, isSetup?: boolean) =>
    {

        const mTest = (!isSetup ? instance.test : instance.currentTest) as Mocha.Runnable,
            suite = mTest.parent as Mocha.Suite,
            suiteKey = this.getSuiteKey(suite.title),
            suiteResults = this._results.suiteResults[suiteKey];
        ++suiteResults.successCount;
        suiteResults.runTime = Date.now() - this._testTimer;
        suiteResults.runTimeFmt = `${Math.floor(suiteResults.runTime / 1000)} s, ${suiteResults.runTime % 1000} ms`;
        if (this._options.printSuiteRuntimes && this._testTimer > 0) {
            this.consoleWrite(`suite runtime  : ${suiteResults.runTimeFmt}`);
        }
        this._testTimer = 0;
    };


    exitRollingCount = (instance: Mocha.Context, isSetup?: boolean, isTeardown?: boolean) =>
    {
        const mTest = (!isSetup && !isTeardown ? instance.test : instance.currentTest) as Mocha.Runnable,
              suite = mTest.parent as Mocha.Suite,
              suiteKey = this.getSuiteKey(suite.title);

        if (!this._results.suiteResults[suiteKey])
        {
            this._results.suiteResults[suiteKey] = {
                timeStarted: Date.now(),
                numTests: suite.tests.length,
                success: false,
                successCount: -1,
                suiteName: this.getSuiteFriendlyName(suite.title),
                timeFinished: 0,
                numTestsFailed: 0
            };
            if (suite.parent) {
                this._options.isSingleSuiteTest = suite.parent.suites.length <= 2;
            }
        }

        const suiteResults = this._results.suiteResults[suiteKey],
              testIdx = !isSetup && !isTeardown ?
                        suite.tests.findIndex(t => t.title === mTest.title && !t.isFailed() && !t.isPassed()) :
                        (isSetup ? -1 : suite.tests.length);
        try
        {
            if (suiteResults.successCount !== testIdx) {
                throw new Error(`Expected success count to be ${suiteResults.successCount}, got ${testIdx}`);
            }
        }
        catch (e: any)
        {
            if (!this._hasRollingCountError) {
                this.consoleWrite(`rolling success count failure @ test ${(testIdx || -1) + 1}, skipping remaining tests`);
            }
            this._hasRollingCountError = true;
            const { symbols } = require("mocha/lib/reporters/base");
            symbols.ok = figures.withColor(figures.pointer, figures.colors.blue);
            if (suite.tests.filter(t => t.isFailed).length === 0) {
                throw new Error("Rolling count error: " + e.message);
            }
        }

        this._testTimer = Date.now();
        return !isTeardown ? this._hasRollingCountError : !suiteResults && this._hasRollingCountError;
    };


    getSuiteKey = (suiteName: string, preKey = "") =>
    {
        if (preKey) {
            return preKey + this.properCase(suiteName.replace(" Tests", "")).replace(/[ \W]/g, "");
        }
        return this.lowerCaseFirstChar(this.properCase(suiteName.replace(" Tests", "")), true).replace(/\W/g, "");
    };


    getSuiteFriendlyName = (suiteName: string) => suiteName.replace(" Tests", "");


    isRollingCountError = () => this._hasRollingCountError;


    private properCase = (name: string | undefined, removeSpaces?: boolean) =>
    {
        if (!name) {
        return "";
        }
        return name.replace(/(?:^\w|[A-Z]|\b\w)/g, (ltr) => ltr.toUpperCase()).replace(/[ ]+/g, !removeSpaces ? " " : "");
    };


    private lowerCaseFirstChar = (s: string, removeSpaces: boolean) =>
    {
        let fs = "";
        if (s)
        {
            fs = s[0].toString().toLowerCase();
            if (s.length > 1) {
                fs += s.substring(1);
            }
            if (removeSpaces) {
                fs = fs.replace(/ /g, "");
            }
        }
        return fs;
    };


    sleep = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


    suiteFinished = (instance: Mocha.Context) =>
    {
        const suite = instance.currentTest?.parent;
        if (suite)
        {
            const numTestsFailedThisSuite = suite.tests.filter(t => t.isFailed()).length,
                  suiteKey = this.getSuiteKey(suite.title),
                  suiteResults = this._results.suiteResults[suiteKey];
            this._results.numTestsFail += numTestsFailedThisSuite;
            this._results.numTestsSuccess += suite.tests.filter(t => t.isPassed()).length;
            this._results.numSuites++;
            this._results.numTests += suite.tests.length;
            if (numTestsFailedThisSuite > 0) {
                this._results.numSuitesFail++;
            }
            else {
                this._results.numSuitesSuccess++;
            }
            this._results.suiteResults[suiteKey] = Object.assign(suiteResults,
            {
                success: numTestsFailedThisSuite === 0,
                timeFinished: Date.now(),
                numTestsFailed: numTestsFailedThisSuite
            });
        }
    };

}
