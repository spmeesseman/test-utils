
type CoverageTool = "nyc" | "karma" | undefined;
type PrimitiveType = boolean | number | string;

export interface ITestCoverageToolConfig extends Record<string, PrimitiveType | undefined | PrimitiveType[]>
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

export interface ITestCoverageToolOptions
{
    clean: boolean;
    config: Partial<ITestCoverageToolConfig>;
    tool: CoverageTool;
}
