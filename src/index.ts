
import TestUtilsUtilities from "./utils";
import { TestUtilsBestTimes } from "./bestTimes";
import { ITestUtilsOptions, ITestUtilsResults, ITestUtilsSuiteResults } from "./types";


export default class TestUtils
{
    private readonly _times: TestUtilsBestTimes;
    private readonly _utils: TestUtilsUtilities;
    private readonly _options: ITestUtilsOptions;
    private readonly _results: ITestUtilsResults;

    constructor(options: Partial<ITestUtilsOptions>)
    {
        this._options = Object.assign({
            clearAllBestTimes: false,
            clearBestTime: false,
            clearBestTimesOnTestCountChange: false,
            isConsoleLogEnabled: false,
            isFileLogEnabled: false,
            isLogEnabled: false,
            isMultiRootWorkspace: false,
            isOutputWindowLogEnabled: false,
            mochaConfig: {},
            nycConfig: {},
            printSuiteRuntimes: false,
            projectRoot: "",
            testsRoot: ""
        }, options);

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

    get utils() {
        return this._utils;
    }

    get results(): ITestUtilsResults {
        return this._times.results;
    }

    suiteResults(suiteName: string): ITestUtilsSuiteResults {
        return this._times.suiteResults(suiteName);
    }

}
