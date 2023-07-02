/* eslint-disable import/no-extraneous-dependencies */
// @ts-check

/**
 * @module webpack.exports.plugins
 */

const afterdone = require("../plugin/afterdone");
const clean = require("../plugin/clean");
const ignore = require("../plugin/ignore");
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
		wpPlugin.beforecompile(env, wpConfig),
		ignore(env, wpConfig),
		...tscheck(env, wpConfig)
	];

	if (env.build !== "tests")
	{
		wpConfig.plugins.push(
			sourcemaps(env, wpConfig),
			wpPlugin.limitchunks(env, wpConfig),
			wpPlugin.copy(env, wpConfig),
			wpPlugin.analyze.bundle(env, wpConfig),
			wpPlugin.analyze.visualizer(env, wpConfig),
			wpPlugin.analyze.circular(env, wpConfig),
			wpPlugin.banner(env, wpConfig)
		);
	}

	wpConfig.plugins.push(
		wpPlugin.optimize.noEmitOnError(env, wpConfig),
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
