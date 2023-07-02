/* eslint-disable import/no-extraneous-dependencies */
// @ts-check

/**
 * @module webpack.exports.plugins
 */

const afterdone = require("../plugin/afterdone");
const banner = require("../plugin/banner");
const build = require("../plugin/build");
const clean = require("../plugin/clean");
const copy = require("../plugin/copy");
const ignore = require("../plugin/ignore");
const optimization = require("../plugin/optimization");
const progress = require("../plugin/progress");
const sourcemaps = require("../plugin/sourcemaps");
const tscheck = require("../plugin/tscheck");
const { wpPlugin } = require("../plugin/plugins");

/** @typedef {import("../types/webpack").WebpackConfig} WebpackConfig */
/** @typedef {import("../types/webpack").WebpackEnvironment} WebpackEnvironment */
/** @typedef {import("../types/webpack").WebpackPluginInstance} WebpackPluginInstance */


/**
 * @method
 * @param {WebpackEnvironment} env Webpack build environment
 * @param {WebpackConfig} wpConfig Webpack config object
 */
const plugins = (env, wpConfig) =>
{
	wpConfig.plugins = [
		progress(env, wpConfig),
		clean(env, wpConfig),
		...build(env, wpConfig),
		// wpPlugin.aftercompile(env, wpConfig),
		ignore(env, wpConfig),
		...tscheck(env, wpConfig)
	];

	if (env.build !== "tests")
	{
		wpConfig.plugins.push(
			sourcemaps(env, wpConfig),
			copy(env, wpConfig),
			wpPlugin.analyze.bundle(env, wpConfig),
			wpPlugin.analyze.visualizer(env, wpConfig),
			wpPlugin.analyze.circular(env, wpConfig),
			banner(env, wpConfig)
		);
	}

	wpConfig.plugins.push(
		...optimization(env, wpConfig),
		afterdone(env, wpConfig)
	);

	wpConfig.plugins.slice().reverse().forEach((p, index, object) =>
	{
		if (!p) {
			/** @type {(WebpackPluginInstance|undefined)[]} */(wpConfig.plugins).splice(object.length - 1 - index, 1);
		}
	});
};

module.exports = plugins;
