
import { figures, writeInfo } from "./webpack/console.js";
import {
	context, devtool, entry, externals, ignorewarnings, minification, mode, plugins,
	optimization, output, resolve, rules, stats, target, watch, environment
} from "./webpack/exports/index.js";

/** @typedef {import("./webpack/types/webpack").WebpackArgs} WebpackArgs */
/** @typedef {import("./webpack/types/webpack").WebpackBuild} WebpackBuild */
/** @typedef {import("./webpack/types/webpack").WebpackConfig} WebpackConfig */
/** @typedef {import("./webpack/types/webpack").WebpackEnvironment} WebpackEnvironment */

let buildStep = 0;


/**
 * Webpack Export
 *
 * @param {WebpackEnvironment} env Environment variable containing runtime options passed
 * to webpack on the command line (e.g. `webpack --env environment=test --env clean=true`).
 * @param {WebpackArgs} argv Webpack command line args
 * @returns {WebpackConfig|WebpackConfig[]}
 */
export default (env, argv) =>
{
	writeInfo("--------------------------------------------");
	writeInfo(" Start Test-Utils NPM Package Webpack build");
	writeInfo("--------------------------------------------");
	writeInfo("   Argv:");
	writeInfo("   " + JSON.stringify(argv, null, 3).replace(/\n/g, "\n     " + figures.color.info + "    "));
	writeInfo("   Env :");
	writeInfo("   " + JSON.stringify(env, null, 3).replace(/\n/g, "\n     " + figures.color.info + "    "));
	writeInfo("--------------------------------------------");

	env = Object.assign(
	{
		clean: false,
		analyze: false,
		fa: "custom",
		imageOpt: true,
		environment: "prod",
		target: "node"
	}, env);

	Object.keys(env).filter(k => typeof env[k] === "string" && /(?:true|false)/i.test(env[k])).forEach((k) =>
	{
		env[k] = env[k].toLowerCase() === "true";
	});

	if (env.build){
		return getWebpackConfig(env.build, env, argv);
	}

	return [
		getWebpackConfig("node", env, argv)
	];
};


/**
 * @method getWebpackConfig
 * @param {WebpackBuild} buildTarget
 * @param {WebpackEnvironment} env Webpack build environment
 * @param {WebpackArgs} argv Webpack command line args
 * @returns {WebpackConfig}
 */
const getWebpackConfig = (buildTarget, env, argv) =>
{
	if (buildStep > 0) { console.log(""); }
	writeInfo(`Start Webpack build step ${++buildStep}`);
	/** @type {WebpackConfig}*/
	const wpConfig = {};
	environment(buildTarget, env, argv); // Base path / Build path
	mode(env, argv, wpConfig);           // Mode i.e. "production", "development", "none"
	target(env, wpConfig);               // Target i.e. "node", "webworker", "tests"
	context(env, wpConfig);              // Context for build
	entry(env, wpConfig);                // Entry points for built output
	externals(env, wpConfig);            // External modules
	ignorewarnings(env, wpConfig);       // Warnings from the compiler to ignore
	optimization(env, wpConfig);         // Build optimization
	minification(env, wpConfig);         // Minification / Terser plugin options
	output(env, wpConfig);               // Output specifications
	devtool(env, wpConfig);              // Dev tool / sourcemap control
	plugins(env, wpConfig);              // Webpack plugins
	resolve(env, wpConfig);              // Resolve config
	rules(env, wpConfig);                // Loaders & build rules
	stats(env, wpConfig);                // Stats i.e. console output & verbosity
	watch(env, wpConfig, argv);			 // Watch-mode options
	wpConfig.name = `${buildTarget}:${wpConfig.mode}`;
	wpConfig.node ={ global: false };
	return wpConfig;
};
