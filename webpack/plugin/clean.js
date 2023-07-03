/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable import/no-extraneous-dependencies */
// @ts-check

/**
 * @module webpack.plugin.clean
 */

// const path = require("path");
import { CleanWebpackPlugin } from "clean-webpack-plugin";

/** @typedef {import("../types/webpack").WebpackConfig} WebpackConfig */
/** @typedef {import("../types/webpack").WebpackEnvironment} WebpackEnvironment */


/**
 * @param {WebpackEnvironment} env
 * @param {WebpackConfig} wpConfig Webpack config object
 * @returns {CleanWebpackPlugin | undefined}
 */
const clean = (env, wpConfig) =>
{
	let plugin;
	if (env.clean === true)
	{
		if (env.build === "tests")
		{
			// const basePath = path.posix.join(env.buildPath.replace(/\\/g, "/"), "res");
			// plugin = new CleanWebpackPlugin(
			// {
			// 	dry: false,
			// 	dangerouslyAllowCleanPatternsOutsideProject: true,
			// 	cleanOnceBeforeBuildPatterns: [
			// 		path.posix.join(basePath, "css", "**"),
			// 		path.posix.join(basePath, "js", "**"),
			// 		path.posix.join(basePath, "page", "**")
			// 	]
			// });
		}
		else
		{
			// plugin = new CleanWebpackPlugin(
			// {
			// 	dry: false,
			// 	dangerouslyAllowCleanPatternsOutsideProject: true,
			// 	cleanOnceBeforeBuildPatterns: wpConfig.mode === "production" ? [
			// 		path.posix.join(env.buildPath.replace(/\\/g, "/"), "dist", "**"),
			// 		path.posix.join(env.buildPath.replace(/\\/g, "/"), ".coverage", "**"),
			// 		path.posix.join(env.buildPath.replace(/\\/g, "/"), ".nyc-output", "**"),
			// 		"!dist/webview/app/**"
			// 	] : [
			// 		path.posix.join(env.buildPath.replace(/\\/g, "/"), "dist", "**"),
			// 		"!dist/webview/app/**"
			// 	]
			// });
		}
	}
	return plugin;
};


export default clean;
