/* eslint-disable import/no-extraneous-dependencies */
// @ts-check

/**
 * @module webpack.plugin.banner
 */

import webpack from "webpack";

/** @typedef {import("../types").WebpackConfig} WebpackConfig */
/** @typedef {import("../types").WebpackEnvironment} WebpackEnvironment */


/**
 * @param {WebpackEnvironment} env
 * @param {WebpackConfig} wpConfig Webpack config object
 * @returns {webpack.BannerPlugin | undefined}
 */
const banner = (env, wpConfig) =>
{
    let plugin;
	if (wpConfig.mode === "production")
	{
		plugin = new webpack.BannerPlugin(
		{
			banner: `Copyright ${(new Date()).getFullYear()} ${env.pkgJson.name || env.pkgJson.author?.name || "Scott P Meesseman"}`,
			entryOnly: true,
			test: new RegExp(`${env.app.mainChunk}\\.js`)
			// raw: true
		});
	}
	return plugin;
};


export default banner;
