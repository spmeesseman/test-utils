
import { run } from "./runner";
import { ITestUtilsRunOptions, ITestUtilsResults, ITestUtilsSuiteResults } from "./types";


export class TestUtils
{
    private readonly _options: ITestUtilsRunOptions;

    run = () => run(this._options);

    constructor(options: Partial<ITestUtilsRunOptions>)
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
            tests: {
                config: {},
                root: "",
                suite: undefined,
                tool: undefined,
            },
            verbose: false
        };

        if (options) {
            this._options = Object.assign(this._options, options);
        }
    }

}
