
type CoverageTool = "nyc" | "karma" | undefined;
type TestsTool = "mocha" | undefined;


type PrimitiveType = boolean | number | string;

export interface ITestUtilsStore
{
    updateStoreValue(key: string, value: any): PromiseLike<void>;
    getStoreValue<T>(key: string): PromiseLike<T | undefined>;
    getStoreValue<T>(key: string, defaultValue?: T): PromiseLike<T>;
}

export interface ITestUtilsRegisterModules
{
    sourceMapSupport: boolean;
    tsNode: boolean;
}

export interface ITestUtilsCoverageInfo
{
    clean: boolean;
    config: Partial<ICoverageToolConfig>;
    tool: CoverageTool;
}

export interface ITestUtilsTestsInfo
{
    config: Readonly<ITestsToolConfig>;
    root: string;
    suite: string[];
    tool: TestsTool;
}

export interface ITestUtilsRunOptions
{
    coverage: ITestUtilsCoverageInfo;
    isTypescript: boolean;
    moduleBuildDir: string;
    moduleName: string;
    projectRoot: string;
    register: Partial<ITestUtilsRegisterModules>;
    tests: Partial<ITestUtilsTestsInfo>;
    verbose: boolean;
}

export interface ITestUtilsBestTimesOptions
{
    clearAllBestTimes: boolean;
    clearBestTime: boolean,
    clearBestTimesOnTestCountChange: boolean;
    isConsoleLogEnabled: boolean;
    isFileLogEnabled: boolean;
    isLogEnabled: boolean;
    isMultiRootWorkspace: boolean;
    isOutputWindowLogEnabled: boolean;
    isSingleSuiteTest: boolean;
    printSuiteRuntimes: boolean;
    store: ITestUtilsStore;
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

export interface ICoverageToolConfig extends Record<string, PrimitiveType | undefined | PrimitiveType[]>
{
    all?: boolean;
    babelCache?: boolean;           // Disable babel cache, defaults to `true`
    cache?: boolean;                // Set to `true` for caching, cannot be set for TS projects
    cacheDirectory?: string;        // Defaults to node_modules/.cache
    completeCopy?: boolean;
    cwd: string;                    // Root project dir containing package.json
    eager?: boolean;                // Defaults to `false`.
    exclude?: string[];
    /**
     * Depending on whether source-code is pre-instrumented or instrumented using a JIT plugin
     * like `@babel/require` set to `true` to exclude files after applying source-map remapping logic.
     */
    excludeAfterRemap?: boolean;    // 
    excludeNodeModules?: boolean;   // Exclude node_modules folder by default, defaults to `true`
    exitOnError?: boolean;
    extends?: string;
    extension?: string[];
    hookRequire?: boolean;
    hookRunInContext?: boolean;
    hookRunInThisContext?: boolean;
    include: string[];
    instrument?: boolean;
    instrumenter?: string;           // Defaults to './lib/instrumenters/istanbul'
    preserveComments?: boolean;
    produceSourceMap?: boolean;
    reportDir: string;               // Defaults to 'coverage'
    reporter: string[];              // Defaults to [ 'text' ], one or more of ["text", "text-summary", "html", "json", "lcov", "cobertura" ]
    require?: string[];
    showProcessTree?: boolean;       // Show process tree on tests completion
    silent?: boolean;
    skipEmpty?: boolean;
    skipFull?: boolean;
    sourceMap?: boolean;             // Defaults to `true`
    subprocessBin?: string;          // Defaults to `./bin/nyc.js`
    tempDir: string;                 // Defaults to './.nyc_output'
    useSpawnWrap?: false;
    watermarks?: string[];
}

export interface ITestsToolConfig
{
    color?: boolean;
    retries?: number;
    slow?: number;
    require?: string[];
    timeout?: number;  // Default to 10s for Mocha
    ui?: string;
}