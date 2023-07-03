/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable import/no-extraneous-dependencies */
// @ts-check

/**
 * @module webpack.plugin.progress
 */

import webpack from "webpack";

/** @typedef {import("../types/webpack").WebpackConfig} WebpackConfig */
/** @typedef {import("../types/webpack").WebpackEnvironment} WebpackEnvironment */


/**
 * @param {WebpackEnvironment} env
 * @param {WebpackConfig} wpConfig Webpack config object
 * @returns {webpack.ProgressPlugin | undefined}
 */
const progress = (env, wpConfig) =>
{
	const plugin = new webpack.ProgressPlugin();
	return plugin;
};


export default progress;
