/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable import/no-extraneous-dependencies */
// @ts-check

/**
 * @module webpack.plugin.progress
 */

import webpack from "webpack";

/** @typedef {import("../types").WebpackConfig} WebpackConfig */
/** @typedef {import("../types").WebpackEnvironment} WebpackEnvironment */


/**
 * @param {WebpackEnvironment} env
 * @param {WebpackConfig} wpConfig Webpack config object
 * @returns {webpack.ProgressPlugin | undefined}
 */
const progress = (env, wpConfig) =>
{
	if (env.app.plugins.progress)
	{
		return new webpack.ProgressPlugin();
	}
};


export default progress;
