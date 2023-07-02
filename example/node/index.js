
const { TestRunner } = require("@spmeesseman/test-utils");

module.exports = () =>
{
    const xArgs = JSON.parse(process.env.xArgs || "[]"),
          testArgs = JSON.parse(process.env.testArgs || "[]"),
          clean = !xArgs.includes("--nyc-no-clean") || xArgs.includes("--nyc-clean"),
          projectRoot = resolve(__dirname, "..", "..", ".."),
          verbose = xArgs.includes("--nyc-verbose"),
          silent = xArgs.includes("--nyc-silent");

    return new TestRunner(
    {
        moduleBuildDir: "dist",
        moduleName: "my-node-module",
        projectRoot,
        register: {
            sourceMapSupport: true,
            tsNode: true
        },
        coverage: {
            clean,
            tool: "nyc",
            config: {
                clean,
                cwd: projectRoot,
                hookRequire: true,
                hookRunInContext: true,
                hookRunInThisContext: true,
                instrument: true,
                reportDir: "./.coverage",
                showProcessTree: verbose,
                silent,
                reporter: [ "text-summary", "html" ],
                include: [ "dist/my-node-module.js" ],
                exclude: [ "dist/test", "node_modules", "dist/vendor.js", "dist/runtime.js" ]
            },
        },
        framework: {
            type: "mocha",
            root: __dirname,
            suite: testArgs,
            config: {
                ui: "tdd",       // The TDD UI 
                color: true,     // colored output from test results,
                timeout: 30000,  // default timeout: 10 seconds
                retries: 0,
                slow: 250
            }
        }
    })
    .run();
};
