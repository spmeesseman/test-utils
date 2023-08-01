/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable import/no-extraneous-dependencies */
// @ts-check

/**
 * @module wpbuild.plugin.build
 */

import { basename, join } from "path";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "fs";

/** @typedef {import("../types").WebpackConfig} WebpackConfig */
/** @typedef {import("../types").WpBuildEnvironment} WpBuildEnvironment */
/** @typedef {import("../types").WebpackPluginInstance} WebpackPluginInstance */


/**
 * @param {WpBuildEnvironment} env
 * @param {WebpackConfig} wpConfig Webpack config object
 * @returns {WebpackPluginInstance | undefined}
 */
const customize = (env, wpConfig) =>
{
    /** @type {WebpackPluginInstance | undefined} */
	let plugin;
	if (env.app.plugins.customize !== false && env.build !== "webview")
	{
		plugin =
		{
			apply: (compiler) =>
			{
				compiler.hooks.afterEnvironment.tap("WpBuildCustomizePlugin", () =>
				{
					clean_webpack_plugin(env);
				});
			}
		};
	}
	return plugin;
};


/**
 * @param {WpBuildEnvironment} env
 */
const clean_webpack_plugin = (env) =>
{   //
	// Make a lil change to the copy-plugin to initialize the current assets array to
	// the existing contents of the dist directory.  By default it's current assets list
	// is empty, and thus will not work across IDE restarts
	//
	const copyPlugin = join(env.paths.build, "node_modules", "clean-webpack-plugin", "dist", "clean-webpack-plugin.js");
	if (existsSync(copyPlugin))
	{
		let content = readFileSync(copyPlugin, "utf8").replace(/currentAssets = \[ "[\w"\., _\-]+" \]/, "currentAssets = []");
		if (existsSync(env.paths.dist))
		{
			const distFiles = `"${readdirSync(env.paths.dist).map(f => basename(f)).join("\", \"")}"`;
			content = content.replace("currentAssets = []", `currentAssets = [ ${distFiles} ]`);
		}
		writeFileSync(copyPlugin, content);
	}
};


export default customize;
