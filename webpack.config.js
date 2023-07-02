/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable import/no-extraneous-dependencies */
// @ts-check

const path = require("path");
const { wpPlugin } = require("./webpack/plugin/plugins");
const {
	context, devtool, entry, externals, ignorewarnings, minification,  mode, plugins, optimization,
	output, resolve, rules, stats, target
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
	consoleWrite("Start Webpack build");

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


const consoleWrite = (msg, icon, pad = "") =>
    console.log(`     ${pad}${icon || wpPlugin.figures.color.info}${msg ? " " + wpPlugin.figures.withColor(msg, wpPlugin.figures.colors.grey) : ""}`);


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
	consoleWrite(`Start Webpack build step ${++buildStep}`);
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
	wpConfig.name = `${buildTarget}:${wpConfig.mode}`;
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
	consoleWrite("Environment:");
	Object.keys(env).forEach((k) => { consoleWrite(`   ${k.padEnd(15)}: ${env[k]}`); });
	if (argv)
	{
		consoleWrite("Arguments:");
		if (argv.mode) {
			consoleWrite(`   mode          : ${argv.mode}`);
		}
		if (argv.config) {
			consoleWrite(`   config        : ${argv.config.join(", ")}`);
		}
	}
};
