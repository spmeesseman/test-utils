/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable import/no-extraneous-dependencies */
// @ts-check

const path = require("path");
const wpConsole = require("./webpack/console");
const {
	context, devtool, entry, externals, ignorewarnings, minification,  mode, plugins, optimization,
	output, resolve, rules, stats, target, watch
} = require("./webpack/exports");

/** @typedef {import("./webpack/types/webpack").WebpackBuild} WebpackBuild */
/** @typedef {import("./webpack/types/webpack").WebpackConfig} WebpackConfig */
/** @typedef {import("./webpack/types/webpack").WebpackEnvironment} WebpackEnvironment */
/** @typedef {{ mode: "none"|"development"|"production"|undefined, env: WebpackEnvironment, config: String[] }} WebpackArgs */

let buildStep = 0;


/**
 * Webpack Export
 *
 * @param {WebpackEnvironment} env Environment variable containing runtime options passed
 * to webpack on the command line (e.g. `webpack --env environment=test --env clean=true`).
 * @param {WebpackArgs} argv Webpack command line args
 * @returns {WebpackConfig|WebpackConfig[]}
 */
module.exports = (env, argv) =>
{
	wpConsole.writeInfo("Start Webpack build");

	env = Object.assign(
	{
		clean: false,
		analyze: false,
		esbuild: false,
		fa: "custom",
		imageOpt: true,
		environment: "prod",
		target: "node"
	}, env);

	Object.keys(env).filter(k => typeof env[k] === "string" && /(?:true|false)/i.test(env[k])).forEach((k) =>
	{
		env[k] = env[k].toLowerCase() === "true";
	});

	env.esbuild = true;

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
	wpConsole.writeInfo(`Start Webpack build step ${++buildStep}`);
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
	watch(env, wpConfig);				 // Watch-mode options
	wpConfig.name = `${buildTarget}:${wpConfig.mode}`;
	wpConfig.node ={ global: false };
	return wpConfig;
};


/**
 * @method environment
 * @param {WebpackBuild} buildTarget
 * @param {WebpackEnvironment} env Webpack build environment
 * @param {WebpackArgs} argv Webpack command line args
 */
const environment = (buildTarget, env, argv) =>
{
	env.build = buildTarget;
	env.buildPath = __dirname;
	if (env.build === "tests") {
		env.basePath = path.join(__dirname, "src", "test");
	}
	else {
		env.basePath = __dirname;
	}
	wpConsole.writeInfo("Environment:");
	Object.keys(env).forEach((k) => { wpConsole.writeInfo(`   ${k.padEnd(15)}: ${env[k]}`); });
	if (argv)
	{
		wpConsole.writeInfo("Arguments:");
		if (argv.mode) {
			wpConsole.writeInfo(`   mode          : ${argv.mode}`);
		}
		if (argv.config) {
			wpConsole.writeInfo(`   config        : ${argv.config.join(", ")}`);
		}
	}
};
