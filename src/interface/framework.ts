
export type TestsFramework = "mocha" | undefined;

export interface ITestToolOptions
{
    config: Readonly<ITestToolConfig>;
    root: string;
    sortGroup?: string[];
    suite: string[];
    type: TestsFramework;
}

export interface ITestToolConfig
{
    color?: boolean;
    retries?: number;
    slow?: number;
    require?: string[];
    timeout?: number;  // Default to 10s for Mocha
    ui?: string;
}
