import { TestsFramework } from "./framework";

export interface ITestUtilsStore
{
    updateStoreValue(key: string, value: any): PromiseLike<void>;
    getStoreValue<T>(key: string): PromiseLike<T | undefined>;
    getStoreValue<T>(key: string, defaultValue?: T): PromiseLike<T>;
}

export interface ITestSuiteResults extends Record<string, any>
{
    timeStarted: number;
    numTests: number;
    successCount: number;
    suiteName: string;
    success: boolean;
    timeFinished: number;
    numTestsFailed: number;
}

export interface ITestResults
{
    numSuites: number;
    numSuitesFail: number;
    numSuitesSuccess: number;
    numTests: number;
    numTestsFail: number;
    numTestsSuccess: number;
    readonly suiteResults: Record<string, ITestSuiteResults>;
}

export interface ITestTrackerOptions
{
    clearAllBestTimes: boolean;
    clearBestTime: boolean;
    clearBestTimesOnTestCountChange: boolean;
    isConsoleLogEnabled: boolean;
    isFileLogEnabled: boolean;
    isLogEnabled: boolean;
    isMultiRootWorkspace: boolean;
    isOutputWindowLogEnabled: boolean;
    isSingleSuiteTest: boolean;
    framework: TestsFramework;
    printSuiteRuntimes: boolean;
    store: ITestUtilsStore;
}
