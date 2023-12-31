/* eslint-disable import/no-extraneous-dependencies */
// @ts-check

/**
 * @file plugin/optimization.js
 * @author Scott Meesseman
 */

import webpack from "webpack";

/** @typedef {import("../types").WpBuildEnvironment} WpBuildEnvironment */
/** @typedef {import("../types").WebpackPluginInstance} WebpackPluginInstance */


/**
 * @function optimization
 * @param {WpBuildEnvironment} env Webpack build environment
 * @returns {WebpackPluginInstance[]}
 */
const optimization = (env) =>
{
	const plugins = [];
	if (env.app.plugins.optimization !== false)
	{
		if (env.build === "web")
		{
			plugins.push(new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }));
		}
		if (env.build !== "webview")
		{
			plugins.push(new webpack.NoEmitOnErrorsPlugin());
		}
	}
	return plugins;
};


export default optimization;
