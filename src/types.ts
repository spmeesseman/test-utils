
export interface ITestUtilsOptions
{
    clearAllBestTimes: boolean;
    clearBestTime: boolean,
    clearBestTimesOnTestCountChange: boolean;
    isConsoleLogEnabled: boolean;
    isFileLogEnabled: boolean;
    isLogEnabled: boolean;
    isMultiRootWorkspace: boolean;
    isOutputWindowLogEnabled: boolean;
    printSuiteRuntimes: boolean;
}

export interface ITestUtilsSuiteResults extends Record<string, any>
{
    timeStarted: number;
    numTests: number;
    successCount: number;
    suiteName: string;
    success: boolean;
    timeFinished: number;
    numTestsFailed: number;
}

export interface ITestUtilsResults
{
    numSuites: number;
    numSuitesFail: number;
    numSuitesSuccess: number;
    numTests: number;
    numTestsFail: number,
    numTestsSuccess: number;
    readonly suiteResults: Record<string, ITestUtilsSuiteResults>;
}
