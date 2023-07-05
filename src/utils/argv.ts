/**
 * @module testutils.utils.argv
 */

import { isNumeric } from "./utils.js";
import { ITestRunArguments } from "../interface/argv.js";


export const argv = (): Partial<ITestRunArguments> =>
{
    const args : Partial<ITestRunArguments> = {};
    process.argv.forEach((arg, idx, arr) =>
    {
        if (arg.startsWith("--tu-"))
        {
            if (arr[idx + 1] && !arr[idx + 1].startsWith("--"))
            {
                args[toCamelProperty(arg)] = arr[idx + 1];
                if (isNumeric(args[arg])) {
                    args[arg] = parseInt(arr[idx + 1], 10);
                }
            }
            else {
                args[arg] = true;
            }
        }
    }, this);
    return args;
};


const toCamelProperty = (name: string): string =>
{
    return name
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => {
        return index !== 0 ? letter.toLowerCase() : letter.toUpperCase();
    })
    .replace(/[\s\-]+/g, "");
};
