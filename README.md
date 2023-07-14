# Test Utils - JS/TS Unit Testing Tools

[![authors](https://img.shields.io/badge/authors-scott%20meesseman-6F02B5.svg?logo=visual%20studio%20code)](https://www.littlesm.com) [![app-category](https://img.shields.io/badge/category-releases%20automation%20npm-blue.svg)](https://www.spmeesseman.com) [![app-lang](https://img.shields.io/badge/language-typescript%20javascript-blue.svg)](https://www.spmeesseman.com) [![test-utils](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-app--publisher-e10000.svg)](https://github.com/spmeesseman/test-utils)

[![GitHub issues open](https://img.shields.io/github/issues-raw/spmeesseman/test%2dutils.svg?logo=github)](https://github.com/spmeesseman/test-utils/issues) [![GitHub issues closed](https://img.shields.io/github/issues-closed-raw/spmeesseman/test%2dutils.svg?logo=github)](https://github.com/spmeesseman/test-utils/issues) [![GitHub pull requests](https://img.shields.io/github/issues-pr/spmeesseman/test%2dutils.svg?logo=github)](https://github.com/spmeesseman/test-utils/pulls) [![GitHub last commit](https://img.shields.io/github/last-commit/spmeesseman/test%2dutils.svg?logo=github)](https://github.com/spmeesseman/test-utils)

[![PayPalDonate](https://img.shields.io/badge/paypal-donate-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=YWZXT3KE2L4BA&item_name=taskexplorer&currency_code=USD) [![codecov](https://codecov.io/gh/spmeesseman/test-utils/branch/master/graph/badge.svg)](https://codecov.io/gh/spmeesseman/test-utils) [![CodeFactor](https://www.codefactor.io/repository/github/spmeesseman/test-utils/badge)](https://www.codefactor.io/repository/github/spmeesseman/test-utils)

- [Test Utils - JS/TS Unit Testing Tools](#test-utils---jsts-unit-testing-tools)
  - [Description](#description)
  - [Requirements](#requirements)
  - [Installation](#installation)
  - [General Setup](#general-setup)
  - [Screenshots](#screenshots)
- [Test Runner Options](#test-runner-options)
- [Runtime Tracking Usage](#runtime-tracking-usage)

## Description

A unit testing utility suite, primarily to track fastest/slowest runtimes per test/suite, and to make writing tests a little less s\*\*\*\*\*\*.

## Requirements

- NodeJs 16.x
- JavaScript or TypeScript Project
- As of v1, tests written using the Mocha framework
- As of v1, NYC for optional coverage

## Installation

To install test-utils globally, run the following command:

    npm install -g @spmeesseman/test-utils

To install locally per project, run the following command from the directory containing the projects package.json file:

    npm install @spmeesseman/test-utils

## General Setup

The main purpose of this package is to provide a convenient interface for tracking of fastest and slowest times for each test / suite in multiple projects.

Example Code:

node ./path/to/tests/runTests.js

runTests.js:

    require("./index")()
    .then((exitCode: number) =>
    {
        process.exitCode = exitCode;
    })
    .catch(() =>
    {
        process.exitCode = 1;
    });

index.ts:

    import { TestRunner } from "@spmeesseman/test-utils";
    const runner = new TestRunner({ ...options });
    try {
		await runner.run();
	}
	catch (error) {
		try {
			console.error(error.message);
		} catch (_) {}
		process.exit(1);
	};

Within tests one-time initialization:

    import { TestTracker, colors, figures } from "@spmeesseman/test-utils";
    const testTracker = new TestTracker();
    export const consoleWrite = testTracker.utils.writeConsole;
    export const isRollingCountError = testTracker.isRollingCountError;
    export const getSuccessCount = testTracker.utils.getSuccessCount;
    export const suiteFinished = testTracker.utils.suiteFinished;
    export const endRollingCount = testTracker.utils.endRollingCount;
    export const exitRollingCount = testTracker.utils.exitRollingCount;

## Screenshots

![ss0](res/readme/results.png?raw=true) 

# Test Runner Options

TODO

# Runtime Tracking Usage

TODO
