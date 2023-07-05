import { ITestRunOptions } from "./runner.js";
import { ITestTrackerOptions } from "./tracker.js";

// type Primitive = boolean | number | string;
// type ObjExtract<T, K extends keyof T> = {
//     [P in K]: T;
// };
export interface ITestRunArguments extends Record<string, any>, Omit<Partial<ITestRunOptions>, "framework">, Omit<Partial<ITestTrackerOptions>, "framework"> {}
