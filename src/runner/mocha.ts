/* eslint-disable import/no-extraneous-dependencies */

import * as glob from "glob";
import Mocha, { MochaOptions } from "mocha";
import { basename, resolve } from "path";
import { ITestUtilsOptions } from "../types";


export default (options: ITestUtilsOptions) =>
{
	//
	// Create the mocha test
	//
	const mocha = new Mocha(Object.assign({
		ui: "tdd", // the TDD UI is being used in extension.test.ts (suite, test, etc.)
		color: true, // colored output from test results,
		timeout: 30000, // default timeout: 10 seconds
		retries: 0, // ,
		slow: 250,
		require: [
		    "ts-node/register",
		    "source-map-support/register"
		]
		// reporter: "mocha-multi-reporters",
		// reporterOptions: {
		//     reporterEnabled: "spec, mocha-junit-reporter",
		//     mochaJunitReporterReporterOptions: {
		//         mochaFile: __dirname + "/../../coverage/junit/extension_tests.xml",
		//         suiteTitleSeparatedBy: ": "
		//     }
		// }
	}, <Partial<MochaOptions>>options.tests.config));

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
	const files = glob.sync(filesToTest, { cwd: options.tests.root });
	files.sort((a: string, b: string) => basename(a) < basename(b) ? -1 : 1)
		 .forEach(f => mocha.addFile(resolve(<string>options.tests.root, f)));

	return mocha;
};
