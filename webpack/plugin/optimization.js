/* eslint-disable import/no-extraneous-dependencies */
// @ts-check

/**
 * @module webpack.plugin.optimization
 */

import webpack from "webpack";

/** @typedef {import("../types").WebpackConfig} WebpackConfig */
/** @typedef {import("../types").WebpackEnvironment} WebpackEnvironment */
/** @typedef {import("../types").WebpackPluginInstance} WebpackPluginInstance */


/**
 * @method optimization
 * @param {WebpackEnvironment} env Webpack build environment
 * @param {WebpackConfig} wpConfig Webpack config object
 * @returns {WebpackPluginInstance[]}
 */
const optimization = (env, wpConfig) =>
{
	const plugins = [];
	if (env.build === "browser")
	{
		plugins.push(new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }));
	}
	if (env.build !== "webview")
	{
		plugins.push(new webpack.NoEmitOnErrorsPlugin());
	}
	return plugins;
};


export default optimization;
