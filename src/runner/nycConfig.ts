
import { existsSync, readFileSync } from "fs";
import { join, resolve } from "path";

type NycConfig = Record<string, boolean | string | string[]>;


export default (): NycConfig =>
{
	const xArgs = JSON.parse(process.env.xArgs || "[]"),
		projectRoot = resolve(__dirname, "..", "..", "..", ".."),
		isWebpackBuild = existsSync(join(projectRoot, "dist", "vendor.js")),
		noClean = xArgs.includes("--nyc-no-clean");

	// while (!existsSync(join(projectRoot, "package.json"))) {
	// 	projectRoot = resolve(projectRoot, "..");
	// }
	let cfgFile = join(projectRoot, ".nycrc.json");
	if (existsSync(cfgFile)) {
		try {
			return <NycConfig>JSON.parse(readFileSync(cfgFile, "utf8"));
		} catch {}
	}

	cfgFile = join(projectRoot, ".nycrc");
	if (existsSync(cfgFile)) {
		try {
			return <NycConfig>JSON.parse(readFileSync(cfgFile, "utf8"));
		} catch {}
	}

	cfgFile = join(projectRoot, "nycrc.json");
	if (existsSync(cfgFile)) {
		try {
			return <NycConfig>JSON.parse(readFileSync(cfgFile, "utf8"));
		} catch {}
	}

	return <NycConfig>{
		extends: "@istanbuljs/nyc-config-typescript",
		all: false,
		cwd: projectRoot,
		hookRequire: true,
		hookRunInContext: true,
		hookRunInThisContext: true,
		instrument: true,
		noClean,
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
	};
};
