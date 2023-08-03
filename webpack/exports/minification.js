/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/naming-convention */
// @ts-check

import { merge } from "../utils/utils";
import TerserPlugin from "terser-webpack-plugin";

/**
 * @module wpbuild.exports.minification
 */

/** @typedef {import("../types").WpBuildEnvironment} WpBuildEnvironment */


/**
 * @function
 * @param {WpBuildEnvironment} env Webpack build environment
 */
const minification = (env) =>
{   //
	// NOTE:  Webpack 5 performs minification built-in now for production builds.
	// Most likely, set app.exports.minification=false
	//
	if (env.app.exports.minification !== false && env.wpc.mode === "production")
	{
		env.wpc.optimization = merge(env.wpc.optimization || {},
		{
			minimize: true,
			minimizer: [
				new TerserPlugin(
				env.esbuild ?
				{
					minify: TerserPlugin.esbuildMinify,
					terserOptions: {
						// @ts-ignore
						drop: [ "debugger" ],
						// compress: true,
						// mangle: true,   // Default `false`
						format: { ecma: 2020, comments: false },
						minify: true,
						sourceMap: false,
						treeShaking: true,
						// Keep the class names otherwise @log won"t provide a useful name
						keepNames: true,
						// keep_names: true,
						target: "es2020",
					}
				} :
				{
					extractComments: false,
					parallel: true,
					terserOptions: {
						compress: {
							drop_debugger: true,
						},
						// compress: true,
						// mangle: true,   // Default `false`
						ecma: 2020,
						sourceMap: false,
						format: {},
						// format: {       // Default {}
						// 	comments: false, // default "some"
						// 	shebang: true
						// },
						// toplevel (default false) - set to true to enable top level variable
						// and function name mangling and to drop unused variables and functions.
						// toplevel: false,
						// nameCache: null,
						// Keep the class names otherwise @log won"t provide a useful name
						keep_classnames: true,
						module: true,
					}
				})
			]
		});
	}
};


export default minification;
