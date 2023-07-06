/* eslint-disable @typescript-eslint/naming-convention */
// @ts-check

import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";
import { writeInfo } from "../console.js";

/**
 * @module webpack.exports.environment
 */

/** @typedef {import("..//types/webpack").WebpackArgs} WebpackArgs */
/** @typedef {import("../types/webpack").WebpackConfig} WebpackConfig */
/** @typedef {import("../types/webpack").WebpackEnvironment} WebpackEnvironment */
/** @typedef {import("../types/webpack").WebpackBuild} WebpackBuild */

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


/**
 * @method environment
 * @param {WebpackBuild} buildTarget
 * @param {WebpackEnvironment} env Webpack build environment
 * @param {WebpackArgs} argv Webpack command line args
 */
const environment = (buildTarget, env, argv) =>
{
	env.build = buildTarget;
	env.buildPath = resolve(__dirname, "..", "..");
	if (env.build === "tests") {
		env.basePath = join(env.buildPath, "src", "test");
	}
	else {
		env.basePath = env.buildPath;
	}
	writeInfo("Environment:");
	Object.keys(env).forEach((k) => { writeInfo(`   ${k.padEnd(15)}: ${env[k]}`); });
	if (argv)
	{
		writeInfo("Arguments:");
		if (argv.mode) {
			writeInfo(`   mode          : ${argv.mode}`);
		}
		if (argv.watch) {
			writeInfo(`   watch         : ${argv.config.join(", ")}`);
		}
		if (argv.config) {
			writeInfo(`   config        : ${argv.config.join(", ")}`);
		}
	}
};

export default environment;
