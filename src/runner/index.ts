
/**
 * @module testutils.runner.testrunner
 */

import { run } from "./run.js";
import { ITestRunOptions } from "../interface/index.js";


export class TestRunner
{
    private readonly _options: ITestRunOptions;

    run = () => run(this._options);

    constructor(options: Partial<ITestRunOptions>)
    {
        this._options = {
            coverage: {
                clean: false,
                config: {},
                tool: undefined,
            },
            isTypescript: false,
            moduleBuildDir: "dist",
            moduleName: "",
            projectRoot: "",
            register: {
                sourceMapSupport: true,
                tsNode: false
            },
            framework: {
                config: {},
                root: "",
                suite: undefined,
                type: undefined
            },
            verbose: false
        };

        if (options) {
            this._options = Object.assign(this._options, options);
        }
    }

}
