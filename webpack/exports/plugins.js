/* eslint-disable import/no-extraneous-dependencies */
// @ts-check

/**
 * @module wpbuild.exports.plugins
 */

import {
	analyze, banner, clean, copy, dispose, environment, instrument, istanbul, loghooks,
	ignore, optimization, progress, runtimevars, sourcemaps, licensefiles, tscheck, upload,
	cssextract, htmlcsp, imageminimizer, htmlinlinechunks, testsuite, vendormod, webviewapps, scm
} from "../plugin";

/** @typedef {import("../types").WpBuildWebpackArgs} WpBuildWebpackArgs */
/** @typedef {import("../types").WpBuildEnvironment} WpBuildEnvironment */
/** @typedef {import("../types").WebpackPluginInstance} WebpackPluginInstance */


/**
 * @function
 * @param {WpBuildEnvironment} env Webpack build specific environment
 */
const plugins = (env) =>
{
	env.wpc.plugins = [];

	env.wpc.plugins.push(
		loghooks(env),                 // logs all compiler.hooks.* when they run
		environment(env),              // compiler.hooks.environment
		vendormod(env),                // compiler.hooks.afterEnvironment - mods to vendor plugins and/or modules
		progress(env),                 //
		...clean(env),                 // compiler.hooks.emit, compiler.hooks.done
		testsuite(env),                // compiler.hooks.beforeCompile - build tests / test suite
		istanbul(env),                 // compiler.hooks.compilation - add istanbul ignores to node-requires
		runtimevars(env),              // compiler.hooks.compilation
		instrument(env),               // ? - TODO -?
		ignore(env),                   // compiler.hooks.normalModuleFactory
		...tscheck(env),               // compiler.hooks.afterEnvironment, hooks.afterCompile
	);

	if (env.build === "webview")
	{
		const apps = Object.keys(env.app.vscode.webview.apps);
		env.wpc.plugins.push(
			cssextract(env),           //
			...webviewapps(apps, env), //
			// @ts-ignore
			htmlcsp(env),              //
			htmlinlinechunks(env),     //
			...copy(apps, env),        // compiler.hooks.thisCompilation -> compilation.hooks.processAssets
			imageminimizer(env)        //
		);
	}
	else if (env.build !== "tests")
	{
		env.wpc.plugins.push(
			sourcemaps(env),           // compiler.hooks.compilation -> compilation.hooks.processAssets
			banner(env),               // compiler.hooks.compilation -> compilation.hooks.processAssets
			...copy([], env),          // compiler.hooks.thisCompilation -> compilation.hooks.processAssets
			analyze.bundle(env),       // compiler.hooks.done
			analyze.visualizer(env),   // compiler.hooks.emit
			analyze.circular(env)      // compiler.hooks.compilation -> compilation.hooks.optimizeModules
		);
	}

	env.wpc.plugins.push(              // compiler.hooks.compilation -> compilation.hooks.optimizeChunks, ...
		...optimization(env),          // ^compiler.hooks.shouldEmit, compiler.hooks.compilation -> compilation.hooks.shouldRecord
		upload(env),                   // compiler.hooks.afterDone
		licensefiles(env),             // compiler.hooks.shutdown
		scm(env),                      // compiler.hooks.shutdown
		dispose(env)                   // perform cleanup, dispose registred disposables
	);

	env.wpc.plugins.slice().reverse().forEach((p, i, a) =>
	{
		if (!p) {
			env.wpc.plugins.splice(a.length - 1 - i, 1);
		}
	});
};


export default plugins;
