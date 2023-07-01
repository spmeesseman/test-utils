
import Nyc from "./nyc";
import Mocha from "./mocha";
import { ITestUtilsRunOptions } from "../interface";

export default async(options: ITestUtilsRunOptions) =>
{
    const xArgs = JSON.parse(process.env.xArgs || "[]"),
          cover = !xArgs.includes("--no-coverage");
          
    if (cover)
    {
        if (options.isTypescript || options.register.tsNode)
        {
            require("ts-node/register");
        }
        if (options.register.sourceMapSupport)
        {
            require("source-map-support/register");
        }
    }

    return {
        nyc: cover ? await Nyc(options) : undefined,
        mocha: Mocha(options)
    };
};
