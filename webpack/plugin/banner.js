/* eslint-disable import/no-extraneous-dependencies */
// @ts-check

/**
 * @module webpack.plugin.banner
 */

import webpack from "webpack";
import { getEntriesRegex, isString } from "../utils/utils";

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
		const entriesRgx = getEntriesRegex(wpConfig, true, true),
			  author = isString(env.app.pkgJson.author) ? env.app.pkgJson.author :
			  		   /** @type {{ name: string; email?: string | undefined; }} */(env.app.pkgJson.author)?.name;
		if (author)
		{
			plugin = new webpack.BannerPlugin(
			{
				banner: `Copyright ${(new Date()).getFullYear()} ${author}`,
				entryOnly: true,
				test: entriesRgx
				// raw: true
			});
		}
	}
	return plugin;
};


export default banner;
