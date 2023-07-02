/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/naming-convention */

import resolveFrom from "resolve-from";
import { existsSync, readFileSync } from "fs";
import { join, relative, resolve } from "path";
import { ITestCoverageToolConfig, ITestRunOptions } from "../interface";

const NYC = require("nyc");


export default async(options: ITestRunOptions) =>
{
    const nycConfig = Object.assign({}, defaultConfig(options), options.coverage.config);
	//
	// Instantiate an NYC instance and wrap the current running extension host process. This
	// differs a bit from the way nyc is normally used on the command line.
	//
	const nyc = new NYC(nycConfig);
	nyc.wrap();
	//
	// Check the modules already loaded and warn in case of race condition
	// (ideally, at this point the require cache should only contain one file - this module (& helper imports)
	//
	const myFilesRegex = new RegExp(`${options.moduleName}[\\/\\\\]${options.moduleBuildDir}[\\/\\\\]`),
		  filterFn = myFilesRegex.test.bind(myFilesRegex),
		  moduleCountShouldBe = 5;
	if (Object.keys(require.cache).filter(filterFn).length > moduleCountShouldBe)
	{
		console.warn("NYC initialized after modules were loaded", Object.keys(require.cache).filter(filterFn));
	}
	//
	// Debug which files will be included/excluded
	// console.log('Glob verification', await nyc.exclude.glob(nyc.cwd));
	//
	if (!options.coverage.clean)
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
	//
	// Prepare environment for spawned processes
	//
	const env: any = {
		NYC_CONFIG: JSON.stringify(nycConfig),
		NYC_CWD: nycConfig.cwd
	};
   	//
	// Babel's cache interferes with some configurations, so is disabled by default, it can be
	// re-enabled with the configuration babelCache=`false`
	//
	if (nycConfig.babelCache === false)
	{
		env.BABEL_DISABLE_CACHE = process.env.BABEL_DISABLE_CACHE = "1";
	}
	//
	// Initialize nyc environment vars and process wrap if not using the spawn-wrap module/option
	//
	if (!nycConfig.useSpawnWrap)
	{
		const nycLibPath = relative(__dirname, resolve(nyc.cwd, "node_modules", "nyc", "lib")).replace(/\\/g, "/");
		const requireModules = [
			// require.resolve(`${nycLibPath}/register-env.js`),
			`${nycLibPath}/register-env.js`,
			...nyc.require.map((mod: string) => resolveFrom.silent(nyc.cwd, mod) || mod)
		];
		// eslint-disable-next-line import/no-extraneous-dependencies
		const preloadList = require("node-preload");
		preloadList.push(
			...requireModules,
			// require.resolve(`${nycLibPath}/wrap.js`)
			`${nycLibPath}/wrap.js`
		);
		Object.assign(process.env, env);
		requireModules.forEach(mod => { require(mod); });
	}
	//
	// Call addAllFiles() AFTER importing register-env module (if (!nycConfig.useSpawnWrap))
	//
	if (nycConfig.all)
	{
		await nyc.addAllFiles();
	}
	//
	// Initialize spawn-wrap module if required
	//
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
		// UPDATE 6/22/23 - Have language server srapped FINALLY "without" using useSpawnWrap.  Key was
		//                  to use a node runtime to directly spawn the server, as opposed to the
		//                  default fork.
		//
		const sw = require("spawn-wrap"),
			  nycBinPath = relative(__dirname, resolve(nyc.cwd, "node_modules", "nyc", "bin")).replace(/\\/g, "/"),
		      wrapper = require.resolve(`${nycBinPath}/wrap.js`);
		sw.runMain();
		env.SPAWN_WRAP_SHIM_ROOT = process.env.SPAWN_WRAP_SHIM_ROOT || process.env.XDG_CACHE_HOME || require("os").homedir();
		sw([ wrapper ], env);
	}

	return nyc;
};


const defaultConfig = (options: ITestRunOptions): Partial<ITestCoverageToolConfig> =>
{
	let cfgFile = join(options.projectRoot, ".nycrc.json");
	if (existsSync(cfgFile)) {
		try { return <ITestCoverageToolConfig>JSON.parse(readFileSync(cfgFile, "utf8")); } catch {}
	}

	cfgFile = join(options.projectRoot, ".nycrc");
	if (existsSync(cfgFile)) {
		try { return <ITestCoverageToolConfig>JSON.parse(readFileSync(cfgFile, "utf8")); } catch {}
	}

	cfgFile = join(options.projectRoot, "nycrc.json");
	if (existsSync(cfgFile)) {
		try { return <ITestCoverageToolConfig>JSON.parse(readFileSync(cfgFile, "utf8")); } catch {}
	}

	return {
		extends: "@istanbuljs/nyc-config-typescript",
		cwd: options.projectRoot,
		hookRequire: true,
		hookRunInContext: true,
		hookRunInThisContext: true,
		instrument: true,
		reportDir: "./.coverage",
		silent: false,
		reporter: [ "text-summary", "html" ],
		include: [ "dist/**/*.js" ],
		exclude: [ "dist/**/test/**", "node_modules/**" ]
	};
};

