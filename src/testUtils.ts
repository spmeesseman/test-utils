
import { run } from "./runner";
import TestUtilsUtilities from "./utils";
import { TestUtilsBestTimes } from "./bestTimes";
import { ITestUtilsOptions, ITestUtilsResults, ITestUtilsSuiteResults } from "./types";


export class TestUtils
{
    private readonly _times: TestUtilsBestTimes;
    private readonly _utils: TestUtilsUtilities;
    private readonly _options: ITestUtilsOptions;
    private readonly _results: ITestUtilsResults;

    constructor(options: Partial<ITestUtilsOptions>)
    {
        this._options = {
            clearAllBestTimes: false,
            clearBestTime: false,
            clearBestTimesOnTestCountChange: false,
            coverageTool: undefined,
            isConsoleLogEnabled: false,
            isFileLogEnabled: false,
            isLogEnabled: false,
            isMultiRootWorkspace: false,
            isOutputWindowLogEnabled: false,
            isTypescript: false,
            coverageConfig: {},
            moduleBuildDir: "dist",
            moduleName: "",
            printSuiteRuntimes: false,
            projectRoot: "",
            register: {
                sourceMapSupport: true,
                tsNode: false
            },
            testsConfig: {},
            testsRoot: "",
            testsTool: undefined,
            verbose: false
        };

        if (options) {
            this._options = Object.assign(this._options, options);
        }

        this._results = {
            numSuites: 0,
            numSuitesFail: 0,
            numSuitesSuccess: 0,
            numTests: 0,
            numTestsFail: 0,
            numTestsSuccess: 0,
            suiteResults: {}
        };

        this._utils = new TestUtilsUtilities(this._options, this._results);
        this._times = new TestUtilsBestTimes(this._options, this._utils, this._results);
    }

    get utils() { return this._utils; }

    get results(): ITestUtilsResults { return this._times.results; }

    run = () => run(this._options)

    suiteResults = (suiteName: string): ITestUtilsSuiteResults => this._times.suiteResults(suiteName);

}
