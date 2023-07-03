/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable import/no-extraneous-dependencies */
// @ts-check

/**
 * @module webpack.plugin.copy
 */

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
	const /** @type {CopyPlugin.Pattern[]} */patterns = []; // ,
		  // psx__dirname = env.buildPath.replace(/\\/g, "/"),
		  // psxBasePath = env.basePath.replace(/\\/g, "/"),
		  // psxBaseCtxPath = path.posix.join(psxBasePath, "res");
	if (env.build === "tests")
	{
		// apps.filter(app => fs.existsSync(path.join(env.basePath, app, "res"))).forEach(
		// 	app => patterns.push(
		// 	{
		// 		from: path.posix.join(psxBasePath, app, "res", "*.*"),
		// 		to: path.posix.join(psx__dirname, "res", "webview"),
		// 		context: path.posix.join(psxBasePath, app, "res")
		// 	})
		// );
		// if (fs.existsSync(path.join(env.basePath, "res")))
		// {
		// 	patterns.push({
		// 		from: path.posix.join(psxBasePath, "res", "*.*"),
		// 		to: path.posix.join(psx__dirname, "res", "webview"),
		// 		context: psxBaseCtxPath
		// 	});
		// }
	}
	else if (env.build === "node" && wpConfig.mode === "production")
	{
		// const psx__dirname_info = path.posix.normalize(path.posix.join(psx__dirname, "..", "vscode-taskexplorer-info"));
		// patterns.push(
		// {
		// 	from: path.posix.join(psxBasePath, "res", "img", "**"),
		// 	to: path.posix.join(psx__dirname_info, "res"),
		// 	context: psxBaseCtxPath
		// });
	}
	if (patterns.length > 0) {
		plugin = new CopyPlugin({ patterns });
	}
	return plugin;
}


export default copy;
