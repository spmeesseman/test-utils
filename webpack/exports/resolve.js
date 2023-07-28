/* eslint-disable @typescript-eslint/naming-convention */
// @ts-check

/**
 * @module webpack.exports.resolve
 */

/** @typedef {import("../types").WebpackConfig} WebpackConfig */
/** @typedef {import("../types").WebpackEnvironment} WebpackEnvironment */

import { resolve as _resolve } from "path";


/**
 * @method
 * @param {WebpackEnvironment} env Webpack build environment
 * @param {WebpackConfig} wpConfig Webpack config object
 */
const resolve = (env, wpConfig) =>
{
	wpConfig.resolve =
	{
		fallback: env.build === "browser" ? { path: require.resolve("path-browserify"), os: require.resolve("os-browserify/browser") } : undefined,
		mainFields: env.build === "browser" ? [ "browser", "module", "main" ] : [ "module", "main" ],
		extensions: [ ".ts", ".tsx", ".js", ".jsx", ".json" ],
		fullySpecified: false,
		alias: {
			":env": _resolve(env.paths.build, "src", "lib", "env", env.build === "browser" ? "browser" : "node"),
			":types": _resolve(env.paths.build, "types")
		},
		extensionAlias: {
			".js": [ ".ts", ".js" ],
			".mjs": ".mts",
			".cjs": ".cts"
		}
	};
};


export default resolve;
