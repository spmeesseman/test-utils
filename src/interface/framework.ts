
type TestTool = "mocha" | undefined;

export interface ITestToolOptions
{
    config: Readonly<ITestToolConfig>;
    root: string;
    sortGroup?: string[];
    suite: string[];
    tool: TestTool;
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
