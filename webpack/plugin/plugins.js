/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/naming-convention */
// @ts-check

const webpack = require("webpack");
// @ts-ignore
const VisualizerPlugin = require("webpack-visualizer-plugin2");
const CircularDependencyPlugin = require("circular-dependency-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

/** @typedef {import("../types/webpack").WebpackConfig} WebpackConfig */
/** @typedef {import("../types/webpack").WebpackEnvironment} WebpackEnvironment */
/** @typedef {import("../types/webpack").WebpackPluginInstance} WebpackPluginInstance */


const wpPlugin =
{
	analyze:
	{
		/**
		 * @param {WebpackEnvironment} env
		 * @param {WebpackConfig} wpConfig Webpack config object
		 * @returns {BundleAnalyzerPlugin | undefined}
		 */
		// @ts-ignore
		bundle: (env, wpConfig) =>
		{
			let plugin;
			if (env.analyze === true)
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
		 * @param {WebpackEnvironment} env
		 * @param {WebpackConfig} wpConfig Webpack config object
		 * @returns {CircularDependencyPlugin | undefined}
		 */
		// @ts-ignore
		circular: (env, wpConfig) =>
		{
			let plugin;
			if (env.analyze === true)
			{
				plugin = new CircularDependencyPlugin(
				{
					cwd: env.buildPath,
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
		 * @param {WebpackEnvironment} env
		 * @param {WebpackConfig} wpConfig Webpack config object
		 * @returns {VisualizerPlugin | undefined}
		 */
		// @ts-ignore
		visualizer: (env, wpConfig) =>
		{
			let plugin;
			if (env.analyze === true) {
				plugin = new VisualizerPlugin({ filename: "../.coverage/visualizer.html" });
			}
			return /** @type {VisualizerPlugin | undefined}) */(plugin);
		}
	}
};

module.exports = {
	wpPlugin
};
