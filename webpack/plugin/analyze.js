/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable import/no-extraneous-dependencies */
// @ts-check

/**
 * @module wpbuild.plugin.analyze
 */

import webpack from "webpack";
import VisualizerPlugin from "webpack-visualizer-plugin2";
import CircularDependencyPlugin from "circular-dependency-plugin";
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

/** @typedef {import("../types").WpBuildEnvironment} WpBuildEnvironment */
/** @typedef {import("../types").WebpackPluginInstance} WebpackPluginInstance */


// /**
//  * @param {WpBuildEnvironment} env
//  * @param {WebpackConfig} wpConfig Webpack config object
//  * @returns {(WebpackPluginInstance | undefined)[]}
//  */
// const analyze = (env, wpConfig) =>
// {
//     const plugins = [];
// 	if (env.build !== "tests")
// 	{
// 		plugins.push(
// 			bundle(env, wpConfig),
// 			visualizer(env, wpConfig),
// 			circular(env, wpConfig)
// 		);
// 	}
// 	return plugins;
// };

const analyze =
{
	/**
	 * @param {WpBuildEnvironment} env
	 * @returns {BundleAnalyzerPlugin | undefined}
	 */
	bundle(env)
	{
		let plugin;
		if (env.app.plugins.analyze && env.analyze === true)
		{
			plugin = new BundleAnalyzerPlugin({
				analyzerPort: "auto",
				analyzerMode: "static",
				generateStatsFile: true,
				statsFilename: "../.coverage/analyzer-stats.json",
				reportFilename: "../.coverage/analyzer.html",
				openAnalyzer: true
			});
		}
		return plugin;
	},

	/**
	 * @param {WpBuildEnvironment} env
	 * @returns {CircularDependencyPlugin | undefined}
	 */
	circular(env)
	{
		let plugin;
		if (env.app.plugins.analyze && env.analyze === true)
		{
			plugin = new CircularDependencyPlugin(
			{
				cwd: env.paths.build,
				exclude: /node_modules/,
				failOnError: false,
				onDetected: ({ module: _webpackModuleRecord, paths, compilation }) =>
				{
					compilation.warnings.push(/** @type {*}*/(new webpack.WebpackError(paths.join(" -> "))));
				}
			});
		}
		return plugin;
	},

	/**
	 * @param {WpBuildEnvironment} env
	 * @returns {VisualizerPlugin | undefined}
	 */
	visualizer(env)
	{
		let plugin;
		if (env.app.plugins.analyze !== false && env.analyze === true) {
			plugin = new VisualizerPlugin({ filename: "../.coverage/visualizer.html" });
		}
		return /** @type {VisualizerPlugin | undefined}) */(plugin);
	}
};


export default analyze;
