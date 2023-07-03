// @ts-check

/**
 * @module webpack.exports.entry
 */

/** @typedef {import("../types/webpack").WebpackConfig} WebpackConfig */
/** @typedef {import("../types/webpack").WebpackEnvironment} WebpackEnvironment */


/**
 * @method entry
 * @param {WebpackEnvironment} env Webpack build environment
 * @param {WebpackConfig} wpConfig Webpack config object
 */

//
// *************************************************************
// *** ENTRY POINTS                                          ***
// *************************************************************
//
/**
 * @method
 * @param {WebpackEnvironment} env Webpack build environment
 * @param {WebpackConfig} wpConfig Webpack config object
 */
const entry = (env, wpConfig) =>
{
	if (env.build === "tests")
	{
		// const testFiles = glob.sync("./src/test/suite/**/*.{test,spec}.ts").reduce(
		// 	(obj, e)=>
		// 	{
		// 		obj["suite/" + path.parse(e).name] = e;
		// 		return obj;
		// 	}, {}
		// );
		wpConfig.entry =
		{
			runTest: "./src/test/runTest.ts"
			// "run/index": "./src/test/run/index.ts",
			// ...testFiles
		};
	}
	else
	{
		wpConfig.entry =
		{
			testutils: {
				import: "./src/index.ts",
				filename: "testutils.cjs",
				library: {
					type: "commonjs2"
				}
			}
		};
	}
};


export default entry;
