/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable import/no-extraneous-dependencies */
// @ts-check

/**
 * @file plugin/progress.js
 * @author Scott Meesseman
 */

import webpack from "webpack";

/** @typedef {import("../types").WpBuildEnvironment} WpBuildEnvironment */


/**
 * @param {WpBuildEnvironment} env
 * @returns {webpack.ProgressPlugin | undefined}
 */
const progress = (env) =>
{
	if (env.app.plugins.progress !== false)
	{
		return new webpack.ProgressPlugin();
	}
};


export default progress;
