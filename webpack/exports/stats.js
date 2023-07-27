// @ts-check

/**
 * @module webpack.exports.stats
 */

/** @typedef {import("../types").WebpackConfig} WebpackConfig */
/** @typedef {import("../types").WebpackEnvironment} WebpackEnvironment */

/**
 * @method stats
 * @param {WebpackEnvironment} env Webpack build environment
 * @param {WebpackConfig} wpConfig Webpack config object
 */
const stats = (env, wpConfig) =>
{
	wpConfig.stats = {
		preset: "errors-warnings",
		assets: true,
		colors: true,
		env: true,
		errorsCount: true,
		warningsCount: true,
		timings: true
		// warningsFilter: /Cannot find module \'common\' or its corresponding type declarations/
	};

	wpConfig.infrastructureLogging = {
		colors: true,
		level: env.verbosity || "none"
	};
};


export default stats;
