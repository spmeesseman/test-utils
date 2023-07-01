/* eslint-disable import/no-extraneous-dependencies */

import * as glob from "glob";
import Mocha, { MochaOptions } from "mocha";
import { existsSync, readFileSync } from "fs";
import { basename, join, relative, resolve } from "path";
import { ITestRunOptions, ITestToolConfig } from "../interface";


export default (options: ITestRunOptions) =>
{
	const config: MochaOptions = Object.assign({}, defaultConfig(options), <Readonly<MochaOptions>>options.tests.config);

	// if (options.register.tsNode) {
	// 	mocha.require = [
	// 		"ts-node/register"
	// 	];
	// }
	// if (options.register.sourceMapSupport) {
	// 	mocha.require = [
	// 		"source-map-support/register"
	// 	];
	// }

	const mocha = new Mocha(config);

	let filesToTest = "**/*.{spec,test}.js";
	if (options.tests.suite && options.tests.suite.length > 0)
	{
		filesToTest = (options.tests.suite.length > 1 ? "{" : "");
		options.tests.suite.forEach((a: string) =>
		{
			if (filesToTest.length > 1) {
				filesToTest += ",";
			}
			filesToTest += `**/${a}.{spec,test}.js`;
		});
		filesToTest += (options.tests.suite.length > 1 ? "}" : "");
	}

	//
	// Add all files to the test suite
	//
	const root = <string>options.tests.root,
		  sortGroup = options.tests.sortGroup,
		  files = glob.sync(filesToTest, { cwd: options.tests.root });
	if (!sortGroup)
	{
		files.sort((a: string, b: string) => basename(a) < basename(b) ? -1 : 1);
	}
	else
	{
		files.sort((a: string, b: string) =>
		{
			const pA = sortGroup.includes(relative(root, a)) ? relative(root, a) : basename(a),
				  pB = sortGroup.includes(relative(root, b)) ? relative(root, b) : basename(b);
			return pA < pB ? -1 : 1;
		});
	}
	files.forEach(f => mocha.addFile(resolve(root, f)));

	return mocha;
};


const defaultConfig = (options: ITestRunOptions): Partial<ITestToolConfig> =>
{
	let cfgFile = join(options.projectRoot, ".mocharc.json");
	if (existsSync(cfgFile)) {
		try { return <ITestToolConfig>JSON.parse(readFileSync(cfgFile, "utf8")); } catch {}
	}

	cfgFile = join(options.projectRoot, ".mocharc");
	if (existsSync(cfgFile)) {
		try { return <ITestToolConfig>JSON.parse(readFileSync(cfgFile, "utf8")); } catch {}
	}

	cfgFile = join(options.projectRoot, "mocharc.json");
	if (existsSync(cfgFile)) {
		try {return <ITestToolConfig>JSON.parse(readFileSync(cfgFile, "utf8")); } catch {}
	}

	return {
		ui: "tdd",      // the TDD UI
		color: true,    // colored output from test results,
		timeout: 30000, // default timeout: 10 seconds
		retries: 0,
		slow: 250
		// require: [
		//     "ts-node/register",
		//     "source-map-support/register"
		// ]
		// reporter: "mocha-multi-reporters",
		// reporterOptions: {
		//     reporterEnabled: "spec, mocha-junit-reporter",
		//     mochaJunitReporterReporterOptions: {
		//         mochaFile: __dirname + "/../../coverage/junit/extension_tests.xml",
		//         suiteTitleSeparatedBy: ": "
		//     }
		// }
	};
};
