/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/naming-convention */

import resolveFrom from "resolve-from";
const NYC = require("nyc");


export default async(nycConfig: any) =>
{
    const nyc = new NYC(nycConfig),
		  xArgs = JSON.parse(process.env.xArgs || "[]"),
          noClean = xArgs.includes("--nyc-no-clean");
	//
	// Check the modules already loaded and warn in case of race condition
	// (ideally, at this point the require cache should only contain one file - this module)
	//
	const myFilesRegex = /vscode-extjs\/dist/,
			filterFn = myFilesRegex.test.bind(myFilesRegex);
	if (Object.keys(require.cache).filter(filterFn).length > 1)
	{
		console.warn("NYC initialized after modules were loaded", Object.keys(require.cache).filter(filterFn));
	}

	//
	// Debug which files will be included/excluded
	// console.log('Glob verification', await nyc.exclude.glob(nyc.cwd));
	//
	if (noClean)
	{
		await nyc.createTempDirectory();
	}
	else {
		try {
			await nyc.reset();
		}
		catch {
			await nyc.createTempDirectory();
		}
	}

	const env: any = {
		NYC_CONFIG: JSON.stringify(nycConfig),
		NYC_CWD: nycConfig.cwd // process.cwd()
	};

	if (nycConfig.babelCache === false)
	{   //
		// babel's cache interferes with some configurations, so is
		// disabled by default. opt in by setting babel-cache=true.
		//
		env.BABEL_DISABLE_CACHE = process.env.BABEL_DISABLE_CACHE = "1";
	}

	if (!nycConfig.useSpawnWrap)
	{
		const requireModules = [
			require.resolve("../../../node_modules/nyc/lib/register-env.js"),
			...nyc.require.map((mod: any) => resolveFrom.silent(nyc.cwd, mod) || mod)
		];
		// eslint-disable-next-line import/no-extraneous-dependencies
		const preloadList = require("node-preload");
		preloadList.push(
			...requireModules,
			require.resolve("./wrap.js")
		);
		Object.assign(process.env, env);
		requireModules.forEach(mod => { require(mod); });
	}

	if (nycConfig.all)
	{
		await nyc.addAllFiles();
	}

	if (nycConfig.useSpawnWrap)
	{   //
		// This is where we are failing now in our efforts to wrap the server spawn for coverage.
		// The vscode-languageclient module files to launch the server when these final lines are
		// enabled.  For now, we just use the nyc.wrap() like we always have, so that at least the
		// client process is wrapped when the bootstrap-fork starts it's thing in the VSCode engine.
		//
		// TODO - ^^^ Next try is to build a mocha command line instead of instantisting an instance
		//        programatically, and use foreground() in indext.ts to launch it.  THis would pretty
		//        much replicate how nyc/bin/nyc.js works.
		//
		/* TEMP */ nyc.wrap(); /* TEMP */
		// const sw = require("spawn-wrap"),
		//       wrapper = require.resolve("./wrap.js");
		// sw.runMain();
		// env.SPAWN_WRAP_SHIM_ROOT = process.env.SPAWN_WRAP_SHIM_ROOT || process.env.XDG_CACHE_HOME || require("os").homedir();
		// sw([ wrapper ], env);
	}

	return nyc;
};
