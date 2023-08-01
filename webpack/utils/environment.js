/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/naming-convention */
// @ts-check

/**
 * @module wpbuildutils.environment
 */

import { join, resolve } from "path";
import { WebpackError } from "webpack";
import { existsSync, mkdirSync } from "fs";
import { globalEnv } from "../utils/global";
import { merge, apply } from "../utils/utils";
import { writeInfo, figures } from "../utils/console";

/** @typedef {import("../types").WpBuildApp} WpBuildApp */
/** @typedef {import("../types").WpBuildWebpackArgs} WpBuildWebpackArgs */
/** @typedef {import("../types").WpBuildModule} WpBuildModule */
/** @typedef {import("../types").WebpackConfig} WebpackConfig */
/** @typedef {import("../types").WpBuildEnvironment} WpBuildEnvironment */


/**
 * @function environment
 * @param {WpBuildEnvironment} env Webpack build environment
 * @param {WebpackConfig} wpConfig Webpack config object
 */
const environment = (env, wpConfig) =>
{
	merge(env, {
		paths: { build: resolve(__dirname, "..", "..") },
		state: { hash: { current: {}, next: {} } }
	});
	setEnvironment(env, wpConfig);
	setPaths(env);
};


/**
 * @function setEnvironment
 * @param {WpBuildEnvironment} env Webpack build environment
 * @param {WebpackConfig} wpConfig Webpack config object
 * @throws {Error}
 */
const setEnvironment = (env, wpConfig) =>
{
	if (!env.environment)
	{
		if (wpConfig.mode === "development" || env.argv.mode === "development") {
			env.environment = "dev";
		}
		else if (wpConfig.mode === "production" || env.argv.mode === "production") {
			env.environment = "prod";
		}
		else if (wpConfig.mode === "none" || env.argv.mode === "none") {
			env.environment = "test";
		}
		else {
			const eMsg = "Could not detect build environment";
			writeInfo("Could not detect build environment", figures.color.error);
			throw new WebpackError(eMsg);
		}
	}
	apply(env, {
		isTests: env.environment.startsWith("test"),
		isWeb: env.target.startsWith("web"),
		isExtension: env.build === "extension" || env.build === "browser",
		isExtensionProd: env.build === "extension" || env.build === "browser" && env.environment === "prod",
		isExtensionTests: env.build === "extension" || env.build === "browser" && env.environment.startsWith("test"),
	});
};


/**
 * @function setPaths
 * @param {WpBuildEnvironment} env Webpack build environment
 */
const setPaths = (env) =>
{
	const wvBase = env.app.vscode.webview.baseDIr;
	merge(env.paths,
	{
		base: env.build !== "webview" ? env.paths.build : (wvBase ? resolve(env.paths.build, wvBase) :
																	join(env.paths.build, "src", "webview", "app")),
		dist: join(env.paths.build, "dist"), // = compiler.outputPath = compiler.options.output.path
		temp: resolve(process.env.TEMP || process.env.TMP  || ".", env.app.name, env.environment),
		cache: globalEnv.cacheDir,
		files: {
			hash: join(globalEnv.cacheDir, `hash.${env.environment}.json`),
			sourceMapWasm: "node_modules/source-map/lib/mappings.wasm"
		}
	});
	if (!existsSync(env.paths.temp)) {
		mkdirSync(env.paths.temp, { recursive: true });
	}
};


export default environment;
