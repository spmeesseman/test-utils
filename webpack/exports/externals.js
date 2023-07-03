// @ts-check

/**
 * @module webpack.exports.externals
 */

/** @typedef {import("../types/webpack").WebpackConfig} WebpackConfig */
/** @typedef {import("../types/webpack").WebpackEnvironment} WebpackEnvironment */

// eslint-disable-next-line import/no-extraneous-dependencies
import nodeExternals from "webpack-node-externals";


/**
 * @method
 * The vscode-module is created on-the-fly and must be excluded. Add other modules that cannot
 * be webpack'ed, -> https://webpack.js.org/configuration/externals/
 * @param {WebpackEnvironment} env Webpack build environment
 * @param {WebpackConfig} wpConfig Webpack config object
 */
const externals = (env, wpConfig) =>
{
	// if (env.build === "tests")
	// {
		wpConfig.externals = [
			// ({ context, request }, callback) =>
			// {
			// 	if (request && /^register$/.test(request)) {
			// 	  // Externalize to a commonjs module using the request path
			// 	  return callback(undefined, "commonjs " + request);
			// 	}
			// 	// Continue without externalizing the import
			// 	callback();
			// },
			// { "register-env.js": "commonjs register-env.js" },
			/** @type {import("webpack").WebpackPluginInstance}*/(nodeExternals())
		];
	// }
	// if (env.build === "webview")
	// {
	// 	wpConfig.externals = { vscode: "commonjs vscode" };
	// }
	// else if (env.environment === "test")
	// {
	// 	wpConfig.externals = [
	// 		{ vscode: "commonjs vscode" },
	// 		{ nyc: "commonjs nyc" },
	// 		/** @type {import("webpack").WebpackPluginInstance}*/(nodeExternals())
	// 	];
	// }
	// else {
	// 	wpConfig.externals = { vscode: "commonjs vscode" };
	// }
	if (env.build === "browser") {
		wpConfig.externalsPresets = { web: true };
	}
	else {
		wpConfig.externalsPresets = { node: true };
	}
};

export default externals;
