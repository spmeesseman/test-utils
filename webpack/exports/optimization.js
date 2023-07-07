// @ts-check

/**
 * @module webpack.exports.optimization
 */

/** @typedef {import("../types/webpack").WebpackConfig} WebpackConfig */
/** @typedef {import("../types/webpack").WebpackEnvironment} WebpackEnvironment */


/**
 * @method optimization
 * @param {WebpackEnvironment} env Webpack build environment
 * @param {WebpackConfig} wpConfig Webpack config object
 */
const optimization = (env, wpConfig) =>
{
	wpConfig.parallelism = 1;

	// if (env.build === "webview")
	// {
	// 	wpConfig.parallelism = Object.keys(webviewApps).length;
	// }
	// else if (env.build === "extension" && env.environment === "test") {
	// 	wpConfig.parallelism = 3;
	// }
	// else {
	// 	wpConfig.parallelism = 2;
	// }

	// wpConfig.optimization =
	// {
	// 	runtimeChunk: env.environment === "prod" || env.environment === "test" ? "single" : undefined,
	// 	splitChunks: false
	// };
	// if (env.build !== "browser")
	// {
	// 	wpConfig.optimization.splitChunks = {
	// 		cacheGroups: {
	// 			vendor: {
	// 				test: /node_modules/,
	// 				name: "vendor",
	// 				chunks: "all"
	// 			}
	// 		}
	// 	};
	// }
};


export default optimization;
