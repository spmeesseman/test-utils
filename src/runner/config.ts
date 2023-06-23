
import Nyc from "./nyc";
import Mocha from "./mocha";
import NycConfig from "./nycConfig";
import { ITestUtilsOptions } from "../types";

export default async(options: ITestUtilsOptions) =>
{
    const xArgs = JSON.parse(process.env.xArgs || "[]"),
          cover = !xArgs.includes("--no-coverage");
    return {
        nyc: cover ? await Nyc(Object.assign({}, NycConfig(options), options.nycConfig)) : undefined,
        mocha: Mocha(options)
    };
};
