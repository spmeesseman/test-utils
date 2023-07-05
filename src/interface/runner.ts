
import { ITestToolOptions } from "./framework.js";
import { ITestCoverageToolOptions } from "./coverage.js";

export interface ITestModules
{
    sourceMapSupport: boolean;
    tsNode: boolean;
}


export interface ITestRunOptions
{
    coverage: Partial<ITestCoverageToolOptions>;
    isTypescript: boolean;
    moduleBuildDir: string;
    moduleName: string;
    projectRoot: string;
    register: Partial<ITestModules>;
    framework: Partial<ITestToolOptions>;
    verbose: boolean;
}
