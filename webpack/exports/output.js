// @ts-check

const path = require("path");

/**
 * @module webpack.exports.output
 */

/** @typedef {import("../types/webpack").WebpackConfig} WebpackConfig */
/** @typedef {import("../types/webpack").WebpackEnvironment} WebpackEnvironment */


/**
 * @method
 * @param {WebpackEnvironment} env Webpack build environment
 * @param {WebpackConfig} wpConfig Webpack config object
 */
const output = (env, wpConfig) =>
{
	if (env.build === "tests")
	{
		wpConfig.output = {
			// asyncChunks: true,
			clean: env.clean === true,
			// libraryExport: "run",
			// globalObject: "this",
			// libraryTarget: 'commonjs2',
			path: path.join(env.buildPath, "dist", "test"),
			filename: "[name].js",
			// module: true,
			// chunkFormat: "commonjs",
			// scriptType: "text/javascript",
			// library: {
			// 	type: "commonjs2"
			// },
			libraryTarget: "commonjs2"
		};
	}
	else
	{
		const isTests = env.environment.startsWith("test");
		wpConfig.output = {
			clean: env.clean === true ? (isTests ? { keep: /(test)[\\/]/ } : true) : undefined,
			path: env.build === "browser" ? path.join(env.buildPath, "dist", "browser") : path.join(env.buildPath, "dist"),
			filename: "[name].js",
			libraryTarget: "commonjs2"
		};
	}
};

module.exports = output;
