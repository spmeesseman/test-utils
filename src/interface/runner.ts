
import { ITestToolOptions } from "./framework";
import { ITestCoverageToolOptions } from "./coverage";

export interface ITestModules
{
    sourceMapSupport: boolean;
    tsNode: boolean;
}


export interface ITestRunOptions
{
    coverage: ITestCoverageToolOptions;
    isTypescript: boolean;
    moduleBuildDir: string;
    moduleName: string;
    projectRoot: string;
    register: Partial<ITestModules>;
    framework: Partial<ITestToolOptions>;
    verbose: boolean;
}
