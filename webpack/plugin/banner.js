/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable import/no-extraneous-dependencies */
// @ts-check

/**
 * @module wpbuild.plugin.banner
 */

import webpack from "webpack";
import WpBuildBasePlugin from "./base";
import { isString } from "../utils/utils";

/** @typedef {import("../types").WpBuildEnvironment} WpBuildEnvironment */


/**
 * @param {WpBuildEnvironment} env
 * @returns {WpBuildBasePlugin | undefined}
 */
const banner = (env) =>
{
	if (env.app.plugins.banner !== false && env.wpc.mode === "production")
	{
		const author = isString(env.app.pkgJson.author) ? env.app.pkgJson.author : env.app.pkgJson.author?.name;
		if (author)
		{
			return new WpBuildBasePlugin({
				env,
				plugins: [
				{
					ctor: webpack.BannerPlugin,
					options: {
						banner: `Copyright ${(new Date()).getFullYear()} ${author}`,
						entryOnly: true,
						test: WpBuildBasePlugin.getEntriesRegex(env.wpc, true, true)
					}
				}]
			});
		}
	}
};


export default banner;
