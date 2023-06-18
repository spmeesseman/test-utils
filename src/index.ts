import { ITestUtilsOptions, ITestUtilsResults, ITestUtilsSuiteResults } from "./types";


export default class TestUtils
{
    private _options: ITestUtilsOptions = {
        clearAllBestTimes: false,
        clearBestTime: false,
        clearBestTimesOnTestCountChange: false,
        isConsoleLogEnabled: false,
        isFileLogEnabled: false,
        isLogEnabled: false,
        isMultiRootWorkspace: false,
        isOutputWindowLogEnabled: false
    };

    constructor(options: Partial<ITestUtilsOptions>)
    {
        Object.assign(this._options, options);
    }
}
