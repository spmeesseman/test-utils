
type PrimitiveType = boolean | number | string;

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
    mochaConfig: IMochaConfig;
    nycConfig: INycConfig;
    printSuiteRuntimes: boolean;
    projectRoot: string;
    testsRoot: string;
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

export interface INycConfig extends Record<string, PrimitiveType | undefined | PrimitiveType[]>
{
    all?: boolean;
    babelCache?: boolean;           // Disable babel cache, defaults to `true`
    cwd: string;                    // Root project dir containing package.json
    exitOnError?: boolean;
    extends?: string;
    hookRequire?: boolean;
    hookRunInContext?: boolean;
    hookRunInThisContext?: boolean;
    instrument?: boolean;
    reportDir: string;
    showProcessTree?: boolean;       // Show process tree on tests completion
    silent?: boolean;
    tempDir: string;
    useSpawnWrap?: false;
    reporter: string[];              // One or more of ["text", "text-summary", "html", "json", "lcov", "cobertura" ]
    include: string[];
    exclude?: string[];
}

export interface IMochaConfig
{
    color?: boolean;
    retries?: number;
    slow?: number;
    timeout?: number;
    ui?: string;
}
