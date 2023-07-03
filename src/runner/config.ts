/* eslint-disable import/no-extraneous-dependencies */

/**
 * @module testutils.runner.config
 */

import Nyc from "./nyc.js";
import Mocha from "./mocha.js";
import { existsSync } from "fs";
import { join, resolve } from "path";
import { ITestRunOptions } from "../interface/index.js";

export default async(options: ITestRunOptions) =>
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

    options.coverage.config.cwd = options.coverage.config.cwd || __dirname;
    if (!existsSync(join(options.projectRoot, "package.json")) || !existsSync(join(options.coverage.config.cwd, "package.json")))
    {
        let projectDir = __dirname;
        while (projectDir.length > 3 && !existsSync(join(projectDir, "package.json"))) {
            projectDir = resolve(projectDir, "..");
        }
        options.projectRoot = projectDir;
        options.coverage.config.cwd = projectDir;
    }

    return {
        nyc: cover ? await Nyc(options) : undefined,
        mocha: Mocha(options)
    };
};
