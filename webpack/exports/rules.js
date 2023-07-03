/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable import/no-extraneous-dependencies */
// @ts-check

/**
 * @module webpack.exports.rules
 */

/** @typedef {import("../types/webpack").WebpackConfig} WebpackConfig */
/** @typedef {import("../types/webpack").WebpackEnvironment} WebpackEnvironment */

import { join } from "path";
import esbuild from "esbuild";
import JSON5 from "json5/dist/index.js";
import { spawnSync } from "child_process";


/**
 * @method
 * @param {WebpackEnvironment} env Webpack build environment
 * @param {WebpackConfig} wpConfig Webpack config object
 */
const rules = (env, wpConfig) =>
{

	wpConfig.module = {};
	wpConfig.module.rules = [];

	// wpConfig.module.parser = {
	// 	"javascript": {
	// 		requireJs: false,
	// 		requireContext: false,
	// 		unknownContextRequest: "../../node_modules",
	// 		exprContextRecursive: false,
	// 		commonjs: true,
	// 		import: false,
	// 		requireEnsure: false,
	// 		exprContextRequest: "../../node_modules",
	// 		exprContextRegExp: false
	// 	},
	// 	"javascript/dynamic": {
	// 		requireJs: false,
	// 		requireContext: false,
	// 		unknownContextRequest: "../../node_modules",
	// 		exprContextRecursive: false,
	// 		commonjs: true,
	// 		import: false,
	// 		requireEnsure: false,
	// 		exprContextRequest: "../../node_modules",
	// 		exprContextRegExp: false
	// 	}
	// };


	if (env.build === "tests")
	{
		const testsRoot = join(env.buildPath, "src", "test");
		wpConfig.module.rules.push(...[
		{
			test: /index\.js$/,
			include: join(env.buildPath, "node_modules", "nyc"),
			loader: "string-replace-loader",
			options: {
				search: "selfCoverageHelper = require('../self-coverage-helper')",
				replace: "selfCoverageHelper = { onExit () {} }"
			}
		},
		{
			test: /\.ts$/,
			include: testsRoot,
			exclude: [
				/node_modules/, /types[\\/]/, /\.d\.ts$/
			],
			use: {
				loader: "babel-loader",
				options: {
					presets: [
						[ "@babel/preset-env", { targets: "defaults" }],
						[ "@babel/preset-typescript" ],
					]
				}
			}
		}]);
	}
	else
	{
		const configFile = env.build === "browser" ? "tsconfig.browser.json" : "tsconfig.json";

		wpConfig.module.rules.push(...[
		{
			test: /nyc\.ts$/,
			include: join(env.buildPath, "src", "runner"),
			loader: "string-replace-loader",
			enforce: /** @type {"pre"|"post"}*/("pre"),
			options: {
				multiple: [
				{
					search: "require(m)",
					replace: "____require____(m)"
				}]
			}
		},
		{
			test: /\.ts$/,
			include: join(env.buildPath, "src"),
			exclude: [
				/node_modules/, /test[\\/]/, /types[\\/]/, /\.d\.ts$/
			],
			use:
			{
				loader: "esbuild-loader",
				options: {
					color: true,
					implementation: esbuild,
					loader: "ts",
					// packages: "external",
					// target: [ "es2020", "chrome91", "node16.20" ],
					target: [ "node16.20", "es2020" ],
					tsconfigRaw: getTsConfig(env, join(env.buildPath, configFile)),
					// transform: () => {
					// 	console.log("transform!!!!!!!!!!!!!");
					// }
					// plugins: [
					// {
					// 	name: "example",
					// 	setup: (build) =>
					// 	{
					// 		// Load ".txt" files and return an array of words
					// 		build.onLoad({ filter: /\.txt$/ }, async (args) =>
					// 		{
					// 			console.log(args.path);
					// 			// const text = await fs.promises.readFile(args.path, "utf8");
					// 			// return {
					// 			//   contents: JSON.stringify(text.split(/\s+/)),
					// 			//   loader: "json",
					// 			// };
					// 		});
					// 	},
					// }]
				}
			}
		}]);
	}
};


/**
 * @param {WebpackEnvironment} env Webpack build environment
 * @param {String} tsConfigFile
 * @returns {String}
 */
const getTsConfig = (env, tsConfigFile) =>
{
	const result = spawnSync("npx", [ "tsc", `-p ${tsConfigFile}`, "--showConfig" ], {
		cwd: env.buildPath,
		encoding: "utf8",
		shell: true,
	});
	const data = result.stdout,
		  start = data.indexOf("{"),
		  end = data.lastIndexOf("}") + 1;
	return JSON5.parse(data.substring(start, end));
};


export default rules;
