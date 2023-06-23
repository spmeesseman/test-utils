
import { join } from "path";
import { existsSync, readFileSync } from "fs";
import { INycConfig, ITestUtilsOptions } from "../types";


export default (options: ITestUtilsOptions): INycConfig =>
{
	const isWebpackBuild = existsSync(join(options.projectRoot, "dist", "vendor.js"));

	let cfgFile = join(options.projectRoot, ".nycrc.json");
	if (existsSync(cfgFile)) {
		try {
			return <INycConfig>JSON.parse(readFileSync(cfgFile, "utf8"));
		} catch {}
	}

	cfgFile = join(options.projectRoot, ".nycrc");
	if (existsSync(cfgFile)) {
		try {
			return <INycConfig>JSON.parse(readFileSync(cfgFile, "utf8"));
		} catch {}
	}

	cfgFile = join(options.projectRoot, "nycrc.json");
	if (existsSync(cfgFile)) {
		try {
			return <INycConfig>JSON.parse(readFileSync(cfgFile, "utf8"));
		} catch {}
	}

	return <INycConfig>Object.assign({
		extends: "@istanbuljs/nyc-config-typescript",
		all: false,
		cwd: options.projectRoot,
		hookRequire: true,
		hookRunInContext: true,
		hookRunInThisContext: true,
		instrument: true,
		reportDir: "./.coverage",
		showProcessTree: true,
		silent: false,
		tempDir: "./.nyc_output",
		useSpawnWrap: false,
		reporter: [ "text-summary", "html", "json", "lcov", "cobertura" ],
		include: !isWebpackBuild ? [ "dist/client/**/*.js", "common/lib/**/*.js", "dist/server/**/*.js" ] :
								   [ "dist/client.js", "dist/server.js" ],
		exclude: !isWebpackBuild ? [ "dist/**/test/**", "node_modules/**" ] :
								   [ "dist/**/test/**", "node_modules/**", "dist/vendor.js", "dist/runtime.js" ]
	}, options.nycConfig);
};
