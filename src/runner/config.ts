
import NYCCFG from "./nycConfig";
import NYC from "./nyc";
import MOCHA from "./mocha";

export default async(testsRoot: string) =>
{
    const xArgs = JSON.parse(process.env.xArgs || "[]"),
          cover = !xArgs.includes("--no-coverage");
    return {
        nyc: cover ? await NYC(NYCCFG()) : undefined,
        mocha: MOCHA(testsRoot)
    };
};
