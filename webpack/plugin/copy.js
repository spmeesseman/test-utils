/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable import/no-extraneous-dependencies */
// @ts-check

/**
 * @module webpack.plugin.copy
 */

import path from "path";
import CopyPlugin from "copy-webpack-plugin";

/** @typedef {import("../types/webpack").WebpackConfig} WebpackConfig */
/** @typedef {import("../types/webpack").WebpackEnvironment} WebpackEnvironment */
/** @typedef {import("../types/webpack").WebpackPluginInstance} WebpackPluginInstance */


/**
 * @param {WebpackEnvironment} env
 * @param {WebpackConfig} wpConfig Webpack config object
 * @returns {CopyPlugin | undefined}
 */
const copy =(env, wpConfig) =>
{
	let plugin;
	const /** @type {CopyPlugin.Pattern[]} */patterns = [];
	if (env.build === "node" && wpConfig.mode === "production")
	{
		const psx__buildpath = path.posix.normalize(env.buildPath),
			  psx_basePath = path.posix.normalize(env.basePath);
		patterns.push(
		{
			from: path.posix.join(psx_basePath, "res"),
			to: path.posix.join(psx__buildpath, "res"),
			context: path.posix.join(psx_basePath, "res")
		});
	}
	if (patterns.length > 0) {
		plugin = new CopyPlugin({ patterns });
	}
	return plugin;
}


export default copy;
