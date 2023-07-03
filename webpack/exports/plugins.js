/* eslint-disable import/no-extraneous-dependencies */
// @ts-check

/**
 * @module webpack.exports.plugins
 */

import afterdone from "../plugin/afterdone.js";
import banner from "../plugin/banner.js";
import build from "../plugin/build.js";
import clean from "../plugin/clean.js";
import copy from "../plugin/copy.js";
import ignore from "../plugin/ignore.js";
import optimization from "../plugin/optimization.js";
import progress from "../plugin/progress.js";
import sourcemaps from "../plugin/sourcemaps.js";
import tscheck from "../plugin/tscheck.js";
import { wpPlugin } from "../plugin/plugins.js";

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

export default plugins;
